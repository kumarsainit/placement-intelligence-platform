package com.placementintelligence.service.impl;

import com.placementintelligence.service.OtpDeliveryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Profile("!dev")
public class NoOpOtpDeliveryService implements OtpDeliveryService {

    @Override
    public void deliverOtp(String phoneNumber, String otp, long expirationSeconds) {
        // In non-dev environments (such as production), OTP is delivered via external SMS gateway without logging the plaintext code.
        log.info("Dispatched OTP delivery request for phone number");
    }
}
