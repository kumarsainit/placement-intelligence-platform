export interface RecruiterProfile {
    id: number;
    userId: number;
    username: string;
    companyId: number;
    companyName: string;
    designation: string | null;
    department: string | null;
    employeeId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRecruiterProfileRequest {
    companyId: number;
    designation?: string;
    department?: string;
    employeeId?: string;
}

export type UpdateRecruiterProfileRequest =
    CreateRecruiterProfileRequest;
