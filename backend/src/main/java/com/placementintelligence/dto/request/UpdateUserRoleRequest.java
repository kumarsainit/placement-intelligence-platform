package com.placementintelligence.dto.request;

import com.placementintelligence.common.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
    @NotNull(message = "Role is required")
    UserRole role
) {
}
