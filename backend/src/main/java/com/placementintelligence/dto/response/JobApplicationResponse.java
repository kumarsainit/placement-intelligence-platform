package com.placementintelligence.dto.response;

import com.placementintelligence.common.enums.ApplicationStatus;

import java.time.Instant;

public record JobApplicationResponse(

    Long id,

    Long jobId,

    String jobTitle,

    Long companyId,

    String companyName,

    Long applicantId,

    String applicantUsername,

    Long resumeId,

    String resumeFileName,

    String resumeFileUrl,

    String resumeFileType,

    Long resumeFileSize,

    String coverLetter,

    ApplicationStatus status,

    Instant appliedAt,

    Instant updatedAt

) {
}
