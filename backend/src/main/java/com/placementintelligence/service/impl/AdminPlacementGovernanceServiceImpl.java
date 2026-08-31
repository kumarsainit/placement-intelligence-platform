package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.request.UpdateCompanyStatusRequest;
import com.placementintelligence.dto.request.UpdateJobStatusRequest;
import com.placementintelligence.dto.response.CompanyResponse;
import com.placementintelligence.dto.response.JobResponse;
import com.placementintelligence.entity.Company;
import com.placementintelligence.entity.Job;
import com.placementintelligence.entity.User;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.mapper.CompanyMapper;
import com.placementintelligence.mapper.JobMapper;
import com.placementintelligence.repository.CompanyRepository;
import com.placementintelligence.repository.JobRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.AdminPlacementGovernanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPlacementGovernanceServiceImpl implements AdminPlacementGovernanceService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final CompanyMapper companyMapper;
    private final JobMapper jobMapper;

    private User validateAdminCaller(String callerUsername) {
        User caller = userRepository.findByUsername(callerUsername)
            .orElseThrow(() -> new ResourceNotFoundException("Caller user not found"));

        if (!Boolean.TRUE.equals(caller.getIsActive())) {
            throw new AccessDeniedException("User account is inactive");
        }

        if (caller.getRole() != UserRole.ADMIN && caller.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Only administrators can access placement governance");
        }

        return caller;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies(String callerUsername) {
        validateAdminCaller(callerUsername);
        List<Company> companies = companyRepository.findAllByOrderByCreatedAtDesc();
        return companyMapper.toResponseList(companies);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(String callerUsername, Long companyId) {
        validateAdminCaller(callerUsername);
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));
        return companyMapper.toResponse(company);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompanyStatus(
        String callerUsername,
        Long companyId,
        UpdateCompanyStatusRequest request
    ) {
        validateAdminCaller(callerUsername);
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        company.setIsActive(request.isActive());
        company.setUpdatedAt(Instant.now());
        Company updated = companyRepository.save(company);

        return companyMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobs(String callerUsername) {
        validateAdminCaller(callerUsername);
        List<Job> jobs = jobRepository.findAllByOrderByCreatedAtDesc();
        return jobMapper.toResponseList(jobs);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(String callerUsername, Long jobId) {
        validateAdminCaller(callerUsername);
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        return jobMapper.toResponse(job);
    }

    @Override
    @Transactional
    public JobResponse updateJobStatus(
        String callerUsername,
        Long jobId,
        UpdateJobStatusRequest request
    ) {
        validateAdminCaller(callerUsername);
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        job.setStatus(request.status());
        job.setUpdatedAt(Instant.now());
        Job updated = jobRepository.save(job);

        return jobMapper.toResponse(updated);
    }
}
