package com.placementintelligence.service.impl;

import com.placementintelligence.service.OtpDeliveryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Profile("dev")
public class DevOtpDeliveryService implements OtpDeliveryService {

    @Override
    public void deliverOtp(String phoneNumber, String otp, long expirationSeconds) {
        long minutes = expirationSeconds / 60;
        String expiryText = minutes > 0 ? minutes + " minutes" : expirationSeconds + " seconds";

        log.info("[DEV OTP] ========================================");
        log.info("[DEV OTP] Phone: {}", phoneNumber);
        log.info("[DEV OTP] Code: {}", otp);
        log.info("[DEV OTP] Expires in: {}", expiryText);
        log.info("[DEV OTP] ========================================");
    }
}
