package com.placementintelligence.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateCompanyStatusRequest(
    @NotNull(message = "Active status is required")
    Boolean isActive
) {
}
