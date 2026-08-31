package com.placementintelligence.dto.response;

public record AdminAnalyticsResponse(

    Long totalStudents,

    Long totalRecruiters,

    Long totalAdmins,

    Long totalSuperAdmins,

    Long totalActiveUsers,

    Long totalActiveCompanies,

    Long totalJobs,

    Long totalOpenJobs,

    Long totalDraftJobs,

    Long totalClosedJobs,

    Long totalApplications,

    Long appliedApplications,

    Long screeningApplications,

    Long shortlistedApplications,

    Long interviewingApplications,

    Long offeredApplications,

    Long rejectedApplications

) {
}
