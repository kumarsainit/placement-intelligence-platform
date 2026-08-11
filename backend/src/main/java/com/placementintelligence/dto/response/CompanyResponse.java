package com.placementintelligence.dto.response;

import java.time.Instant;

public record CompanyResponse(

    Long id,

    String name,

    String website,

    String industry,

    String description,

    String location,

    Boolean isActive,

    Instant createdAt,

    Instant updatedAt

) {
}
