package com.placementintelligence.dto.response;

import java.time.Instant;
import java.time.LocalDate;

public record UserProjectResponse(

    Long id,

    String title,

    String description,

    String technologies,

    String projectUrl,

    String githubUrl,

    LocalDate startDate,

    LocalDate endDate,

    Boolean currentlyWorking,

    Instant createdAt,

    Instant updatedAt

) {
}
