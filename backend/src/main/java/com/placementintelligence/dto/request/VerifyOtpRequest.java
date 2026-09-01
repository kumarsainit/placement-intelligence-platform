package com.placementintelligence.dto.request;

import com.placementintelligence.common.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyOtpRequest(

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Invalid phone number"
    )
    String phoneNumber,

    @NotBlank(message = "OTP is required")
    @Pattern(
        regexp = "^\\d{6}$",
        message = "OTP must be 6 digits"
    )
    String otp,

    UserRole role

) {
    public VerifyOtpRequest(String phoneNumber, String otp) {
        this(phoneNumber, otp, null);
    }
}
