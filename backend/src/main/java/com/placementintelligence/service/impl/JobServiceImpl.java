package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.JobStatus;
import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.request.CreateJobRequest;
import com.placementintelligence.dto.request.UpdateJobRequest;
import com.placementintelligence.dto.response.JobResponse;
import com.placementintelligence.entity.Company;
import com.placementintelligence.entity.Job;
import com.placementintelligence.entity.RecruiterProfile;
import com.placementintelligence.entity.User;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.UnauthorizedException;
import com.placementintelligence.mapper.JobMapper;
import com.placementintelligence.repository.CompanyRepository;
import com.placementintelligence.repository.JobRepository;
import com.placementintelligence.repository.RecruiterProfileRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.placementintelligence.common.enums.EmploymentType;
import com.placementintelligence.common.enums.ExperienceLevel;
import com.placementintelligence.common.enums.JobStatus;
import com.placementintelligence.dto.request.JobSearchRequest;
import com.placementintelligence.dto.response.JobSearchResponse;
import com.placementintelligence.entity.Job;
import com.placementintelligence.specification.JobSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final JobMapper mapper;

    @Override
    @Transactional
    public JobResponse createJob(
        String username,
        CreateJobRequest request) {

        RecruiterProfile recruiter =
            getRecruiterProfile(username);

        Company company =
            getAndVerifyCompany(
                request.companyId(),
                recruiter
            );

        validateSalaryRange(
            request.salaryMin(),
            request.salaryMax()
        );

        validateApplicationDeadline(
            request.applicationDeadline()
        );

        Job job = Job.builder()
            .company(company)
            .recruiter(recruiter)
            .title(request.title())
            .description(request.description())
            .location(request.location())
            .employmentType(request.employmentType())
            .experienceLevel(request.experienceLevel())
            .salaryMin(request.salaryMin())
            .salaryMax(request.salaryMax())
            .openings(request.openings())
            .applicationDeadline(
                request.applicationDeadline()
            )
            .status(JobStatus.DRAFT)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

        job = jobRepository.save(job);

        return mapper.toResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getAllOpenJobs() {

        return jobRepository
            .findByStatusOrderByCreatedAtDesc(JobStatus.OPEN)
            .stream()
            .map(mapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getRecruiterJobs(
        String username) {

        RecruiterProfile recruiter =
            getRecruiterProfile(username);

        return jobRepository
            .findByRecruiterOrderByCreatedAtDesc(recruiter)
            .stream()
            .map(mapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(
        Long jobId) {

        Job job = jobRepository
            .findById(jobId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Job not found"
                )
            );

        return mapper.toResponse(job);
    }

    @Override
    @Transactional
    public JobResponse updateJob(
        String username,
        Long jobId,
        UpdateJobRequest request) {

        RecruiterProfile recruiter =
            getRecruiterProfile(username);

        Job job = jobRepository
            .findById(jobId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Job not found"
                )
            );

        verifyJobOwnership(
            job,
            recruiter
        );

        Company company =
            getAndVerifyCompany(
                request.companyId(),
                recruiter
            );

        validateSalaryRange(
            request.salaryMin(),
            request.salaryMax()
        );

        validateApplicationDeadline(
            request.applicationDeadline()
        );

        job.setCompany(company);
        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setLocation(request.location());
        job.setEmploymentType(
            request.employmentType()
        );
        job.setExperienceLevel(
            request.experienceLevel()
        );
        job.setSalaryMin(
            request.salaryMin()
        );
        job.setSalaryMax(
            request.salaryMax()
        );
        job.setOpenings(
            request.openings()
        );
        job.setApplicationDeadline(
            request.applicationDeadline()
        );
        job.setStatus(
            request.status()
        );
        job.setUpdatedAt(Instant.now());

        job = jobRepository.save(job);

        return mapper.toResponse(job);
    }

    @Override
    @Transactional
    public void deleteJob(
        String username,
        Long jobId) {

        RecruiterProfile recruiter =
            getRecruiterProfile(username);

        Job job = jobRepository
            .findById(jobId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Job not found"
                )
            );

        verifyJobOwnership(
            job,
            recruiter
        );

        jobRepository.delete(job);
    }

    private RecruiterProfile getRecruiterProfile(
        String username) {

        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User not found"
                )
            );

        if (user.getRole() != UserRole.RECRUITER) {
            throw new org.springframework.security.access.AccessDeniedException(
                "Only recruiters can manage jobs"
            );
        }

        if (!Boolean.TRUE.equals(
            user.getIsActive()
        )) {
            throw new org.springframework.security.access.AccessDeniedException(
                "User account is inactive"
            );
        }

        return recruiterProfileRepository
            .findByUser(user)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Recruiter profile not found"
                )
            );
    }

    private Company getAndVerifyCompany(
        Long companyId,
        RecruiterProfile recruiter) {

        if (companyId == null) {
            throw new BadRequestException(
                "Company ID is required"
            );
        }

        Company company = companyRepository
            .findById(companyId)
            .filter(existingCompany ->
                Boolean.TRUE.equals(
                    existingCompany.getIsActive()
                )
            )
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Active company not found"
                )
            );

        if (recruiter.getCompany() == null ||
            !recruiter.getCompany()
                .getId()
                .equals(company.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                "Recruiter is not associated with this company"
            );
        }

        return company;
    }

    private void verifyJobOwnership(
        Job job,
        RecruiterProfile recruiter) {

        if (job.getRecruiter() == null ||
            !job.getRecruiter()
                .getId()
                .equals(recruiter.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                "You are not authorized to manage this job"
            );
        }
    }

    private void validateSalaryRange(
        java.math.BigDecimal salaryMin,
        java.math.BigDecimal salaryMax) {

        if (salaryMin != null &&
            salaryMax != null &&
            salaryMin.compareTo(salaryMax) > 0) {

            throw new BadRequestException(
                "Minimum salary cannot exceed maximum salary"
            );
        }
    }

    private void validateApplicationDeadline(
        LocalDate applicationDeadline) {

        if (applicationDeadline == null) {
            throw new BadRequestException(
                "Application deadline is required"
            );
        }

        if (applicationDeadline.isBefore(
            LocalDate.now()
        )) {
            throw new BadRequestException(
                "Application deadline cannot be in the past"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobSearchResponse> searchOpenJobs(
        JobSearchRequest request) {

        int page =
            request.page() == null
                ? 0
                : request.page();

        int size =
            request.size() == null
                ? 10
                : Math.min(request.size(), 50);

        if (request.minSalary() != null
            && request.maxSalary() != null
            && request.minSalary()
            .compareTo(request.maxSalary()) > 0) {

            throw new BadRequestException(
                "Minimum salary cannot be greater than maximum salary"
            );
        }

        Specification<Job> specification =
            Specification
                .where(JobSpecification.hasOpenStatus())
                .and(
                    JobSpecification.keywordContains(
                        request.keyword()
                    )
                )
                .and(
                    JobSpecification.locationContains(
                        request.location()
                    )
                )
                .and(
                    JobSpecification.hasCompany(
                        request.companyId()
                    )
                )
                .and(
                    JobSpecification.hasEmploymentType(
                        request.employmentType()
                    )
                )
                .and(
                    JobSpecification.hasExperienceLevel(
                        request.experienceLevel()
                    )
                )
                .and(
                    JobSpecification.salaryAtLeast(
                        request.minSalary()
                    )
                )
                .and(
                    JobSpecification.salaryAtMost(
                        request.maxSalary()
                    )
                );

        Pageable pageable =
            PageRequest.of(
                page,
                size,
                Sort.by(
                    Sort.Direction.DESC,
                    "createdAt"
                )
            );

        return jobRepository
            .findAll(specification, pageable)
            .map(this::toSearchResponse);
    }

    private JobSearchResponse toSearchResponse(Job job) {

        return new JobSearchResponse(
            job.getId(),
            job.getCompany().getId(),
            job.getCompany().getName(),
            job.getRecruiter().getId(),
            job.getTitle(),
            job.getDescription(),
            job.getLocation(),
            job.getEmploymentType(),
            job.getExperienceLevel(),
            job.getSalaryMin(),
            job.getSalaryMax(),
            job.getOpenings(),
            job.getApplicationDeadline(),
            job.getStatus(),
            job.getCreatedAt(),
            job.getUpdatedAt()
        );
    }
}
