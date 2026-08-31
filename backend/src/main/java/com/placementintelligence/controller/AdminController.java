package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.response.AdminAnalyticsResponse;
import com.placementintelligence.service.AdminAnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/analytics/overview")
    public ApiResponse<AdminAnalyticsResponse> getAnalyticsOverview(
        Authentication authentication,
        HttpServletRequest request
    ) {
        AdminAnalyticsResponse response =
            adminAnalyticsService.getOverview(authentication.getName());

        return ApiResponseFactory.success(
            response,
            "Admin analytics overview fetched successfully",
            request
        );
    }
}
