export const APPLICATION_STATUSES = [
    "APPLIED",
    "SHORTLISTED",
    "REJECTED",
    "SELECTED",
] as const;

export type ApplicationStatus =
    (typeof APPLICATION_STATUSES)[number];

export interface UpdateApplicationStatusRequest {
    status: ApplicationStatus;
}

export interface RecruiterApplication {
    id: number;
    jobId: number;
    jobTitle: string;
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
