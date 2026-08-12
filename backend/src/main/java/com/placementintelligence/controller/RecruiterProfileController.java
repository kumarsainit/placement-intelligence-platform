package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.CreateRecruiterProfileRequest;
import com.placementintelligence.dto.request.UpdateRecruiterProfileRequest;
import com.placementintelligence.dto.response.RecruiterProfileResponse;
import com.placementintelligence.service.RecruiterProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/users/recruiter-profile")
@RequiredArgsConstructor
public class RecruiterProfileController {

    private final RecruiterProfileService recruiterProfileService;

    @PostMapping
    public ApiResponse<RecruiterProfileResponse> createProfile(
        Authentication authentication,
        @Valid @RequestBody CreateRecruiterProfileRequest requestBody,
        HttpServletRequest request) {

        RecruiterProfileResponse response =
            recruiterProfileService.createProfile(
                authentication.getName(),
                requestBody
            );

        return ApiResponseFactory.created(
            response,
            "Recruiter profile created successfully",
            request
        );
    }

    @GetMapping
    public ApiResponse<RecruiterProfileResponse> getProfile(
        Authentication authentication,
        HttpServletRequest request) {

        RecruiterProfileResponse response =
            recruiterProfileService.getCurrentProfile(
                authentication.getName()
            );

        return ApiResponseFactory.success(
            response,
            "Recruiter profile fetched successfully",
            request
        );
    }

    @PutMapping
    public ApiResponse<RecruiterProfileResponse> updateProfile(
        Authentication authentication,
        @Valid @RequestBody UpdateRecruiterProfileRequest requestBody,
        HttpServletRequest request) {

        RecruiterProfileResponse response =
            recruiterProfileService.updateProfile(
                authentication.getName(),
                requestBody
            );

        return ApiResponseFactory.success(
            response,
            "Recruiter profile updated successfully",
            request
        );
    }
}
