package com.placementintelligence.dto.response;

import java.time.Instant;

public record SkillResponse(

    Long id,
    String name,
    String category,
    String description,
    Boolean isActive,
    Instant createdAt,
    Instant updatedAt

) {
}
