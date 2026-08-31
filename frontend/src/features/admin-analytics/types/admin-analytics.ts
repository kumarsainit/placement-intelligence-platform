export interface AdminAnalytics {
    // User metrics
    totalStudents: number;
    totalRecruiters: number;
    totalAdmins: number;
    totalSuperAdmins: number;
    totalActiveUsers: number;

    // Company metrics
    totalActiveCompanies: number;

    // Job metrics
    totalJobs: number;
    totalOpenJobs: number;
    totalDraftJobs: number;
    totalClosedJobs: number;

    // Application metrics
    totalApplications: number;
    appliedApplications: number;
    screeningApplications: number;
    shortlistedApplications: number;
    interviewingApplications: number;
    offeredApplications: number;
    rejectedApplications: number;
}
