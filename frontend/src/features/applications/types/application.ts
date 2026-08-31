export const APPLICATION_STATUSES = [
    "APPLIED",
    "SHORTLISTED",
    "REJECTED",
    "SELECTED",
] as const;

export type ApplicationStatus =
    (typeof APPLICATION_STATUSES)[number];

export interface JobApplication {
    id: number;
    jobId: number;
    jobTitle: string;
    companyId?: number;
    companyName?: string;
    applicantId: number;
    applicantUsername: string;
    resumeId: number;
    resumeFileName: string;
    resumeFileUrl: string;
    resumeFileType: string;
    resumeFileSize: number;
    coverLetter: string | null;
    status: ApplicationStatus;
    appliedAt: string;
    updatedAt: string;
}

export interface CreateJobApplicationRequest {
    jobId: number;
    resumeId: number;
    coverLetter?: string;
}
