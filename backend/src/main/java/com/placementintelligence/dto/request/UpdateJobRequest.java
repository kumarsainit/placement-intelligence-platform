package com.placementintelligence.dto.request;

import com.placementintelligence.common.enums.EmploymentType;
import com.placementintelligence.common.enums.ExperienceLevel;
import com.placementintelligence.common.enums.JobStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateJobRequest(

    @NotNull(message = "Company ID is required")
    Long companyId,

    @NotBlank(message = "Job title is required")
    @Size(
        max = 200,
        message = "Job title must not exceed 200 characters"
    )
    String title,

    @NotBlank(message = "Job description is required")
    String description,

    @Size(
        max = 200,
        message = "Location must not exceed 200 characters"
    )
    String location,

    @NotNull(message = "Employment type is required")
    EmploymentType employmentType,

    @NotNull(message = "Experience level is required")
    ExperienceLevel experienceLevel,

    @PositiveOrZero(message = "Minimum salary must not be negative")
    BigDecimal salaryMin,

    @PositiveOrZero(message = "Maximum salary must not be negative")
    BigDecimal salaryMax,

    @NotNull(message = "Number of openings is required")
    @Min(
        value = 1,
        message = "Number of openings must be at least 1"
    )
    Integer openings,

    @NotNull(message = "Application deadline is required")
    LocalDate applicationDeadline,

    @NotNull(message = "Job status is required")
    JobStatus status

) {
}
