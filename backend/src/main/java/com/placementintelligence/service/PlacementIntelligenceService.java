package com.placementintelligence.service;

import com.placementintelligence.dto.response.JobRecommendationResponse;
import com.placementintelligence.dto.response.StudentPlacementInsightsResponse;

import java.util.List;

public interface PlacementIntelligenceService {

    List<JobRecommendationResponse> getJobRecommendations(String username);

    JobRecommendationResponse getJobMatchDetails(String username, Long jobId);

    StudentPlacementInsightsResponse getStudentInsights(String username);
}
