package com.placementintelligence.dto.request;

import com.placementintelligence.common.enums.EmploymentType;
import com.placementintelligence.common.enums.ExperienceLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record JobSearchRequest(

    @Size(
        max = 200,
        message = "Search keyword must not exceed 200 characters"
    )
    String keyword,

    @Size(
        max = 200,
        message = "Location must not exceed 200 characters"
    )
    String location,

    Long companyId,

    EmploymentType employmentType,

    ExperienceLevel experienceLevel,

    @Min(
        value = 0,
        message = "Minimum salary must not be negative"
    )
    BigDecimal minSalary,

    @Min(
        value = 0,
        message = "Maximum salary must not be negative"
    )
    BigDecimal maxSalary,

    @Min(
        value = 0,
        message = "Page number must not be negative"
    )
    Integer page,

    @Min(
        value = 1,
        message = "Page size must be at least 1"
    )
    Integer size
) {
}
