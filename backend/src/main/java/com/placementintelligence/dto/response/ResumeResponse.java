package com.placementintelligence.dto.response;

import java.time.Instant;

public record ResumeResponse(

    Long id,

    String fileName,

    String fileUrl,

    String fileType,

    Long fileSize,

    Boolean isPrimary,

    Instant uploadedAt,

    Instant updatedAt

) {
}
