package com.placementintelligence.service;

import com.placementintelligence.common.enums.ApplicationStatus;
import com.placementintelligence.dto.request.CreateJobApplicationRequest;
import com.placementintelligence.dto.request.UpdateApplicationStatusRequest;
import com.placementintelligence.dto.response.JobApplicationResponse;

import java.util.List;

public interface JobApplicationService {

    JobApplicationResponse applyForJob(
        String username,
        CreateJobApplicationRequest request
    );

    List<JobApplicationResponse> getMyApplications(
        String username
    );

    JobApplicationResponse getMyApplication(
        String username,
        Long applicationId
    );

    List<JobApplicationResponse> getJobApplications(
        String username,
        Long jobId
    );

    List<JobApplicationResponse> getAllApplicationsForRecruiter(
        String username
    );

    JobApplicationResponse getApplicationByIdForRecruiter(
        String username,
        Long applicationId
    );

    JobApplicationResponse updateApplicationStatus(
        String username,
        Long applicationId,
        UpdateApplicationStatusRequest request
    );

    org.springframework.core.io.Resource getApplicationResumeForRecruiter(
        String username,
        Long applicationId
    );
}
