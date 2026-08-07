package com.placementintelligence.dto.response;

public record SendOtpResponse(
    String phoneNumber,
    String message
) {
}
