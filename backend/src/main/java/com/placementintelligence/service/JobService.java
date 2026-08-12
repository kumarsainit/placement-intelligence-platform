package com.placementintelligence.service;

import com.placementintelligence.dto.request.CreateJobRequest;
import com.placementintelligence.dto.request.UpdateJobRequest;
import com.placementintelligence.dto.response.JobResponse;

import java.util.List;

public interface JobService {

    JobResponse createJob(
        String username,
        CreateJobRequest request
    );

    List<JobResponse> getAllOpenJobs();

    List<JobResponse> getRecruiterJobs(
        String username
    );

    JobResponse getJobById(
        Long jobId
    );

    JobResponse updateJob(
        String username,
        Long jobId,
        UpdateJobRequest request
    );

    void deleteJob(
        String username,
        Long jobId
    );
}
