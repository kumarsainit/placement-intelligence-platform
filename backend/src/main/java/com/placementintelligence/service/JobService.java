package com.placementintelligence.service;

import com.placementintelligence.dto.request.CreateJobRequest;
import com.placementintelligence.dto.request.JobSearchRequest;
import com.placementintelligence.dto.request.UpdateJobRequest;
import com.placementintelligence.dto.response.JobResponse;
import com.placementintelligence.dto.response.JobSearchResponse;
import org.springframework.data.domain.Page;

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

    Page<JobSearchResponse> searchOpenJobs(
        JobSearchRequest request
    );
}
