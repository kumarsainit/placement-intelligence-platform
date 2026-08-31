package com.placementintelligence.service;

import com.placementintelligence.dto.request.UpdateCompanyStatusRequest;
import com.placementintelligence.dto.request.UpdateJobStatusRequest;
import com.placementintelligence.dto.response.CompanyResponse;
import com.placementintelligence.dto.response.JobResponse;

import java.util.List;

public interface AdminPlacementGovernanceService {

    List<CompanyResponse> getAllCompanies(String callerUsername);

    CompanyResponse getCompanyById(String callerUsername, Long companyId);

    CompanyResponse updateCompanyStatus(
        String callerUsername,
        Long companyId,
        UpdateCompanyStatusRequest request
    );

    List<JobResponse> getAllJobs(String callerUsername);

    JobResponse getJobById(String callerUsername, Long jobId);

    JobResponse updateJobStatus(
        String callerUsername,
        Long jobId,
        UpdateJobStatusRequest request
    );
}
