package com.placementintelligence.dto.request;

import com.placementintelligence.common.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateApplicationStatusRequest(

    @NotNull(message = "Application status is required")
    ApplicationStatus status

) {
}
