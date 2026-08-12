package com.placementintelligence.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateJobApplicationRequest(

    @NotNull(message = "Job ID is required")
    Long jobId,

    @NotNull(message = "Resume ID is required")
    Long resumeId,

    @Size(
        max = 5000,
        message = "Cover letter must not exceed 5000 characters"
    )
    String coverLetter

) {
}
