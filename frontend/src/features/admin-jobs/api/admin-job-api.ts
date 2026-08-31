import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Job, JobStatus } from "@/features/jobs/types/job";

const ADMIN_JOBS_ENDPOINT = "/v1/admin/jobs";

export interface UpdateJobStatusInput {
    status: JobStatus;
}

export async function getAdminJobs(): Promise<ApiResponse<Job[]>> {
    return apiClient<Job[]>(ADMIN_JOBS_ENDPOINT, {
        method: "GET",
    });
}

export async function getAdminJobById(
    jobId: number,
): Promise<ApiResponse<Job>> {
    return apiClient<Job>(`${ADMIN_JOBS_ENDPOINT}/${jobId}`, {
        method: "GET",
    });
}

export async function updateAdminJobStatus(
    jobId: number,
    input: UpdateJobStatusInput,
): Promise<ApiResponse<Job>> {
    return apiClient<Job>(`${ADMIN_JOBS_ENDPOINT}/${jobId}/status`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}
