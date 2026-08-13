package com.placementintelligence.dto.response;

import com.placementintelligence.common.enums.EmploymentType;
import com.placementintelligence.common.enums.ExperienceLevel;
import com.placementintelligence.common.enums.JobStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record JobSearchResponse(

    Long id,

    Long companyId,

    String companyName,

    Long recruiterProfileId,

    String title,

    String description,

    String location,

    EmploymentType employmentType,

    ExperienceLevel experienceLevel,

    BigDecimal salaryMin,

    BigDecimal salaryMax,

    Integer openings,

    LocalDate applicationDeadline,

    JobStatus status,

    Instant createdAt,

    Instant updatedAt
) {
}
