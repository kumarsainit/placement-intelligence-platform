package com.placementintelligence.dto.request;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record UploadResumeRequest(

    @NotNull(message = "Resume file is required")
    MultipartFile file,

    Boolean isPrimary

) {
}
