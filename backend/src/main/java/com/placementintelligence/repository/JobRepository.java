package com.placementintelligence.repository;

import com.placementintelligence.entity.Job;
import com.placementintelligence.entity.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatusOrderByCreatedAtDesc(
        com.placementintelligence.common.enums.JobStatus status
    );

    List<Job> findByRecruiterOrderByCreatedAtDesc(
        RecruiterProfile recruiter
    );

    Optional<Job> findByIdAndRecruiter(
        Long jobId,
        RecruiterProfile recruiter
    );
}
