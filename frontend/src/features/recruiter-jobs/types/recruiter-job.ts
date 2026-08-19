import type {
    EmploymentType,
    ExperienceLevel,
    JobStatus,
} from "@/features/jobs/types/job";

export interface RecruiterJob {
    id: number;
    companyId: number;
    companyName: string;
    recruiterProfileId: number;
    userId: number;
    recruiterUsername: string;
    title: string;
    description: string;
    location: string;
    employmentType: EmploymentType;
    experienceLevel: ExperienceLevel;
    salaryMin: number | null;
    salaryMax: number | null;
    openings: number;
    applicationDeadline: string;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRecruiterJobRequest {
    companyId: number;
    title: string;
    description: string;
    location?: string;
    employmentType: EmploymentType;
    experienceLevel: ExperienceLevel;
    salaryMin?: number;
    salaryMax?: number;
    openings: number;
    applicationDeadline: string;
}

export interface UpdateRecruiterJobRequest
    extends CreateRecruiterJobRequest {
    status: JobStatus;
}
