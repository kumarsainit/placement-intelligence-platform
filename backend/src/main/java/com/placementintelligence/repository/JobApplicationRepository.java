package com.placementintelligence.repository;

import com.placementintelligence.common.enums.ApplicationStatus;
import com.placementintelligence.entity.Job;
import com.placementintelligence.entity.JobApplication;
import com.placementintelligence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository
    extends JpaRepository<JobApplication, Long> {

    boolean existsByJobAndApplicant(
        Job job,
        User applicant
    );

    Optional<JobApplication> findByJobAndApplicant(
        Job job,
        User applicant
    );

    List<JobApplication> findByApplicantOrderByAppliedAtDesc(
        User applicant
    );

    List<JobApplication> findByJobOrderByAppliedAtDesc(
        Job job
    );

    List<JobApplication> findByJobRecruiterOrderByAppliedAtDesc(
        com.placementintelligence.entity.RecruiterProfile recruiter
    );

    List<JobApplication> findByJobAndStatusOrderByAppliedAtDesc(
        Job job,
        ApplicationStatus status
    );

    Optional<JobApplication> findByIdAndApplicant(
        Long applicationId,
        User applicant
    );

    long countByJob(Job job);

    long countByJobAndStatus(
        Job job,
        ApplicationStatus status
    );

    long countByStatus(ApplicationStatus status);
}
