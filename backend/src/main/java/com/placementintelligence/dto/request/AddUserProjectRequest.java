package com.placementintelligence.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record AddUserProjectRequest(

    @NotBlank(message = "Project title is required")
    @Size(
        max = 200,
        message = "Project title must not exceed 200 characters"
    )
    String title,

    @NotBlank(message = "Project description is required")
    String description,

    @NotBlank(message = "Technologies are required")
    @Size(
        max = 500,
        message = "Technologies must not exceed 500 characters"
    )
    String technologies,

    @Size(
        max = 500,
        message = "Project URL must not exceed 500 characters"
    )
    String projectUrl,

    @Size(
        max = 500,
        message = "GitHub URL must not exceed 500 characters"
    )
    String githubUrl,

    LocalDate startDate,

    LocalDate endDate,

    Boolean currentlyWorking
) {
}
