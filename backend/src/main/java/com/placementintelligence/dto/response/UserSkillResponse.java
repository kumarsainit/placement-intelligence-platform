package com.placementintelligence.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record UserSkillResponse(

    Long id,
    Long skillId,
    String skillName,
    String category,
    String proficiency,
    BigDecimal yearsOfExperience,
    Instant createdAt,
    Instant updatedAt

) {
}
