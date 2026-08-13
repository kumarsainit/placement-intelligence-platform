package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.CreateJobRequest;
import com.placementintelligence.dto.request.UpdateJobRequest;
import com.placementintelligence.dto.response.JobResponse;
import com.placementintelligence.service.JobService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.placementintelligence.dto.request.JobSearchRequest;
import com.placementintelligence.dto.response.JobSearchResponse;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ApiResponse<JobResponse> createJob(
        Authentication authentication,
        @Valid @RequestBody CreateJobRequest requestBody,
        HttpServletRequest request) {

        JobResponse response =
            jobService.createJob(
                authentication.getName(),
                requestBody
            );

        return ApiResponseFactory.created(
            response,
            "Job created successfully",
            request
        );
    }

    @GetMapping
    public ApiResponse<List<JobResponse>> getAllOpenJobs(
        HttpServletRequest request) {

        List<JobResponse> response =
            jobService.getAllOpenJobs();

        return ApiResponseFactory.success(
            response,
            "Open jobs fetched successfully",
            request
        );
    }

    @GetMapping("/{jobId}")
    public ApiResponse<JobResponse> getJobById(
        @PathVariable Long jobId,
        HttpServletRequest request) {

        JobResponse response =
            jobService.getJobById(jobId);

        return ApiResponseFactory.success(
            response,
            "Job fetched successfully",
            request
        );
    }

    @GetMapping("/recruiter")
    public ApiResponse<List<JobResponse>> getRecruiterJobs(
        Authentication authentication,
        HttpServletRequest request) {

        List<JobResponse> response =
            jobService.getRecruiterJobs(
                authentication.getName()
            );

        return ApiResponseFactory.success(
            response,
            "Recruiter jobs fetched successfully",
            request
        );
    }

    @PutMapping("/{jobId}")
    public ApiResponse<JobResponse> updateJob(
        Authentication authentication,
        @PathVariable Long jobId,
        @Valid @RequestBody UpdateJobRequest requestBody,
        HttpServletRequest request) {

        JobResponse response =
            jobService.updateJob(
                authentication.getName(),
                jobId,
                requestBody
            );

        return ApiResponseFactory.success(
            response,
            "Job updated successfully",
            request
        );
    }

    @DeleteMapping("/{jobId}")
    public ApiResponse<Void> deleteJob(
        Authentication authentication,
        @PathVariable Long jobId,
        HttpServletRequest request) {

        jobService.deleteJob(
            authentication.getName(),
            jobId
        );

        return ApiResponseFactory.success(
            null,
            "Job deleted successfully",
            request
        );
    }

    @GetMapping("/search")
    public ApiResponse<Page<JobSearchResponse>> searchJobs(
        @Valid JobSearchRequest searchRequest,
        HttpServletRequest request) {

        Page<JobSearchResponse> response =
            jobService.searchOpenJobs(searchRequest);

        return ApiResponseFactory.success(
            response,
            "Jobs searched successfully",
            request
        );
    }
}
