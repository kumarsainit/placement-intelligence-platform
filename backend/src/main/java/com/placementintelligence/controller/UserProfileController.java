package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.UpdateProfileRequest;
import com.placementintelligence.dto.response.UserProfileResponse;
import com.placementintelligence.service.UserProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    

    @GetMapping("/profile")
    public ApiResponse<UserProfileResponse> getProfile(
        Authentication authentication,
        HttpServletRequest request) {

        UserProfileResponse response =
            userProfileService.getCurrentUserProfile(
                authentication.getName());

        return ApiResponseFactory.success(
            response,
            "Profile fetched successfully",
            request
        );
    }

    @PutMapping("/profile")
    public ApiResponse<UserProfileResponse> updateProfile(
        Authentication authentication,
        @Valid @RequestBody UpdateProfileRequest requestBody,
        HttpServletRequest request) {

        UserProfileResponse response =
            userProfileService.updateCurrentUserProfile(
                authentication.getName(),
                requestBody);

        return ApiResponseFactory.success(
            response,
            "Profile updated successfully",
            request
        );
    }
}
