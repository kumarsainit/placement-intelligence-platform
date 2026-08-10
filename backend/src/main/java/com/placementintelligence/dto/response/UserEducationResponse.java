package com.placementintelligence.dto.response;

import com.placementintelligence.entity.EducationLevel;

import java.math.BigDecimal;
import java.time.Instant;

public record UserEducationResponse(

    Long id,

    EducationLevel educationLevel,

    String degree,

    String institution,

    String fieldOfStudy,

    Integer startYear,

    Integer endYear,

    BigDecimal cgpa,

    BigDecimal percentage,

    Boolean currentlyPursuing,

    Instant createdAt,

    Instant updatedAt

) {
}
