package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.UploadResumeRequest;
import com.placementintelligence.dto.response.ResumeResponse;
import com.placementintelligence.service.UserResumeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/v1/users/resumes")
@RequiredArgsConstructor
public class UserResumeController {

    private final UserResumeService resumeService;

    @PostMapping(
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<ResumeResponse> uploadResume(
        Authentication authentication,
        @RequestPart("file") MultipartFile file,
        @RequestParam(
            value = "isPrimary",
            required = false,
            defaultValue = "false"
        ) boolean isPrimary,
        HttpServletRequest request) {

        UploadResumeRequest uploadRequest =
            new UploadResumeRequest(file, isPrimary);

        ResumeResponse response =
            resumeService.uploadResume(
                authentication.getName(),
                uploadRequest
            );

        return ApiResponseFactory.success(
            response,
            "Resume uploaded successfully",
            request
        );
    }

    @GetMapping
    public ApiResponse<List<ResumeResponse>> getMyResumes(
        Authentication authentication,
        HttpServletRequest request) {

        List<ResumeResponse> response =
            resumeService.getMyResumes(
                authentication.getName()
            );

        return ApiResponseFactory.success(
            response,
            "Resumes fetched successfully",
            request
        );
    }

    @GetMapping("/{resumeId}")
    public ApiResponse<ResumeResponse> getMyResume(
        Authentication authentication,
        @PathVariable Long resumeId,
        HttpServletRequest request) {

        ResumeResponse response =
            resumeService.getMyResume(
                authentication.getName(),
                resumeId
            );

        return ApiResponseFactory.created(
            response,
            "Resume uploaded successfully",
            request
        );
    }

    @GetMapping("/{resumeId}/file")
    public ResponseEntity<Resource> downloadResume(
        Authentication authentication,
        @PathVariable Long resumeId) {

        Resource resource =
            resumeService.getResumeFile(
                authentication.getName(),
                resumeId
            );

        return ResponseEntity.ok()
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "inline; filename=\"" + resource.getFilename() + "\""
            )
            .header(
                HttpHeaders.CONTENT_TYPE,
                MediaType.APPLICATION_PDF_VALUE
            )
            .body(resource);
    }

    @PutMapping("/{resumeId}/primary")
    public ApiResponse<ResumeResponse> setPrimaryResume(
        Authentication authentication,
        @PathVariable Long resumeId,
        HttpServletRequest request) {

        ResumeResponse response =
            resumeService.setPrimaryResume(
                authentication.getName(),
                resumeId
            );

        return ApiResponseFactory.success(
            response,
            "Primary resume updated successfully",
            request
        );
    }

    @DeleteMapping("/{resumeId}")
    public ApiResponse<Void> deleteResume(
        Authentication authentication,
        @PathVariable Long resumeId,
        HttpServletRequest request) {

        resumeService.deleteResume(
            authentication.getName(),
            resumeId
        );

        return ApiResponseFactory.success(
            null,
            "Resume deleted successfully",
            request
        );
    }
}
