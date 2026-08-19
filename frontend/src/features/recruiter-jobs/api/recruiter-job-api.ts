import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";

import type {
    CreateRecruiterJobRequest,
    RecruiterJob,
    UpdateRecruiterJobRequest,
} from "@/features/recruiter-jobs/types/recruiter-job";

const JOBS_ENDPOINT = "/v1/jobs";

export async function createRecruiterJob(
    request: CreateRecruiterJobRequest,
): Promise<ApiResponse<RecruiterJob>> {
    return apiClient<RecruiterJob>(
        JOBS_ENDPOINT,
        {
            method: "POST",
            body: request,
        },
    );
}

export async function getRecruiterJobs(): Promise<
    ApiResponse<RecruiterJob[]>
> {
    return apiClient<RecruiterJob[]>(
        `${JOBS_ENDPOINT}/recruiter`,
        {
            method: "GET",
        },
    );
}

export async function getRecruiterJob(
    jobId: number,
): Promise<ApiResponse<RecruiterJob>> {
    return apiClient<RecruiterJob>(
        `${JOBS_ENDPOINT}/${jobId}`,
        {
            method: "GET",
        },
    );
}

export async function updateRecruiterJob(
    jobId: number,
    request: UpdateRecruiterJobRequest,
): Promise<ApiResponse<RecruiterJob>> {
    return apiClient<RecruiterJob>(
        `${JOBS_ENDPOINT}/${jobId}`,
        {
            method: "PUT",
            body: request,
        },
    );
}

export async function deleteRecruiterJob(
    jobId: number,
): Promise<ApiResponse<void>> {
    return apiClient<void>(
        `${JOBS_ENDPOINT}/${jobId}`,
        {
            method: "DELETE",
        },
    );
}
