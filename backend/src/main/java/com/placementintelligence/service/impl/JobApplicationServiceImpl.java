package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.ApplicationStatus;
import com.placementintelligence.common.enums.JobStatus;
import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.request.CreateJobApplicationRequest;
import com.placementintelligence.dto.request.UpdateApplicationStatusRequest;
import com.placementintelligence.dto.response.JobApplicationResponse;
import com.placementintelligence.entity.Job;
import com.placementintelligence.entity.JobApplication;
import com.placementintelligence.entity.RecruiterProfile;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserResume;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.ResourceAlreadyExistsException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.UnauthorizedException;
import com.placementintelligence.mapper.JobApplicationMapper;
import com.placementintelligence.repository.JobApplicationRepository;
import com.placementintelligence.repository.JobRepository;
import com.placementintelligence.repository.RecruiterProfileRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.repository.UserResumeRepository;
import com.placementintelligence.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl
    implements JobApplicationService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final UserResumeRepository resumeRepository;
    private final JobApplicationRepository applicationRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobApplicationMapper mapper;

    @Override
    @Transactional
    public JobApplicationResponse applyForJob(
        String username,
        CreateJobApplicationRequest request) {

        User applicant = getActiveApplicant(username);

        Job job = jobRepository.findById(request.jobId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Job not found"
                )
            );

        validateJobForApplication(job);

        UserResume resume = resumeRepository
            .findById(request.resumeId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Resume not found"
                )
            );

        verifyResumeOwnership(resume, applicant);

        if (applicationRepository.existsByJobAndApplicant(
            job,
            applicant
        )) {
            throw new ResourceAlreadyExistsException(
                "Application already exists for this job"
            );
        }

        JobApplication application = JobApplication.builder()
            .job(job)
            .applicant(applicant)
            .resume(resume)
            .resumeFileName(resume.getFileName())
            .resumeFileUrl(resume.getFileUrl())
            .resumeFileType(resume.getFileType())
            .resumeFileSize(resume.getFileSize())
            .coverLetter(request.coverLetter())
            .status(ApplicationStatus.APPLIED)
            .appliedAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

        application = applicationRepository.save(application);

        return mapper.toResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getMyApplications(
        String username) {

        User applicant = getActiveApplicant(username);

        return applicationRepository
            .findByApplicantOrderByAppliedAtDesc(applicant)
            .stream()
            .map(mapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JobApplicationResponse getMyApplication(
        String username,
        Long applicationId) {

        User applicant = getActiveApplicant(username);

        JobApplication application =
            applicationRepository
                .findByIdAndApplicant(
                    applicationId,
                    applicant
                )
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Application not found"
                    )
                );

        return mapper.toResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getJobApplications(
        String username,
        Long jobId) {

        RecruiterProfile recruiter =
            getActiveRecruiterProfile(username);

        Job job = jobRepository
            .findByIdAndRecruiter(jobId, recruiter)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Job not found"
                )
            );

        return applicationRepository
            .findByJobOrderByAppliedAtDesc(job)
            .stream()
            .map(mapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JobApplicationResponse getApplicationByIdForRecruiter(
        String username,
        Long applicationId) {

        RecruiterProfile recruiter =
            getActiveRecruiterProfile(username);

        JobApplication application =
            applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Application not found"
                    )
                );

        verifyRecruiterJobOwnership(
            application.getJob(),
            recruiter
        );

        return mapper.toResponse(application);
    }

    @Override
    @Transactional
    public JobApplicationResponse updateApplicationStatus(
        String username,
        Long applicationId,
        UpdateApplicationStatusRequest request) {

        RecruiterProfile recruiter =
            getActiveRecruiterProfile(username);

        JobApplication application =
            applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Application not found"
                    )
                );

        verifyRecruiterJobOwnership(
            application.getJob(),
            recruiter
        );

        ApplicationStatus currentStatus =
            application.getStatus();

        ApplicationStatus newStatus =
            request.status();

        validateStatusTransition(
            currentStatus,
            newStatus
        );

        application.setStatus(newStatus);
        application.setUpdatedAt(Instant.now());

        application =
            applicationRepository.save(application);

        return mapper.toResponse(application);
    }

    private User getActiveApplicant(
        String username) {

        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User not found"
                )
            );

        if (user.getRole() != UserRole.USER) {
            throw new UnauthorizedException(
                "Only users can apply for jobs"
            );
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException(
                "User account is inactive"
            );
        }

        return user;
    }

    private RecruiterProfile getActiveRecruiterProfile(
        String username) {

        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User not found"
                )
            );

        if (user.getRole() != UserRole.RECRUITER) {
            throw new UnauthorizedException(
                "Only recruiters can manage job applications"
            );
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException(
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

    private void validateJobForApplication(
        Job job) {

        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException(
                "Applications are allowed only for open jobs"
            );
        }

        if (job.getApplicationDeadline()
            .isBefore(LocalDate.now())) {

            throw new BadRequestException(
                "Application deadline has passed"
            );
        }

        if (job.getOpenings() == null ||
            job.getOpenings() <= 0) {

            throw new BadRequestException(
                "Job has no available openings"
            );
        }
    }

    private void verifyResumeOwnership(
        UserResume resume,
        User applicant) {

        if (!resume.getUser().getId()
            .equals(applicant.getId())) {

            throw new ResourceNotFoundException(
                "Resume not found"
            );
        }
    }

    private void verifyRecruiterJobOwnership(
        Job job,
        RecruiterProfile recruiter) {

        if (!job.getRecruiter().getId()
            .equals(recruiter.getId())) {

            throw new UnauthorizedException(
                "You are not authorized to manage this job application"
            );
        }
    }

    private void validateStatusTransition(
        ApplicationStatus currentStatus,
        ApplicationStatus newStatus) {

        if (currentStatus == newStatus) {
            throw new BadRequestException(
                "Application is already in this status"
            );
        }

        boolean validTransition = switch (currentStatus) {

            case APPLIED ->
                newStatus == ApplicationStatus.SHORTLISTED ||
                    newStatus == ApplicationStatus.REJECTED;

            case SHORTLISTED ->
                newStatus == ApplicationStatus.SELECTED ||
                    newStatus == ApplicationStatus.REJECTED;

            case REJECTED,
                 SELECTED ->
                false;
        };

        if (!validTransition) {
            throw new BadRequestException(
                "Invalid application status transition from "
                    + currentStatus
                    + " to "
                    + newStatus
            );
        }
    }
}
