package com.placementintelligence.dto.response;

import java.util.List;

public record StudentPlacementInsightsResponse(
    Integer profileCompleteness,
    Integer totalSkills,
    Integer totalProjects,
    Boolean hasPrimaryResume,
    Integer eligibleJobsCount,
    Integer matchedJobsCount,
    List<String> topInDemandSkills
) {
}
