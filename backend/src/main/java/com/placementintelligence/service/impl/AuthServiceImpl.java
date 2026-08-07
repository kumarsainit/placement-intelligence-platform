package com.placementintelligence.service.impl;

import com.placementintelligence.common.utils.OtpGenerator;
import com.placementintelligence.dto.request.SendOtpRequest;
import com.placementintelligence.dto.request.VerifyOtpRequest;
import com.placementintelligence.dto.response.LoginResponse;
import com.placementintelligence.dto.response.SendOtpResponse;
import com.placementintelligence.entity.OtpVerification;
import com.placementintelligence.repository.OtpVerificationRepository;
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

    @Override
    public SendOtpResponse sendOtp(SendOtpRequest request) {

        String generatedOtp = otpGenerator.generateOtp();

        log.info("Generated OTP for {} : {}", request.phoneNumber(), generatedOtp);

        OtpVerification otpVerification = OtpVerification.builder()
            .phoneNumber(request.phoneNumber())
            .otp(passwordEncoder.encode(generatedOtp))
            .attemptCount(0)
            .verified(false)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(120))
            .build();

        otpRepository.save(otpVerification);

        return new SendOtpResponse(
            request.phoneNumber(),
            "OTP sent successfully"
        );
    }

    @Override
    public LoginResponse verifyOtp(VerifyOtpRequest request) {

        // JWT implementation next sprint
        return null;
    }
}
