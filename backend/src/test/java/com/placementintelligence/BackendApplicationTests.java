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

    @Autowired
    private com.placementintelligence.service.AdminUserService adminUserService;

    @Autowired
    private com.placementintelligence.controller.AdminUserController adminUserController;

    @Test
    void testAdminUserManagementWorkflow() {
        // 1. Setup users
        var superAdmin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("mgmt_superadmin")
                .phoneNumber("9988112201")
                .role(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var admin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("mgmt_admin")
                .phoneNumber("9988112202")
                .role(com.placementintelligence.common.enums.UserRole.ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var student = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("mgmt_student")
                .phoneNumber("9988112203")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var recruiter = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("mgmt_recruiter")
                .phoneNumber("9988112204")
                .role(com.placementintelligence.common.enums.UserRole.RECRUITER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var inactiveAdmin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("mgmt_inactive_admin")
                .phoneNumber("9988112205")
                .role(com.placementintelligence.common.enums.UserRole.ADMIN)
                .isActive(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 2. Authorization checks: USER, RECRUITER, inactive ADMIN rejected (403)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.getAllUsers(student.getUsername())
        );

        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.getAllUsers(recruiter.getUsername())
        );

        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.getAllUsers(inactiveAdmin.getUsername())
        );

        // 3. ADMIN and SUPER_ADMIN can retrieve users list
        var adminUserList = adminUserService.getAllUsers(admin.getUsername());
        assertNotNull(adminUserList);
        assertTrue(adminUserList.size() >= 4);

        var superAdminUserList = adminUserService.getAllUsers(superAdmin.getUsername());
        assertNotNull(superAdminUserList);
        assertEquals(adminUserList.size(), superAdminUserList.size());

        // 4. ADMIN can update student status (deactivate / activate)
        var deactivatedStudent = adminUserService.updateUserStatus(
            admin.getUsername(),
            student.getId(),
            new com.placementintelligence.dto.request.UpdateUserStatusRequest(false)
        );
        assertFalse(deactivatedStudent.isActive());

        var reactivatedStudent = adminUserService.updateUserStatus(
            admin.getUsername(),
            student.getId(),
            new com.placementintelligence.dto.request.UpdateUserStatusRequest(true)
        );
        assertTrue(reactivatedStudent.isActive());

        // 5. ADMIN can update student role to RECRUITER
        var updatedRoleStudent = adminUserService.updateUserRole(
            admin.getUsername(),
            student.getId(),
            new com.placementintelligence.dto.request.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.RECRUITER)
        );
        assertEquals(com.placementintelligence.common.enums.UserRole.RECRUITER, updatedRoleStudent.role());

        // 6. ADMIN cannot promote user to SUPER_ADMIN or ADMIN
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.updateUserRole(
                admin.getUsername(),
                student.getId(),
                new com.placementintelligence.dto.request.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN)
            )
        );

        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.updateUserRole(
                admin.getUsername(),
                student.getId(),
                new com.placementintelligence.dto.request.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.ADMIN)
            )
        );

        // 7. ADMIN cannot modify own role or deactivate own account
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.updateUserRole(
                admin.getUsername(),
                admin.getId(),
                new com.placementintelligence.dto.request.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN)
            )
        );

        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.updateUserStatus(
                admin.getUsername(),
                admin.getId(),
                new com.placementintelligence.dto.request.UpdateUserStatusRequest(false)
            )
        );

        // 8. ADMIN cannot modify another ADMIN or SUPER_ADMIN
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.updateUserStatus(
                admin.getUsername(),
                superAdmin.getId(),
                new com.placementintelligence.dto.request.UpdateUserStatusRequest(false)
            )
        );

        // 9. SUPER_ADMIN protection (cannot demote/deactivate final active SUPER_ADMIN)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminUserService.updateUserRole(
                superAdmin.getUsername(),
                superAdmin.getId(),
                new com.placementintelligence.dto.request.UpdateUserRoleRequest(com.placementintelligence.common.enums.UserRole.USER)
            )
        );

        // 10. Invalid target user returns 404 (ResourceNotFoundException)
        assertThrows(com.placementintelligence.exception.ResourceNotFoundException.class, () ->
            adminUserService.getUserById(admin.getUsername(), 999999L)
        );

        // 11. Controller endpoint verification
        org.springframework.security.core.Authentication adminAuth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                admin.getUsername(),
                null,
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN"))
            );

        org.springframework.mock.web.MockHttpServletRequest mockRequest =
            new org.springframework.mock.web.MockHttpServletRequest();
        mockRequest.setRequestURI("/v1/admin/users");

        var controllerResponse = adminUserController.getAllUsers(adminAuth, mockRequest);
        assertNotNull(controllerResponse);
        assertTrue(controllerResponse.success());
        assertEquals("Users fetched successfully", controllerResponse.message());
        assertNotNull(controllerResponse.data());
    }

    @Autowired
    private com.placementintelligence.service.AdminPlacementGovernanceService adminPlacementGovernanceService;

    @Autowired
    private com.placementintelligence.controller.AdminCompanyController adminCompanyController;

    @Autowired
    private com.placementintelligence.controller.AdminJobController adminJobController;

    @Test
    void testAdminPlacementGovernanceWorkflow() {
        // 1. Setup users
        var superAdmin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("gov_superadmin")
                .phoneNumber("9988113301")
                .role(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var admin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("gov_admin")
                .phoneNumber("9988113302")
                .role(com.placementintelligence.common.enums.UserRole.ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var student = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("gov_student")
                .phoneNumber("9988113303")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var recruiterUser = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("gov_recruiter")
                .phoneNumber("9988113304")
                .role(com.placementintelligence.common.enums.UserRole.RECRUITER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var inactiveAdmin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("gov_inactive_admin")
                .phoneNumber("9988113305")
                .role(com.placementintelligence.common.enums.UserRole.ADMIN)
                .isActive(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 2. Setup Company & Recruiter Profile & Job
        var company = companyRepository.save(
            com.placementintelligence.entity.Company.builder()
                .name("Gov Corp Inc")
                .industry("Enterprise Software")
                .location("Hyderabad")
                .website("https://govcorp.example.com")
                .isActive(true)
                .build()
        );

        var recruiterProfile = recruiterProfileRepository.save(
            com.placementintelligence.entity.RecruiterProfile.builder()
                .user(recruiterUser)
                .company(company)
                .designation("Principal Recruiter")
                .department("HR")
                .build()
        );

        var job = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(company)
                .recruiter(recruiterProfile)
                .title("Staff AI Engineer")
                .description("Build agentic placement workflows")
                .location("Hyderabad")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.SENIOR_LEVEL)
                .openings(3)
                .applicationDeadline(java.time.LocalDate.now().plusDays(30))
                .status(com.placementintelligence.common.enums.JobStatus.OPEN)
                .build()
        );

        // 3. Authorization checks: USER, RECRUITER, inactive ADMIN rejected (403)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminPlacementGovernanceService.getAllCompanies(student.getUsername())
        );
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminPlacementGovernanceService.getAllJobs(student.getUsername())
        );

        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminPlacementGovernanceService.getAllCompanies(recruiterUser.getUsername())
        );
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminPlacementGovernanceService.getAllJobs(recruiterUser.getUsername())
        );

        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminPlacementGovernanceService.getAllCompanies(inactiveAdmin.getUsername())
        );
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            adminPlacementGovernanceService.getAllJobs(inactiveAdmin.getUsername())
        );

        // 4. ADMIN & SUPER_ADMIN can retrieve all companies and jobs
        var adminCompanies = adminPlacementGovernanceService.getAllCompanies(admin.getUsername());
        assertNotNull(adminCompanies);
        assertTrue(adminCompanies.stream().anyMatch(c -> c.id().equals(company.getId())));

        var superAdminJobs = adminPlacementGovernanceService.getAllJobs(superAdmin.getUsername());
        assertNotNull(superAdminJobs);
        assertTrue(superAdminJobs.stream().anyMatch(j -> j.id().equals(job.getId())));

        // 5. ADMIN can update company status
        var deactivatedCompany = adminPlacementGovernanceService.updateCompanyStatus(
            admin.getUsername(),
            company.getId(),
            new com.placementintelligence.dto.request.UpdateCompanyStatusRequest(false)
        );
        assertFalse(deactivatedCompany.isActive());

        var reactivatedCompany = adminPlacementGovernanceService.updateCompanyStatus(
            admin.getUsername(),
            company.getId(),
            new com.placementintelligence.dto.request.UpdateCompanyStatusRequest(true)
        );
        assertTrue(reactivatedCompany.isActive());

        // 6. ADMIN can update job status
        var closedJob = adminPlacementGovernanceService.updateJobStatus(
            admin.getUsername(),
            job.getId(),
            new com.placementintelligence.dto.request.UpdateJobStatusRequest(com.placementintelligence.common.enums.JobStatus.CLOSED)
        );
        assertEquals(com.placementintelligence.common.enums.JobStatus.CLOSED, closedJob.status());

        var reopenedJob = adminPlacementGovernanceService.updateJobStatus(
            admin.getUsername(),
            job.getId(),
            new com.placementintelligence.dto.request.UpdateJobStatusRequest(com.placementintelligence.common.enums.JobStatus.OPEN)
        );
        assertEquals(com.placementintelligence.common.enums.JobStatus.OPEN, reopenedJob.status());

        // 7. Non-existent company or job returns 404 (ResourceNotFoundException)
        assertThrows(com.placementintelligence.exception.ResourceNotFoundException.class, () ->
            adminPlacementGovernanceService.getCompanyById(admin.getUsername(), 999999L)
        );
        assertThrows(com.placementintelligence.exception.ResourceNotFoundException.class, () ->
            adminPlacementGovernanceService.getJobById(admin.getUsername(), 999999L)
        );

        // 8. Controller endpoint verification
        org.springframework.security.core.Authentication adminAuth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                admin.getUsername(),
                null,
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN"))
            );

        org.springframework.mock.web.MockHttpServletRequest mockCompanyRequest =
            new org.springframework.mock.web.MockHttpServletRequest();
        mockCompanyRequest.setRequestURI("/v1/admin/companies");

        var companyControllerResponse = adminCompanyController.getAllCompanies(adminAuth, mockCompanyRequest);
        assertNotNull(companyControllerResponse);
        assertTrue(companyControllerResponse.success());
        assertEquals("Admin companies fetched successfully", companyControllerResponse.message());

        org.springframework.mock.web.MockHttpServletRequest mockJobRequest =
            new org.springframework.mock.web.MockHttpServletRequest();
        mockJobRequest.setRequestURI("/v1/admin/jobs");

        var jobControllerResponse = adminJobController.getAllJobs(adminAuth, mockJobRequest);
        assertNotNull(jobControllerResponse);
        assertTrue(jobControllerResponse.success());
        assertEquals("Admin jobs fetched successfully", jobControllerResponse.message());
    }

    @Autowired
    private com.placementintelligence.service.PlacementIntelligenceService placementIntelligenceService;

    @Autowired
    private com.placementintelligence.controller.PlacementIntelligenceController placementIntelligenceController;

    @Autowired
    private com.placementintelligence.repository.UserProfileRepository userProfileRepository;

    @Autowired
    private com.placementintelligence.repository.UserEducationRepository userEducationRepository;

    @Autowired
    private com.placementintelligence.repository.UserSkillRepository userSkillRepository;

    @Autowired
    private com.placementintelligence.repository.SkillRepository skillRepository;

    @Autowired
    private com.placementintelligence.repository.UserProjectRepository userProjectRepository;

    @Test
    void testPlacementIntelligenceWorkflow() {
        // 1. Setup users (Student, Recruiter, Admin, Super Admin, Inactive Student)
        var student = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("pi_student")
                .phoneNumber("9977001101")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var recruiterUser = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("pi_recruiter")
                .phoneNumber("9977001102")
                .role(com.placementintelligence.common.enums.UserRole.RECRUITER)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var admin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("pi_admin")
                .phoneNumber("9977001103")
                .role(com.placementintelligence.common.enums.UserRole.ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var superAdmin = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("pi_superadmin")
                .phoneNumber("9977001104")
                .role(com.placementintelligence.common.enums.UserRole.SUPER_ADMIN)
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        var inactiveStudent = userRepository.save(
            com.placementintelligence.entity.User.builder()
                .username("pi_inactive_student")
                .phoneNumber("9977001105")
                .role(com.placementintelligence.common.enums.UserRole.USER)
                .isActive(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 2. Setup Skills Catalog
        var javaSkill = skillRepository.findByNameIgnoreCase("Java")
            .orElseGet(() -> skillRepository.save(
                com.placementintelligence.entity.Skill.builder()
                    .name("Java")
                    .category("Programming")
                    .isActive(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build()
            ));

        var springBootSkill = skillRepository.findByNameIgnoreCase("Spring Boot")
            .orElseGet(() -> skillRepository.save(
                com.placementintelligence.entity.Skill.builder()
                    .name("Spring Boot")
                    .category("Framework")
                    .isActive(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build()
            ));

        var reactSkill = skillRepository.findByNameIgnoreCase("React")
            .orElseGet(() -> skillRepository.save(
                com.placementintelligence.entity.Skill.builder()
                    .name("React")
                    .category("Frontend")
                    .isActive(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build()
            ));

        var kubernetesSkill = skillRepository.findByNameIgnoreCase("Kubernetes")
            .orElseGet(() -> skillRepository.save(
                com.placementintelligence.entity.Skill.builder()
                    .name("Kubernetes")
                    .category("DevOps")
                    .isActive(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build()
            ));

        // 3. Setup Student Profile, Education, Skills, Projects, Resume
        userProfileRepository.save(
            com.placementintelligence.entity.UserProfile.builder()
                .user(student)
                .fullName("Placement Intelligence Student")
                .college("National Institute of Technology")
                .degree("B.Tech")
                .branch("Computer Science")
                .graduationYear(2026)
                .cgpa(new java.math.BigDecimal("8.80"))
                .bio("Full stack software developer with cloud experience")
                .githubUrl("https://github.com/pistudent")
                .linkedinUrl("https://linkedin.com/in/pistudent")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        userEducationRepository.save(
            com.placementintelligence.entity.UserEducation.builder()
                .user(student)
                .educationLevel(com.placementintelligence.entity.EducationLevel.BACHELOR)
                .institution("NIT")
                .degree("B.Tech")
                .fieldOfStudy("Computer Science")
                .cgpa(new java.math.BigDecimal("8.80"))
                .startYear(2022)
                .endYear(2026)
                .currentlyPursuing(true)
                .build()
        );

        userSkillRepository.save(
            com.placementintelligence.entity.UserSkill.builder()
                .user(student)
                .skill(javaSkill)
                .proficiency("ADVANCED")
                .yearsOfExperience(new java.math.BigDecimal("2.00"))
                .build()
        );

        userSkillRepository.save(
            com.placementintelligence.entity.UserSkill.builder()
                .user(student)
                .skill(springBootSkill)
                .proficiency("INTERMEDIATE")
                .yearsOfExperience(new java.math.BigDecimal("1.50"))
                .build()
        );

        userSkillRepository.save(
            com.placementintelligence.entity.UserSkill.builder()
                .user(student)
                .skill(reactSkill)
                .proficiency("INTERMEDIATE")
                .yearsOfExperience(new java.math.BigDecimal("1.00"))
                .build()
        );

        userProjectRepository.save(
            com.placementintelligence.entity.UserProject.builder()
                .user(student)
                .title("Smart Placement Engine")
                .description("Automated matching algorithms for students and companies")
                .technologies("Spring Boot, React, PostgreSQL, Docker")
                .currentlyWorking(false)
                .build()
        );

        var primaryResume = userResumeRepository.save(
            com.placementintelligence.entity.UserResume.builder()
                .user(student)
                .fileName("pi_resume.pdf")
                .fileUrl("storage/resumes/pi_resume.pdf")
                .fileType("application/pdf")
                .fileSize(204800L)
                .isPrimary(true)
                .uploadedAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );

        // 4. Setup Companies
        var activeCompany = companyRepository.save(
            com.placementintelligence.entity.Company.builder()
                .name("Alpha Intelligence Corp")
                .industry("Artificial Intelligence")
                .location("Bengaluru")
                .website("https://alpha-ai.example.com")
                .isActive(true)
                .build()
        );

        var inactiveCompany = companyRepository.save(
            com.placementintelligence.entity.Company.builder()
                .name("Legacy Inactive Corp")
                .industry("Legacy Systems")
                .location("Pune")
                .website("https://legacy.example.com")
                .isActive(false)
                .build()
        );

        var recruiterProfile = recruiterProfileRepository.save(
            com.placementintelligence.entity.RecruiterProfile.builder()
                .user(recruiterUser)
                .company(activeCompany)
                .designation("Staff Talent Partner")
                .department("Engineering")
                .build()
        );

        // 5. Setup Jobs (Eligible & Ineligible variants)
        var highMatchJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(activeCompany)
                .recruiter(recruiterProfile)
                .title("Java & Spring Boot Engineer")
                .description("Seeking B.Tech Computer Science candidates skilled in Java, Spring Boot, React, and Kubernetes.")
                .location("Bengaluru")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.ENTRY_LEVEL)
                .openings(5)
                .applicationDeadline(java.time.LocalDate.now().plusDays(30))
                .status(com.placementintelligence.common.enums.JobStatus.OPEN)
                .build()
        );

        var moderateMatchJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(activeCompany)
                .recruiter(recruiterProfile)
                .title("Backend System Developer")
                .description("Looking for engineers with Docker and cloud background.")
                .location("Hyderabad")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.ENTRY_LEVEL)
                .openings(2)
                .applicationDeadline(java.time.LocalDate.now().plusDays(15))
                .status(com.placementintelligence.common.enums.JobStatus.OPEN)
                .build()
        );

        var closedJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(activeCompany)
                .recruiter(recruiterProfile)
                .title("Java Architect")
                .description("Java and Spring Boot architect")
                .location("Bengaluru")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.SENIOR_LEVEL)
                .openings(1)
                .applicationDeadline(java.time.LocalDate.now().plusDays(10))
                .status(com.placementintelligence.common.enums.JobStatus.CLOSED)
                .build()
        );

        var expiredJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(activeCompany)
                .recruiter(recruiterProfile)
                .title("Spring Developer Expired")
                .description("Java developer")
                .location("Bengaluru")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.ENTRY_LEVEL)
                .openings(3)
                .applicationDeadline(java.time.LocalDate.now().minusDays(2))
                .status(com.placementintelligence.common.enums.JobStatus.OPEN)
                .build()
        );

        var zeroOpeningsJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(activeCompany)
                .recruiter(recruiterProfile)
                .title("Zero Openings Job")
                .description("Java engineer")
                .location("Bengaluru")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.ENTRY_LEVEL)
                .openings(0)
                .applicationDeadline(java.time.LocalDate.now().plusDays(10))
                .status(com.placementintelligence.common.enums.JobStatus.OPEN)
                .build()
        );

        var inactiveCompanyJob = jobRepository.save(
            com.placementintelligence.entity.Job.builder()
                .company(inactiveCompany)
                .recruiter(recruiterProfile)
                .title("Inactive Company Java Engineer")
                .description("Java and React developer")
                .location("Pune")
                .employmentType(com.placementintelligence.common.enums.EmploymentType.FULL_TIME)
                .experienceLevel(com.placementintelligence.common.enums.ExperienceLevel.ENTRY_LEVEL)
                .openings(2)
                .applicationDeadline(java.time.LocalDate.now().plusDays(10))
                .status(com.placementintelligence.common.enums.JobStatus.OPEN)
                .build()
        );

        // 6. Setup an existing application for student on highMatchJob
        jobApplicationRepository.save(
            com.placementintelligence.entity.JobApplication.builder()
                .job(highMatchJob)
                .applicant(student)
                .resume(primaryResume)
                .resumeFileName("pi_resume.pdf")
                .resumeFileUrl("storage/resumes/pi_resume.pdf")
                .resumeFileType("application/pdf")
                .resumeFileSize(204800L)
                .coverLetter("Excited to apply for Java engineer position")
                .status(com.placementintelligence.common.enums.ApplicationStatus.SHORTLISTED)
                .build()
        );

        // 7. Authorization checks (Only USER permitted, RECRUITER, ADMIN, SUPER_ADMIN, Inactive USER rejected with 403)
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            placementIntelligenceService.getJobRecommendations(recruiterUser.getUsername())
        );
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            placementIntelligenceService.getJobRecommendations(admin.getUsername())
        );
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            placementIntelligenceService.getJobRecommendations(superAdmin.getUsername())
        );
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
            placementIntelligenceService.getJobRecommendations(inactiveStudent.getUsername())
        );

        // 8. Retrieve student recommendations
        var recommendations = placementIntelligenceService.getJobRecommendations(student.getUsername());
        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());

        // 9. Verify ranking & scores
        assertTrue(recommendations.size() >= 2);
        var firstRec = recommendations.get(0);
        assertEquals(highMatchJob.getId(), firstRec.job().id());
        assertTrue(firstRec.matchScore() >= 80, "Expected high match score >= 80, got: " + firstRec.matchScore());
        assertEquals("EXCELLENT_MATCH", firstRec.matchGrade());

        // 10. Verify score bounds [0, 100]
        for (var rec : recommendations) {
            assertTrue(rec.matchScore() >= 0 && rec.matchScore() <= 100);
            assertNotNull(rec.matchGrade());
            assertNotNull(rec.isEligible());
            assertTrue(rec.isEligible());
        }

        // 11. Verify matched and missing skills
        assertTrue(firstRec.matchedSkills().contains("Java"));
        assertTrue(firstRec.matchedSkills().contains("Spring Boot"));
        assertTrue(firstRec.matchedSkills().contains("React"));
        assertTrue(firstRec.missingSkills().contains("Kubernetes"));

        // 12. Verify application context
        assertTrue(firstRec.hasApplied());
        assertEquals(com.placementintelligence.common.enums.ApplicationStatus.SHORTLISTED, firstRec.applicationStatus());

        var secondRec = recommendations.stream()
            .filter(r -> r.job().id().equals(moderateMatchJob.getId()))
            .findFirst()
            .orElseThrow();
        assertFalse(secondRec.hasApplied());
        assertNull(secondRec.applicationStatus());

        // 13. Verify exclusion of ineligible jobs (closed, expired, zero openings, inactive company)
        assertTrue(recommendations.stream().noneMatch(r -> r.job().id().equals(closedJob.getId())));
        assertTrue(recommendations.stream().noneMatch(r -> r.job().id().equals(expiredJob.getId())));
        assertTrue(recommendations.stream().noneMatch(r -> r.job().id().equals(zeroOpeningsJob.getId())));
        assertTrue(recommendations.stream().noneMatch(r -> r.job().id().equals(inactiveCompanyJob.getId())));

        // 14. Determinism check
        var recommendationsSecondRun = placementIntelligenceService.getJobRecommendations(student.getUsername());
        assertEquals(recommendations.size(), recommendationsSecondRun.size());
        assertEquals(recommendations.get(0).matchScore(), recommendationsSecondRun.get(0).matchScore());
        assertEquals(recommendations.get(0).job().id(), recommendationsSecondRun.get(0).job().id());

        // 15. getJobMatchDetails verification
        var matchDetails = placementIntelligenceService.getJobMatchDetails(student.getUsername(), highMatchJob.getId());
        assertNotNull(matchDetails);
        assertEquals(firstRec.matchScore(), matchDetails.matchScore());
        assertEquals(firstRec.matchedSkills(), matchDetails.matchedSkills());

        assertThrows(BadRequestException.class, () ->
            placementIntelligenceService.getJobMatchDetails(student.getUsername(), closedJob.getId())
        );
        assertThrows(com.placementintelligence.exception.ResourceNotFoundException.class, () ->
            placementIntelligenceService.getJobMatchDetails(student.getUsername(), 999999L)
        );

        // 16. getStudentInsights verification
        var insights = placementIntelligenceService.getStudentInsights(student.getUsername());
        assertNotNull(insights);
        assertEquals(100, insights.profileCompleteness());
        assertTrue(insights.totalSkills() >= 3);
        assertTrue(insights.totalProjects() >= 1);
        assertTrue(insights.hasPrimaryResume());
        assertTrue(insights.eligibleJobsCount() >= 2);
        assertTrue(insights.matchedJobsCount() >= 1);
        assertNotNull(insights.topInDemandSkills());
        assertTrue(insights.topInDemandSkills().contains("Java") || insights.topInDemandSkills().contains("Spring Boot"));

        // 17. Controller endpoints verification
        org.springframework.security.core.Authentication studentAuth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                student.getUsername(),
                null,
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER"))
            );

        org.springframework.mock.web.MockHttpServletRequest mockRequest =
            new org.springframework.mock.web.MockHttpServletRequest();
        mockRequest.setRequestURI("/v1/recommendations/jobs");

        var recControllerResp = placementIntelligenceController.getJobRecommendations(studentAuth, mockRequest);
        assertNotNull(recControllerResp);
        assertTrue(recControllerResp.success());
        assertEquals("Job recommendations fetched successfully", recControllerResp.message());
        assertNotNull(recControllerResp.data());

        var matchDetailControllerResp = placementIntelligenceController.getJobMatchDetails(studentAuth, highMatchJob.getId(), mockRequest);
        assertNotNull(matchDetailControllerResp);
        assertTrue(matchDetailControllerResp.success());
        assertEquals("Job match details fetched successfully", matchDetailControllerResp.message());

        var insightsControllerResp = placementIntelligenceController.getStudentInsights(studentAuth, mockRequest);
        assertNotNull(insightsControllerResp);
        assertTrue(insightsControllerResp.success());
        assertEquals("Placement insights fetched successfully", insightsControllerResp.message());
    }
}
