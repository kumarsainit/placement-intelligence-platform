package com.placementintelligence.service;

import com.placementintelligence.dto.request.SendOtpRequest;
import com.placementintelligence.dto.request.VerifyOtpRequest;
import com.placementintelligence.dto.response.LoginResponse;
import com.placementintelligence.dto.response.SendOtpResponse;

public interface AuthService {

    SendOtpResponse sendOtp(SendOtpRequest request);

    LoginResponse verifyOtp(VerifyOtpRequest request);

    LoginResponse refreshToken(com.placementintelligence.dto.request.RefreshTokenRequest request);

}
