package com.placementintelligence.service.impl;

import com.placementintelligence.entity.User;
import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.common.utils.OtpGenerator;
import com.placementintelligence.dto.request.SendOtpRequest;
import com.placementintelligence.dto.request.VerifyOtpRequest;
import com.placementintelligence.dto.response.LoginResponse;
import com.placementintelligence.dto.response.SendOtpResponse;
import com.placementintelligence.entity.OtpVerification;
import com.placementintelligence.repository.OtpVerificationRepository;
import com.placementintelligence.security.JwtService;
import com.placementintelligence.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final OtpGenerator otpGenerator;
    private final PasswordEncoder passwordEncoder;
    private final OtpVerificationRepository otpRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public SendOtpResponse sendOtp(SendOtpRequest request) {

        String generatedOtp = otpGenerator.generateOtp();

        log.info("Generated OTP for {} : {}", request.phoneNumber(), generatedOtp);
        System.out.println("Generated OTP : " + generatedOtp);

        OtpVerification otpVerification = OtpVerification.builder()
            .phoneNumber(request.phoneNumber())
            .otp(passwordEncoder.encode(generatedOtp))
            .attemptCount(0)
            .verified(false)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(1800))
            .build();

        otpRepository.save(otpVerification);

        return new SendOtpResponse(
            request.phoneNumber(),
            "OTP sent successfully"
        );
    }

    @Override
    public LoginResponse verifyOtp(VerifyOtpRequest request) {

        OtpVerification otpVerification = otpRepository
            .findTopByPhoneNumberOrderByCreatedAtDesc(request.phoneNumber())
            .orElseThrow(() ->
                new RuntimeException("OTP not found"));

        if (otpVerification.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("OTP has expired");
        }

        if (!passwordEncoder.matches(request.otp(), otpVerification.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        otpVerification.setVerified(true);
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
    private String generateUsername(String phoneNumber) {

        String username = "user" +
            phoneNumber.substring(phoneNumber.length() - 4);

        int counter = 1;

        while (userRepository.existsByUsername(username)) {
            username = "user"
                + phoneNumber.substring(phoneNumber.length() - 4)
                + counter;
            counter++;
        }

        return username;
    }
}
