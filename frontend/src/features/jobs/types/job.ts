export const EMPLOYMENT_TYPES = [
    "FULL_TIME",
    "PART_TIME",
    "INTERNSHIP",
    "CONTRACT",
    "TEMPORARY",
] as const;

export type EmploymentType =
    (typeof EMPLOYMENT_TYPES)[number];

export const EXPERIENCE_LEVELS = [
    "ENTRY_LEVEL",
    "MID_LEVEL",
    "SENIOR_LEVEL",
    "LEAD",
] as const;

export type ExperienceLevel =
    (typeof EXPERIENCE_LEVELS)[number];

export type JobStatus =
    | "DRAFT"
    | "OPEN"
    | "CLOSED";

export interface Job {
    id: number;
    companyId: number;
    companyName: string;
    recruiterProfileId: number;
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

export interface JobSearchParams {
    keyword?: string;
    location?: string;
    companyId?: number;
    employmentType?: EmploymentType;
    experienceLevel?: ExperienceLevel;
    minSalary?: number;
    maxSalary?: number;
    page: number;
    size: number;
}

export interface Company {
    id: number;
    name: string;
    website: string | null;
    industry: string | null;
    description: string | null;
    location: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}
