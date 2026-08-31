package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.ApplicationStatus;
import com.placementintelligence.common.enums.JobStatus;
import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.response.AdminAnalyticsResponse;
import com.placementintelligence.entity.User;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.repository.CompanyRepository;
import com.placementintelligence.repository.JobApplicationRepository;
import com.placementintelligence.repository.JobRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getOverview(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new AccessDeniedException("User account is inactive");
        }

        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Only administrators can access administrative analytics");
        }

        // 1. User metrics
        long totalStudents = userRepository.countByRole(UserRole.USER);
        long totalRecruiters = userRepository.countByRole(UserRole.RECRUITER);
        long totalAdmins = userRepository.countByRole(UserRole.ADMIN);
        long totalSuperAdmins = userRepository.countByRole(UserRole.SUPER_ADMIN);
        long totalActiveUsers = userRepository.countByIsActiveTrue();

        // 2. Company metrics
        long totalActiveCompanies = companyRepository.countByIsActiveTrue();

        // 3. Job metrics
        long totalOpenJobs = jobRepository.countByStatus(JobStatus.OPEN);
        long totalDraftJobs = jobRepository.countByStatus(JobStatus.DRAFT);
        long totalClosedJobs = jobRepository.countByStatus(JobStatus.CLOSED);
        long totalJobs = totalOpenJobs + totalDraftJobs + totalClosedJobs;

        // 4. Application metrics
        long appliedApplications = jobApplicationRepository.countByStatus(ApplicationStatus.APPLIED);
        long screeningApplications = 0L;
        long shortlistedApplications = jobApplicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);
        long interviewingApplications = 0L;
        long offeredApplications = jobApplicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long rejectedApplications = jobApplicationRepository.countByStatus(ApplicationStatus.REJECTED);
        long totalApplications = appliedApplications + screeningApplications + shortlistedApplications
            + interviewingApplications + offeredApplications + rejectedApplications;

        return new AdminAnalyticsResponse(
            totalStudents,
            totalRecruiters,
            totalAdmins,
            totalSuperAdmins,
            totalActiveUsers,
            totalActiveCompanies,
            totalJobs,
            totalOpenJobs,
            totalDraftJobs,
            totalClosedJobs,
            totalApplications,
            appliedApplications,
            screeningApplications,
            shortlistedApplications,
            interviewingApplications,
            offeredApplications,
            rejectedApplications
        );
    }
}
