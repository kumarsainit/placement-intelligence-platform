package com.placementintelligence.dto.response;

public record LoginResponse(

    String accessToken,

    String refreshToken,

    String username,

    String phoneNumber

) {
}
