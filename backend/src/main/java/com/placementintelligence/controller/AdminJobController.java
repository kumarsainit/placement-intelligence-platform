package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.UpdateJobStatusRequest;
import com.placementintelligence.dto.response.JobResponse;
import com.placementintelligence.service.AdminPlacementGovernanceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/jobs")
@RequiredArgsConstructor
public class AdminJobController {

    private final AdminPlacementGovernanceService governanceService;

    @GetMapping
    public ApiResponse<List<JobResponse>> getAllJobs(
        Authentication authentication,
        HttpServletRequest request
    ) {
        List<JobResponse> response =
            governanceService.getAllJobs(authentication.getName());

        return ApiResponseFactory.success(
            response,
            "Admin jobs fetched successfully",
            request
        );
    }

    @GetMapping("/{jobId}")
    public ApiResponse<JobResponse> getJobById(
        Authentication authentication,
        @PathVariable Long jobId,
        HttpServletRequest request
    ) {
        JobResponse response =
            governanceService.getJobById(authentication.getName(), jobId);

        return ApiResponseFactory.success(
            response,
            "Job fetched successfully",
            request
        );
    }

    @PatchMapping("/{jobId}/status")
    public ApiResponse<JobResponse> updateJobStatusPatch(
        Authentication authentication,
        @PathVariable Long jobId,
        @Valid @RequestBody UpdateJobStatusRequest statusRequest,
        HttpServletRequest request
    ) {
        JobResponse response =
            governanceService.updateJobStatus(
                authentication.getName(),
                jobId,
                statusRequest
            );

        return ApiResponseFactory.success(
            response,
            "Job status updated successfully",
            request
        );
    }

    @PutMapping("/{jobId}/status")
    public ApiResponse<JobResponse> updateJobStatusPut(
        Authentication authentication,
        @PathVariable Long jobId,
        @Valid @RequestBody UpdateJobStatusRequest statusRequest,
        HttpServletRequest request
    ) {
        return updateJobStatusPatch(authentication, jobId, statusRequest, request);
    }
}
