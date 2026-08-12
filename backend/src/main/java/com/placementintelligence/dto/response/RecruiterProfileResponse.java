package com.placementintelligence.dto.response;

import java.time.Instant;

public record RecruiterProfileResponse(

    Long id,

    Long userId,

    String username,

    Long companyId,

    String companyName,

    String designation,

    String department,

    String employeeId,

    Instant createdAt,

    Instant updatedAt
) {
}
