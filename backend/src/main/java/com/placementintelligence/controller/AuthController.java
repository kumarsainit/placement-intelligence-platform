package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.SendOtpRequest;
import com.placementintelligence.dto.response.SendOtpResponse;
import com.placementintelligence.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ApiResponse<SendOtpResponse> sendOtp(
        @Valid @RequestBody SendOtpRequest request,
        HttpServletRequest httpRequest
    ) {

        SendOtpResponse response = authService.sendOtp(request);

        return ApiResponseFactory.success(
            response,
            "OTP sent successfully",
            httpRequest
        );
    }
}
