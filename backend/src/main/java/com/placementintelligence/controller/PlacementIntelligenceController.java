package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.response.JobRecommendationResponse;
import com.placementintelligence.dto.response.StudentPlacementInsightsResponse;
import com.placementintelligence.service.PlacementIntelligenceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/recommendations")
@RequiredArgsConstructor
public class PlacementIntelligenceController {

    private final PlacementIntelligenceService placementIntelligenceService;

    @GetMapping("/jobs")
    public ApiResponse<List<JobRecommendationResponse>> getJobRecommendations(
        Authentication authentication,
        HttpServletRequest request
    ) {
        List<JobRecommendationResponse> response =
            placementIntelligenceService.getJobRecommendations(authentication.getName());

        return ApiResponseFactory.success(
            response,
            "Job recommendations fetched successfully",
            request
        );
    }

    @GetMapping("/jobs/{jobId}")
    public ApiResponse<JobRecommendationResponse> getJobMatchDetails(
        Authentication authentication,
        @PathVariable Long jobId,
        HttpServletRequest request
    ) {
        JobRecommendationResponse response =
            placementIntelligenceService.getJobMatchDetails(authentication.getName(), jobId);

        return ApiResponseFactory.success(
            response,
            "Job match details fetched successfully",
            request
        );
    }

    @GetMapping("/insights")
    public ApiResponse<StudentPlacementInsightsResponse> getStudentInsights(
        Authentication authentication,
        HttpServletRequest request
    ) {
        StudentPlacementInsightsResponse response =
            placementIntelligenceService.getStudentInsights(authentication.getName());

        return ApiResponseFactory.success(
            response,
            "Placement insights fetched successfully",
            request
        );
    }
}
