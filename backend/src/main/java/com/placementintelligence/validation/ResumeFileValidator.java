package com.placementintelligence.validation;

import com.placementintelligence.exception.BadRequestException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ResumeFileValidator {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    public void validate(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException(
                "Resume file is required"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException(
                "Resume file size must not exceed 5 MB"
            );
        }

        String contentType = file.getContentType();

        if (!"application/pdf".equalsIgnoreCase(contentType)) {
            throw new BadRequestException(
                "Only PDF resumes are allowed"
            );
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null ||
            !fileName.toLowerCase().endsWith(".pdf")) {

            throw new BadRequestException(
                "Resume must have a .pdf extension"
            );
        }
    }
}
