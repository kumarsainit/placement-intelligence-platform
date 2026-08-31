package com.placementintelligence;

import com.placementintelligence.dto.request.RefreshTokenRequest;
import com.placementintelligence.dto.request.SendOtpRequest;
import com.placementintelligence.dto.request.VerifyOtpRequest;
import com.placementintelligence.dto.response.LoginResponse;
import com.placementintelligence.dto.response.SendOtpResponse;
import com.placementintelligence.entity.OtpVerification;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.UnauthorizedException;
import com.placementintelligence.repository.OtpVerificationRepository;
import com.placementintelligence.security.JwtService;
import com.placementintelligence.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
    }

    @Test
    void testOtpLifecycleAndHardening() {
        String phone = "9876543210";
        String otpCode = "123456";

        // Seed OTP
        OtpVerification otp = OtpVerification.builder()
            .phoneNumber(phone)
            .otp(passwordEncoder.encode(otpCode))
            .attemptCount(0)
            .verified(false)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(300))
            .build();
        otpRepository.save(otp);

        // 1. Failed attempt with invalid OTP
        assertThrows(BadRequestException.class, () ->
            authService.verifyOtp(new VerifyOtpRequest(phone, "000000"))
        );

        // 2. Successful verification
        LoginResponse loginResponse = authService.verifyOtp(new VerifyOtpRequest(phone, otpCode));
        assertNotNull(loginResponse);
        assertNotNull(loginResponse.accessToken());
        assertNotNull(loginResponse.refreshToken());

        // 3. Replay attack rejection (already verified)
        BadRequestException replayEx = assertThrows(BadRequestException.class, () ->
            authService.verifyOtp(new VerifyOtpRequest(phone, otpCode))
        );
        assertTrue(replayEx.getMessage().contains("already been verified"));

        // 4. Verify access vs refresh token separation
        assertTrue(jwtService.isAccessToken(loginResponse.accessToken()));
        assertFalse(jwtService.isRefreshToken(loginResponse.accessToken()));
        assertTrue(jwtService.isRefreshToken(loginResponse.refreshToken()));
        assertFalse(jwtService.isAccessToken(loginResponse.refreshToken()));

        // 5. Test Refresh Token endpoint flow
        LoginResponse refreshResponse = authService.refreshToken(new RefreshTokenRequest(loginResponse.refreshToken()));
        assertNotNull(refreshResponse);
        assertNotNull(refreshResponse.accessToken());
        assertNotNull(refreshResponse.refreshToken());
        assertTrue(jwtService.isAccessToken(refreshResponse.accessToken()));

        // 6. Access token cannot be used as refresh token
        assertThrows(UnauthorizedException.class, () ->
            authService.refreshToken(new RefreshTokenRequest(loginResponse.accessToken()))
        );
    }

    @Test
    void testOtpMaxAttemptsExceeded() {
        String phone = "9123456789";
        String otpCode = "654321";

        OtpVerification otp = OtpVerification.builder()
            .phoneNumber(phone)
            .otp(passwordEncoder.encode(otpCode))
            .attemptCount(0)
            .verified(false)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(300))
            .build();
        otpRepository.save(otp);

        // Attempt 1: fail
        assertThrows(BadRequestException.class, () ->
            authService.verifyOtp(new VerifyOtpRequest(phone, "111111"))
        );
        // Attempt 2: fail
        assertThrows(BadRequestException.class, () ->
            authService.verifyOtp(new VerifyOtpRequest(phone, "222222"))
        );
        // Attempt 3: fail -> max attempts reached
        BadRequestException maxEx = assertThrows(BadRequestException.class, () ->
            authService.verifyOtp(new VerifyOtpRequest(phone, "333333"))
        );
        assertTrue(maxEx.getMessage().contains("Maximum OTP verification attempts exceeded"));

        // Attempt 4: even with correct OTP, verification is rejected
        BadRequestException lockedEx = assertThrows(BadRequestException.class, () ->
            authService.verifyOtp(new VerifyOtpRequest(phone, otpCode))
        );
        assertTrue(lockedEx.getMessage().contains("Maximum OTP verification attempts exceeded"));
    }

    @Test
    void testSendOtpAndDevDeliveryBehavior() {
        String phone = "9888877777";

        SendOtpResponse sendResponse = authService.sendOtp(new SendOtpRequest(phone));
        assertNotNull(sendResponse);
        assertEquals(phone, sendResponse.phoneNumber());
        assertEquals("OTP sent successfully", sendResponse.message());

        var savedOtpOpt = otpRepository.findTopByPhoneNumberOrderByCreatedAtDesc(phone);
        assertTrue(savedOtpOpt.isPresent());
        OtpVerification savedOtp = savedOtpOpt.get();

        assertFalse(savedOtp.getVerified());
        assertEquals(0, savedOtp.getAttemptCount());
        assertNotNull(savedOtp.getOtp());
        assertTrue(savedOtp.getOtp().startsWith("$2a$") || savedOtp.getOtp().startsWith("$2b$"));

        // Verify Dev and Non-Dev delivery services directly
        var devDelivery = new com.placementintelligence.service.impl.DevOtpDeliveryService();
        assertDoesNotThrow(() -> devDelivery.deliverOtp(phone, "123456", 300L));

        var noOpDelivery = new com.placementintelligence.service.impl.NoOpOtpDeliveryService();
        assertDoesNotThrow(() -> noOpDelivery.deliverOtp(phone, "123456", 300L));
    }

    @Autowired
    private com.placementintelligence.controller.UserController userController;

    @Autowired
    private com.placementintelligence.repository.UserRepository userRepository;

    @Test
    void testUserRoleProvisioningPolicy() {
        // Create Super Admin
        com.placementintelligence.entity.User superAdmin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("superadmin_test")
                .phoneNumber("9999900001")
                .role(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // Create Admin
        com.placementintelligence.entity.User admin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("admin_test")
                .phoneNumber("9999900002")
                .role(com.placementintelligence.common.enums.UserRole.ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // Create User
        com.placementintelligence.entity.User user = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("user_test")
                .phoneNumber("9999900003")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        org.springframework.security.core.Authentication superAdminAuth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("superadmin_test", null);
        org.springframework.security.core.Authentication adminAuth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("admin_test", null);
        org.springframework.security.core.Authentication userAuth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("user_test", null);

        org.springframework.mock.web.MockHttpServletRequest mockRequest =
            new org.springframework.mock.web.MockHttpServletRequest();

        // 1. Regular user cannot assign roles (403 AccessDeniedException)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            userController.updateUserRole(
                userAuth,
                user.getId(),
                new com.placementintelligence.controller.UserController.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.ADMIN),
                mockRequest
            )
        );

        // 2. Admin cannot modify own role
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            userController.updateUserRole(
                adminAuth,
                admin.getId(),
                new com.placementintelligence.controller.UserController.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN),
                mockRequest
            )
        );

        // 3. Admin cannot assign ADMIN role
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            userController.updateUserRole(
                adminAuth,
                user.getId(),
                new com.placementintelligence.controller.UserController.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.ADMIN),
                mockRequest
            )
        );

        // 4. Admin cannot assign SUPER_ADMIN role
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            userController.updateUserRole(
                adminAuth,
                user.getId(),
                new com.placementintelligence.controller.UserController.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN),
                mockRequest
            )
        );

        // 5. Admin can assign RECRUITER role
        var res1 = userController.updateUserRole(
            adminAuth,
            user.getId(),
            new com.placementintelligence.controller.UserController.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.RECRUITER),
            mockRequest
        );
        assertTrue(res1.success());

        // 6. Super Admin can assign ADMIN role
        var res2 = userController.updateUserRole(
            superAdminAuth,
            user.getId(),
            new com.placementintelligence.controller.UserController.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.ADMIN),
            mockRequest
        );
        assertTrue(res2.success());
    }

    @Autowired
    private com.placementintelligence.service.JobApplicationService jobApplicationService;

    @Autowired
    private com.placementintelligence.repository.CompanyRepository companyRepository;

    @Autowired
    private com.placementintelligence.repository.RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private com.placementintelligence.repository.JobRepository jobRepository;

    @Autowired
    private com.placementintelligence.repository.UserResumeRepository userResumeRepository;

    @Autowired
    private com.placementintelligence.repository.JobApplicationRepository jobApplicationRepository;

    @Test
    void testStudentJobApplicationWorkflow() {
        // 1. Setup Student 1 and Student 2
        com.placementintelligence.entity.User student1 = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("student_app_1")
                .phoneNumber("9888800001")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        com.placementintelligence.entity.User student2 = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("student_app_2")
                .phoneNumber("9888800002")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 2. Setup Recruiter and Company
        com.placementintelligence.entity.User recruiterUser = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("recruiter_app_1")
                .phoneNumber("9888800003")
                .role(com.placementintelligence.common.enums.UserRole.RECRUITER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        com.placementintelligence.entity.Company company = companyRepository.save(
            com.placementintelligence.entity.Company.builder()
                .name("Acme Corp")
                .industry("Technology")
                .website("https://acme.example.com")
                .location("Bangalore")
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        com.placementintelligence.entity.RecruiterProfile recruiterProfile = recruiterProfileRepository.save(
            com.placementintelligence.entity.RecruiterProfile.builder()
                .user(recruiterUser)
                .company(company)
                .designation("Tech Recruiter")
                .department("HR")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 3. Setup Open Job and Closed Job
        com.placementintelligence.entity.Job openJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(company)
                .recruiter(recruiterProfile)
                .title("Software Engineer")
                .description("Build awesome things")
                .location("Bangalore")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.ENTRY_LEVEL)
                .openings(2)
                .applicationDeadline(java.time.LocalDate.now().plusDays(30))
                .status(com.placementintelligence.common.enums.JobStatus.OPEN)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        com.placementintelligence.entity.Job closedJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(company)
                .recruiter(recruiterProfile)
                .title("Closed Position")
                .description("No longer open")
                .location("Remote")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.ENTRY_LEVEL)
                .openings(1)
                .applicationDeadline(java.time.LocalDate.now().plusDays(10))
                .status(com.placementintelligence.common.enums.JobStatus.CLOSED)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 4. Setup Resumes for Students
        com.placementintelligence.entity.UserResume resume1 = userResumeRepository.save(
            com.placementintelligence.entity.UserResume.builder()
                .user(student1)
                .fileName("resume1.pdf")
                .fileUrl("resumes/resume1.pdf")
                .fileType("application/pdf")
                .fileSize(102400L)
                .isPrimary(true)
                .uploadedAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        com.placementintelligence.entity.UserResume resume2 = userResumeRepository.save(
            com.placementintelligence.entity.UserResume.builder()
                .user(student2)
                .fileName("resume2.pdf")
                .fileUrl("resumes/resume2.pdf")
                .fileType("application/pdf")
                .fileSize(102400L)
                .isPrimary(true)
                .uploadedAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 5. Successful Application submission by Student 1
        var applyRequest = new com.placementintelligence.dto.request.CreateJobApplicationRequest(
            openJob.getId(),
            resume1.getId(),
            "I am excited to apply!"
        );

        var applicationResponse = jobApplicationService.applyForJob(student1.getUsername(), applyRequest);
        assertNotNull(applicationResponse);
        assertNotNull(applicationResponse.id());
        assertEquals("Software Engineer", applicationResponse.jobTitle());
        assertEquals(company.getId(), applicationResponse.companyId());
        assertEquals("Acme Corp", applicationResponse.companyName());
        assertEquals(com.placementintelligence.common.enums.ApplicationStatus.APPLIED, applicationResponse.status());

        // 6. Duplicate Application should be rejected (ResourceAlreadyExistsException)
        assertThrows(com.placementintelligence.exception.ResourceAlreadyExistsException.class, () ->
            jobApplicationService.applyForJob(student1.getUsername(), applyRequest)
        );

        // 7. Cannot apply to closed job (BadRequestException)
        assertThrows(com.placementintelligence.exception.BadRequestException.class, () ->
            jobApplicationService.applyForJob(
                student2.getUsername(),
                new com.placementintelligence.dto.request.CreateJobApplicationRequest(
                    closedJob.getId(),
                    resume2.getId(),
                    "Applying to closed job"
                )
            )
        );

        // 8. Cannot use another student's resume (ResourceNotFoundException)
        assertThrows(com.placementintelligence.exception.ResourceNotFoundException.class, () ->
            jobApplicationService.applyForJob(
                student2.getUsername(),
                new com.placementintelligence.dto.request.CreateJobApplicationRequest(
                    openJob.getId(),
                    resume1.getId(), // resume1 belongs to student1
                    "Using someone else's resume"
                )
            )
        );

        // 9. Recruiter cannot apply as a student (AccessDeniedException)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            jobApplicationService.applyForJob(
                recruiterUser.getUsername(),
                new com.placementintelligence.dto.request.CreateJobApplicationRequest(
                    openJob.getId(),
                    resume1.getId(),
                    "Recruiter trying to apply"
                )
            )
        );

        // 10. Student retrieves own applications list
        var student1Apps = jobApplicationService.getMyApplications(student1.getUsername());
        assertEquals(1, student1Apps.size());
        assertEquals(applicationResponse.id(), student1Apps.get(0).id());
        assertEquals("Acme Corp", student1Apps.get(0).companyName());

        // 11. Student 1 retrieves own application by ID
        var fetchedApp = jobApplicationService.getMyApplication(student1.getUsername(), applicationResponse.id());
        assertNotNull(fetchedApp);
        assertEquals(applicationResponse.id(), fetchedApp.id());

        // 12. Student 2 cannot access Student 1's application by ID (ResourceNotFoundException)
        assertThrows(com.placementintelligence.exception.ResourceNotFoundException.class, () ->
            jobApplicationService.getMyApplication(student2.getUsername(), applicationResponse.id())
        );

        // 13. Cannot apply to nonexistent job (ResourceNotFoundException)
        assertThrows(com.placementintelligence.exception.ResourceNotFoundException.class, () ->
            jobApplicationService.applyForJob(
                student2.getUsername(),
                new com.placementintelligence.dto.request.CreateJobApplicationRequest(
                    999999L,
                    resume2.getId(),
                    "Nonexistent job"
                )
            )
        );

        // 14. Student cannot change application status (AccessDeniedException)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            jobApplicationService.updateApplicationStatus(
                student1.getUsername(),
                applicationResponse.id(),
                new com.placementintelligence.dto.request.UpdateApplicationStatusRequest(
                    com.placementintelligence.common.enums.ApplicationStatus.SELECTED
                )
            )
        );

        // 15. Recruiter of openJob can view application
        var recruiterApp = jobApplicationService.getApplicationByIdForRecruiter(
            recruiterUser.getUsername(),
            applicationResponse.id()
        );
        assertNotNull(recruiterApp);
        assertEquals(applicationResponse.id(), recruiterApp.id());
    }

    @Autowired
    private com.placementintelligence.service.CompanyService companyService;

    @Autowired
    private com.placementintelligence.service.RecruiterProfileService recruiterProfileService;

    @Autowired
    private com.placementintelligence.service.JobService jobService;

    @Test
    void testRecruiterJobManagementWorkflow() {
        // 1. Create Recruiter 1 and Recruiter 2 and a Student
        com.placementintelligence.entity.User recruiter1 = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("recruiter_flow_1")
                .phoneNumber("9777700001")
                .role(com.placementintelligence.common.enums.UserRole.RECRUITER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        com.placementintelligence.entity.User recruiter2 = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("recruiter_flow_2")
                .phoneNumber("9777700002")
                .role(com.placementintelligence.common.enums.UserRole.RECRUITER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        com.placementintelligence.entity.User student = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("student_flow_1")
                .phoneNumber("9777700003")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 2. Recruiter creates a Company
        var companyResponse = companyService.createCompany(
            recruiter1.getUsername(),
            new com.placementintelligence.dto.request.CreateCompanyRequest(
                "Stark Industries",
                "https://stark.example.com",
                "Defense & Tech",
                "Advanced technology company",
                "New York"
            )
        );
        assertNotNull(companyResponse);
        assertNotNull(companyResponse.id());
        assertEquals("Stark Industries", companyResponse.name());

        // 3. Duplicate company creation rejected
        assertThrows(com.placementintelligence.exception.ResourceAlreadyExistsException.class, () ->
            companyService.createCompany(
                recruiter1.getUsername(),
                new com.placementintelligence.dto.request.CreateCompanyRequest(
                    "Stark Industries",
                    null, null, null, null
                )
            )
        );

        // 4. Student cannot create company
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            companyService.createCompany(
                student.getUsername(),
                new com.placementintelligence.dto.request.CreateCompanyRequest(
                    "Student Company",
                    null, null, null, null
                )
            )
        );

        // 5. Create recruiter profiles
        var profileResponse1 = recruiterProfileService.createProfile(
            recruiter1.getUsername(),
            new com.placementintelligence.dto.request.CreateRecruiterProfileRequest(
                companyResponse.id(),
                "Lead Recruiter",
                "Talent Acquisition",
                "EMP001"
            )
        );
        assertNotNull(profileResponse1);
        assertEquals(companyResponse.id(), profileResponse1.companyId());

        // Create second company for recruiter 2
        var company2 = companyRepository.save(
            com.placementintelligence.entity.Company.builder()
                .name("Wayne Enterprises")
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        recruiterProfileService.createProfile(
            recruiter2.getUsername(),
            new com.placementintelligence.dto.request.CreateRecruiterProfileRequest(
                company2.getId(),
                "HR Specialist",
                "People",
                "EMP002"
            )
        );

        // 6. Recruiter 1 creates a job for their company
        var jobResponse = jobService.createJob(
            recruiter1.getUsername(),
            new com.placementintelligence.dto.request.CreateJobRequest(
                companyResponse.id(),
                "Frontend Engineer",
                "Build modern web applications with React and Next.js",
                "Bangalore, India",
                com.placementintelligence.common.enums.EmploymentType.FULL_TIME,
                com.placementintelligence.common.enums.ExperienceLevel.MID_LEVEL,
                new java.math.BigDecimal("1200000"),
                new java.math.BigDecimal("1800000"),
                5,
                java.time.LocalDate.now().plusDays(30)
            )
        );
        assertNotNull(jobResponse);
        assertNotNull(jobResponse.id());
        assertEquals("Frontend Engineer", jobResponse.title());
        assertEquals(com.placementintelligence.common.enums.JobStatus.DRAFT, jobResponse.status());

        // 7. Recruiter 1 cannot create job for company 2 (unassociated company)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            jobService.createJob(
                recruiter1.getUsername(),
                new com.placementintelligence.dto.request.CreateJobRequest(
                    company2.getId(),
                    "Backend Engineer",
                    "Description",
                    "Location",
                    com.placementintelligence.common.enums.EmploymentType.FULL_TIME,
                    com.placementintelligence.common.enums.ExperienceLevel.SENIOR_LEVEL,
                    null, null, 2,
                    java.time.LocalDate.now().plusDays(15)
                )
            )
        );

        // 8. Student cannot create job
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            jobService.createJob(
                student.getUsername(),
                new com.placementintelligence.dto.request.CreateJobRequest(
                    companyResponse.id(),
                    "Invalid Job",
                    "Description",
                    "Location",
                    com.placementintelligence.common.enums.EmploymentType.FULL_TIME,
                    com.placementintelligence.common.enums.ExperienceLevel.MID_LEVEL,
                    null, null, 1,
                    java.time.LocalDate.now().plusDays(10)
                )
            )
        );

        // 9. Recruiter 1 updates the job (publishes to OPEN)
        var updatedJob = jobService.updateJob(
            recruiter1.getUsername(),
            jobResponse.id(),
            new com.placementintelligence.dto.request.UpdateJobRequest(
                companyResponse.id(),
                "Senior Frontend Engineer",
                "Updated description with lead responsibilities",
                "Remote",
                com.placementintelligence.common.enums.EmploymentType.FULL_TIME,
                com.placementintelligence.common.enums.ExperienceLevel.SENIOR_LEVEL,
                new java.math.BigDecimal("1500000"),
                new java.math.BigDecimal("2200000"),
                3,
                java.time.LocalDate.now().plusDays(45),
                com.placementintelligence.common.enums.JobStatus.OPEN
            )
        );
        assertNotNull(updatedJob);
        assertEquals("Senior Frontend Engineer", updatedJob.title());
        assertEquals(com.placementintelligence.common.enums.JobStatus.OPEN, updatedJob.status());
        assertEquals("Remote", updatedJob.location());

        // 10. Recruiter 2 cannot update Recruiter 1's job
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            jobService.updateJob(
                recruiter2.getUsername(),
                jobResponse.id(),
                new com.placementintelligence.dto.request.UpdateJobRequest(
                    company2.getId(),
                    "Hijacked Job Title",
                    "Description",
                    "Location",
                    com.placementintelligence.common.enums.EmploymentType.FULL_TIME,
                    com.placementintelligence.common.enums.ExperienceLevel.SENIOR_LEVEL,
                    null, null, 1,
                    java.time.LocalDate.now().plusDays(10),
                    com.placementintelligence.common.enums.JobStatus.OPEN
                )
            )
        );

        // 11. Recruiter 1 lists recruiter jobs
        var recruiterJobs = jobService.getRecruiterJobs(recruiter1.getUsername());
        assertEquals(1, recruiterJobs.size());
        assertEquals(jobResponse.id(), recruiterJobs.get(0).id());

        // 12. Recruiter 2 cannot delete Recruiter 1's job
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            jobService.deleteJob(recruiter2.getUsername(), jobResponse.id())
        );

        // 13. Recruiter 1 deletes the job
        jobService.deleteJob(recruiter1.getUsername(), jobResponse.id());
        var recruiterJobsAfterDelete = jobService.getRecruiterJobs(recruiter1.getUsername());
        assertEquals(0, recruiterJobsAfterDelete.size());
    }

    @Autowired
    private com.placementintelligence.service.AdminAnalyticsService adminAnalyticsService;

    @Autowired
    private com.placementintelligence.controller.AdminController adminController;

    @Test
    void testAdminAnalyticsAndAuthorizationWorkflow() {
        // 1. Setup users with different roles
        var adminUser = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("admin_test_1")
                .phoneNumber("9666600001")
                .role(com.placementintelligence.common.enums.UserRole.ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var superAdminUser = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("super_admin_test_1")
                .phoneNumber("9666600002")
                .role(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var studentUser = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("student_analytics_test")
                .phoneNumber("9666600003")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var recruiterUser = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("recruiter_analytics_test")
                .phoneNumber("9666600004")
                .role(com.placementintelligence.common.enums.UserRole.RECRUITER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var inactiveAdmin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("inactive_admin_test")
                .phoneNumber("9666600005")
                .role(com.placementintelligence.common.enums.UserRole.ADMIN)
                .isActive(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 2. Setup Companies
        var activeCompany = companyRepository.save(
            com.placementintelligence.entity.Company.builder()
                .name("Analytics Active Co")
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var inactiveCompany = companyRepository.save(
            com.placementintelligence.entity.Company.builder()
                .name("Analytics Inactive Co")
                .isActive(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var recruiterProfile = recruiterProfileRepository.save(
            com.placementintelligence.entity.RecruiterProfile.builder()
                .user(recruiterUser)
                .company(activeCompany)
                .designation("Lead")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 3. Setup Jobs (OPEN, DRAFT, CLOSED)
        var openJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(activeCompany)
                .recruiter(recruiterProfile)
                .title("Job Open")
                .description("Desc")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.ENTRY_LEVEL)
                .openings(2)
                .applicationDeadline(java.time.LocalDate.now().plusDays(20))
                .status(com.placementintelligence.common.enums.JobStatus.OPEN)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var draftJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(activeCompany)
                .recruiter(recruiterProfile)
                .title("Job Draft")
                .description("Desc")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.MID_LEVEL)
                .openings(1)
                .applicationDeadline(java.time.LocalDate.now().plusDays(10))
                .status(com.placementintelligence.common.enums.JobStatus.DRAFT)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var closedJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(activeCompany)
                .recruiter(recruiterProfile)
                .title("Job Closed")
                .description("Desc")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.SENIOR_LEVEL)
                .openings(1)
                .applicationDeadline(java.time.LocalDate.now().minusDays(5))
                .status(com.placementintelligence.common.enums.JobStatus.CLOSED)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 4. Setup Applications
        var resume = userResumeRepository.save(
            com.placementintelligence.entity.UserResume.builder()
                .user(studentUser)
                .fileName("analytics_resume.pdf")
                .fileUrl("/uploads/resumes/test_analytics.pdf")
                .fileType("application/pdf")
                .fileSize(1024L)
                .isPrimary(true)
                .uploadedAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        jobApplicationRepository.save(
            com.placementintelligence.entity.JobApplication.builder()
                .job(openJob)
                .applicant(studentUser)
                .resume(resume)
                .resumeFileName("analytics_resume.pdf")
                .resumeFileUrl("/uploads/resumes/test_analytics.pdf")
                .resumeFileType("application/pdf")
                .resumeFileSize(1024L)
                .status(com.placementintelligence.common.enums.ApplicationStatus.SELECTED)
                .appliedAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 5. Verification: USER role is rejected (AccessDeniedException / HTTP 403)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminAnalyticsService.getOverview(studentUser.getUsername())
        );

        // 6. Verification: RECRUITER role is rejected (AccessDeniedException / HTTP 403)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminAnalyticsService.getOverview(recruiterUser.getUsername())
        );

        // 7. Verification: Inactive ADMIN is rejected (AccessDeniedException / HTTP 403)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminAnalyticsService.getOverview(inactiveAdmin.getUsername())
        );

        // 8. Verification: ADMIN successfully retrieves analytics
        var adminOverview = adminAnalyticsService.getOverview(adminUser.getUsername());
        assertNotNull(adminOverview);
        assertTrue(adminOverview.totalStudents() >= 1);
        assertTrue(adminOverview.totalRecruiters() >= 1);
        assertTrue(adminOverview.totalAdmins() >= 1);
        assertTrue(adminOverview.totalSuperAdmins() >= 1);
        assertTrue(adminOverview.totalActiveCompanies() >= 1);
        assertTrue(adminOverview.totalOpenJobs() >= 1);
        assertTrue(adminOverview.totalDraftJobs() >= 1);
        assertTrue(adminOverview.totalClosedJobs() >= 1);
        assertTrue(adminOverview.totalJobs() >= 3);
        assertTrue(adminOverview.offeredApplications() >= 1);
        assertTrue(adminOverview.totalApplications() >= 1);

        // 9. Verification: SUPER_ADMIN successfully retrieves analytics
        var superAdminOverview = adminAnalyticsService.getOverview(superAdminUser.getUsername());
        assertNotNull(superAdminOverview);
        assertEquals(adminOverview.totalJobs(), superAdminOverview.totalJobs());
        assertEquals(adminOverview.totalActiveCompanies(), superAdminOverview.totalActiveCompanies());

        // 10. Verification: AdminController endpoint execution
        org.springframework.security.core.Authentication adminAuth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                adminUser.getUsername(),
                null,
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN"))
            );

        org.springframework.mock.web.MockHttpServletRequest mockRequest =
            new org.springframework.mock.web.MockHttpServletRequest();
        mockRequest.setRequestURI("/v1/admin/analytics/overview");

        var controllerResponse = adminController.getAnalyticsOverview(adminAuth, mockRequest);
        assertNotNull(controllerResponse);
        assertTrue(controllerResponse.success());
        assertEquals("Admin analytics overview fetched successfully", controllerResponse.message());
        assertNotNull(controllerResponse.data());
        assertEquals(adminOverview.totalStudents(), controllerResponse.data().totalStudents());
    }
}
