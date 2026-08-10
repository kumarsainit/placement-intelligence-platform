package com.placementintelligence.dto.request;

import com.placementintelligence.entity.EducationLevel;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record AddUserEducationRequest(

    @NotNull(message = "Education level is required")
    EducationLevel educationLevel,

    @Size(
        max = 150,
        message = "Degree must not exceed 150 characters"
    )
    String degree,

    @NotBlank(message = "Institution is required")
    @Size(
        max = 200,
        message = "Institution must not exceed 200 characters"
    )
    String institution,

    @Size(
        max = 150,
        message = "Field of study must not exceed 150 characters"
    )
    String fieldOfStudy,

    Integer startYear,

    Integer endYear,

    @DecimalMin(
        value = "0.0",
        message = "CGPA cannot be negative"
    )
    @DecimalMax(
        value = "10.0",
        message = "CGPA cannot exceed 10"
    )
    BigDecimal cgpa,

    @DecimalMin(
        value = "0.0",
        message = "Percentage cannot be negative"
    )
    @DecimalMax(
        value = "100.0",
        message = "Percentage cannot exceed 100"
    )
    BigDecimal percentage,

    Boolean currentlyPursuing
) {
}
