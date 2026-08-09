package com.placementintelligence.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record AddUserSkillRequest(

    @NotNull(message = "Skill ID is required")
    Long skillId,

    @Size(max = 30, message = "Proficiency must not exceed 30 characters")
    String proficiency,

    @DecimalMin(
        value = "0.0",
        message = "Years of experience cannot be negative"
    )
    @DecimalMax(
        value = "99.99",
        message = "Years of experience is invalid"
    )
    BigDecimal yearsOfExperience

) {
}
