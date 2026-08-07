package com.placementintelligence.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SendOtpRequest(

    @NotBlank(message = "Phone number is required")

    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Invalid phone number"
    )

    String phoneNumber

) {
}
