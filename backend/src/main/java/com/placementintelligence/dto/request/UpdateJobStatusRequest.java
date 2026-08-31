package com.placementintelligence.dto.request;

import com.placementintelligence.common.enums.JobStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateJobStatusRequest(
    @NotNull(message = "Job status is required")
    JobStatus status
) {
}
