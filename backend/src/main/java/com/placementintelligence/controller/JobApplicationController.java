package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.CreateJobApplicationRequest;
import com.placementintelligence.dto.request.UpdateApplicationStatusRequest;
import com.placementintelligence.dto.response.JobApplicationResponse;
import com.placementintelligence.service.JobApplicationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/users/applications")
    public ApiResponse<JobApplicationResponse> applyForJob(
        Authentication authentication,
        @Valid @RequestBody CreateJobApplicationRequest requestBody,
        HttpServletRequest request) {

        JobApplicationResponse response =
            jobApplicationService.applyForJob(
                authentication.getName(),
                requestBody
            );

        return ApiResponseFactory.created(
            response,
            "Job application submitted successfully",
            request
        );
    }

    @GetMapping("/users/applications")
    public ApiResponse<List<JobApplicationResponse>> getMyApplications(
        Authentication authentication,
        HttpServletRequest request) {

        List<JobApplicationResponse> response =
            jobApplicationService.getMyApplications(
                authentication.getName()
            );

        return ApiResponseFactory.success(
            response,
            "Applications fetched successfully",
            request
        );
    }

    @GetMapping("/users/applications/{applicationId}")
    public ApiResponse<JobApplicationResponse> getMyApplication(
        Authentication authentication,
        @PathVariable Long applicationId,
        HttpServletRequest request) {

        JobApplicationResponse response =
            jobApplicationService.getMyApplication(
                authentication.getName(),
                applicationId
            );

        return ApiResponseFactory.success(
            response,
            "Application fetched successfully",
            request
        );
    }

    @GetMapping("/recruiter/jobs/{jobId}/applications")
    public ApiResponse<List<JobApplicationResponse>> getJobApplications(
        Authentication authentication,
        @PathVariable Long jobId,
        HttpServletRequest request) {

        List<JobApplicationResponse> response =
            jobApplicationService.getJobApplications(
                authentication.getName(),
                jobId
            );

        return ApiResponseFactory.success(
            response,
            "Job applications fetched successfully",
            request
        );
    }

    @GetMapping("/recruiter/applications/{applicationId}")
    public ApiResponse<JobApplicationResponse> getApplicationByIdForRecruiter(
        Authentication authentication,
        @PathVariable Long applicationId,
        HttpServletRequest request) {

        JobApplicationResponse response =
            jobApplicationService.getApplicationByIdForRecruiter(
                authentication.getName(),
                applicationId
            );

        return ApiResponseFactory.success(
            response,
            "Application fetched successfully",
            request
        );
    }

    @PutMapping("/recruiter/applications/{applicationId}/status")
    public ApiResponse<JobApplicationResponse> updateApplicationStatus(
        Authentication authentication,
        @PathVariable Long applicationId,
        @Valid @RequestBody UpdateApplicationStatusRequest requestBody,
        HttpServletRequest request) {

        JobApplicationResponse response =
            jobApplicationService.updateApplicationStatus(
                authentication.getName(),
                applicationId,
                requestBody
            );

        return ApiResponseFactory.success(
            response,
            "Application status updated successfully",
            request
        );
    }
}
