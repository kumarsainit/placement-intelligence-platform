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
}
