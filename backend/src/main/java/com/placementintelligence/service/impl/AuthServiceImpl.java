package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.common.utils.OtpGenerator;
import com.placementintelligence.dto.request.RefreshTokenRequest;
import com.placementintelligence.dto.request.SendOtpRequest;
import com.placementintelligence.dto.request.VerifyOtpRequest;
import com.placementintelligence.dto.response.LoginResponse;
import com.placementintelligence.dto.response.SendOtpResponse;
import com.placementintelligence.entity.OtpVerification;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserProfile;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.UnauthorizedException;
import com.placementintelligence.repository.OtpVerificationRepository;
import com.placementintelligence.repository.UserProfileRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.security.JwtService;
import com.placementintelligence.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final int MAX_OTP_ATTEMPTS = 3;
    private static final long DEFAULT_OTP_EXPIRY_SECONDS = 300L; // 5 minutes

    private final OtpGenerator otpGenerator;
    private final PasswordEncoder passwordEncoder;
    private final OtpVerificationRepository otpRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final JwtService jwtService;

    @Value("${app.otp.expiration-seconds:300}")
    private long otpExpirationSeconds = DEFAULT_OTP_EXPIRY_SECONDS;

    @Override
    public SendOtpResponse sendOtp(SendOtpRequest request) {

        String generatedOtp = otpGenerator.generateOtp();

        log.info("Generating and storing OTP for requested phone number");

        OtpVerification otpVerification = OtpVerification.builder()
            .phoneNumber(request.phoneNumber())
            .otp(passwordEncoder.encode(generatedOtp))
            .attemptCount(0)
            .verified(false)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(otpExpirationSeconds))
            .build();

        otpRepository.save(otpVerification);

        return new SendOtpResponse(
            request.phoneNumber(),
            "OTP sent successfully"
        );
    }

    @Override
    @Transactional(noRollbackFor = BadRequestException.class)
    public LoginResponse verifyOtp(VerifyOtpRequest request) {

        OtpVerification otpVerification = otpRepository
            .findTopByPhoneNumberOrderByCreatedAtDesc(
                request.phoneNumber()
            )
            .orElseThrow(() ->
                new BadRequestException("OTP not found"));

        if (Boolean.TRUE.equals(otpVerification.getVerified())) {
            throw new BadRequestException("OTP has already been verified");
        }

        if (otpVerification.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("OTP has expired");
        }

        if (otpVerification.getAttemptCount() != null && otpVerification.getAttemptCount() >= MAX_OTP_ATTEMPTS) {
            throw new BadRequestException("Maximum OTP verification attempts exceeded");
        }

        if (!passwordEncoder.matches(
            request.otp(),
            otpVerification.getOtp()
        )) {
            int newAttemptCount = (otpVerification.getAttemptCount() == null ? 0 : otpVerification.getAttemptCount()) + 1;
            otpVerification.setAttemptCount(newAttemptCount);
            otpVerification.setUpdatedAt(Instant.now());
            otpRepository.save(otpVerification);

            if (newAttemptCount >= MAX_OTP_ATTEMPTS) {
                throw new BadRequestException("Maximum OTP verification attempts exceeded");
            }

            throw new BadRequestException("Invalid OTP");
        }

        otpVerification.setVerified(true);
        otpVerification.setUpdatedAt(Instant.now());

        otpRepository.save(otpVerification);

        User user = userRepository
            .findByPhoneNumber(request.phoneNumber())
            .orElseGet(() -> {

                User newUser = User.builder()
                    .phoneNumber(request.phoneNumber())
                    .username(generateUsername(request.phoneNumber()))
                    .role(UserRole.USER)
                    .isActive(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

                return userRepository.save(newUser);
            });

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException("User account is inactive");
        }

        ensureUserProfile(user);

        String accessToken =
            jwtService.generateAccessToken(user.getUsername());

        String refreshToken =
            jwtService.generateRefreshToken(user.getUsername());

        return new LoginResponse(
            accessToken,
            refreshToken,
            user.getUsername(),
            user.getPhoneNumber(),
            "OTP verified successfully"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse refreshToken(RefreshTokenRequest request) {

        String token = request.refreshToken();

        if (token == null || token.isBlank()) {
            throw new BadRequestException("Refresh token is required");
        }

        if (!jwtService.isRefreshToken(token)) {
            throw new UnauthorizedException("Invalid token type: expected refresh token");
        }

        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        if (username == null) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException("User account is inactive");
        }

        if (!jwtService.isRefreshTokenValid(token, user.getUsername())) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String newAccessToken = jwtService.generateAccessToken(user.getUsername());
        String newRefreshToken = jwtService.generateRefreshToken(user.getUsername());

        return new LoginResponse(
            newAccessToken,
            newRefreshToken,
            user.getUsername(),
            user.getPhoneNumber(),
            "Token refreshed successfully"
        );
    }

    private void ensureUserProfile(User user) {

        profileRepository
            .findByUsername(user.getUsername())
            .orElseGet(() -> {

                UserProfile profile = UserProfile.builder()
                    .user(user)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

                return profileRepository.save(profile);
            });
    }

    private String generateUsername(String phoneNumber) {

        String username =
            "user" +
            phoneNumber.substring(phoneNumber.length() - 4);

        int counter = 1;

        while (userRepository.existsByUsername(username)) {

            username =
                "user" +
                phoneNumber.substring(phoneNumber.length() - 4) +
                counter;

            counter++;
        }

        return username;
    }
}
