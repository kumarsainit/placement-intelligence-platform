import type { Job } from "@/features/jobs/types/job";
import type { ApplicationStatus } from "@/features/applications/types/application";

export type MatchGrade =
    | "EXCELLENT_MATCH"
    | "STRONG_MATCH"
    | "GOOD_MATCH"
    | "POTENTIAL_FIT";

export interface JobRecommendation {
    job: Job;
    matchScore: number;
    matchGrade: MatchGrade;
    matchedSkills: string[];
    missingSkills: string[];
    isEligible: boolean;
    hasApplied: boolean;
    applicationStatus: ApplicationStatus | null;
}

export interface StudentPlacementInsights {
    profileCompleteness: number;
    totalSkills: number;
    totalProjects: number;
    hasPrimaryResume: boolean;
    eligibleJobsCount: number;
    matchedJobsCount: number;
    topInDemandSkills: string[];
}
