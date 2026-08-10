package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.AddUserEducationRequest;
import com.placementintelligence.dto.response.UserEducationResponse;
import com.placementintelligence.service.UserEducationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/users/education")
@RequiredArgsConstructor
public class UserEducationController {

    private final UserEducationService userEducationService;

    @PostMapping
    public ApiResponse<UserEducationResponse> addEducation(
        Authentication authentication,
        @Valid @RequestBody AddUserEducationRequest request,
        HttpServletRequest httpRequest) {

        UserEducationResponse response =
            userEducationService.addEducation(
                authentication.getName(),
                request
            );

        return ApiResponseFactory.success(
            response,
            "Education added successfully",
            httpRequest
        );
    }

    @GetMapping
    public ApiResponse<List<UserEducationResponse>> getMyEducations(
        Authentication authentication,
        HttpServletRequest httpRequest) {

        List<UserEducationResponse> response =
            userEducationService.getMyEducations(
                authentication.getName()
            );

        return ApiResponseFactory.success(
            response,
            "Education records fetched successfully",
            httpRequest
        );
    }

    @GetMapping("/{userEducationId}")
    public ApiResponse<UserEducationResponse> getMyEducation(
        Authentication authentication,
        @PathVariable Long userEducationId,
        HttpServletRequest httpRequest) {

        UserEducationResponse response =
            userEducationService.getMyEducation(
                authentication.getName(),
                userEducationId
            );

        return ApiResponseFactory.success(
            response,
            "Education record fetched successfully",
            httpRequest
        );
    }

    @PutMapping("/{userEducationId}")
    public ApiResponse<UserEducationResponse> updateMyEducation(
        Authentication authentication,
        @PathVariable Long userEducationId,
        @Valid @RequestBody AddUserEducationRequest request,
        HttpServletRequest httpRequest) {

        UserEducationResponse response =
            userEducationService.updateMyEducation(
                authentication.getName(),
                userEducationId,
                request
            );

        return ApiResponseFactory.success(
            response,
            "Education record updated successfully",
            httpRequest
        );
    }

    @DeleteMapping("/{userEducationId}")
    public ApiResponse<Void> removeMyEducation(
        Authentication authentication,
        @PathVariable Long userEducationId,
        HttpServletRequest httpRequest) {

        userEducationService.removeMyEducation(
            authentication.getName(),
            userEducationId
        );

        return ApiResponseFactory.success(
            null,
            "Education record removed successfully",
            httpRequest
        );
    }
}
