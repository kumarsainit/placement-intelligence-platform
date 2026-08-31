package com.placementintelligence.dto.response;

import com.placementintelligence.common.enums.ApplicationStatus;

import java.util.List;

public record JobRecommendationResponse(
    JobResponse job,
    Integer matchScore,
    String matchGrade,
    List<String> matchedSkills,
    List<String> missingSkills,
    Boolean isEligible,
    Boolean hasApplied,
    ApplicationStatus applicationStatus
) {
}
