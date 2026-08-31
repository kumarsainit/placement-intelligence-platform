package com.placementintelligence.dto.response;

import com.placementintelligence.common.enums.UserRole;
import java.time.Instant;

public record AdminUserResponse(
    Long id,
    String username,
    String phoneNumber,
    UserRole role,
    Boolean isActive,
    Instant createdAt,
    Instant updatedAt
) {
}
