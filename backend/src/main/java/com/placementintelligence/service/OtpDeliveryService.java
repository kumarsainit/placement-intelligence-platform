package com.placementintelligence.service;

public interface OtpDeliveryService {

    void deliverOtp(String phoneNumber, String otp, long expirationSeconds);
}
