import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";

import type {
    CreateJobApplicationRequest,
    JobApplication,
} from "@/features/applications/types/application";

export async function getApplications(): Promise<
    ApiResponse<JobApplication[]>
> {
    return apiClient<JobApplication[]>(
        "/v1/users/applications",
        {
            method: "GET",
        },
    );
}

export async function getApplication(
    applicationId: number,
): Promise<ApiResponse<JobApplication>> {
    return apiClient<JobApplication>(
        `/v1/users/applications/${applicationId}`,
        {
            method: "GET",
        },
    );
}

export async function applyForJob(
    request: CreateJobApplicationRequest,
): Promise<ApiResponse<JobApplication>> {
    return apiClient<JobApplication>(
        "/v1/users/applications",
        {
            method: "POST",
            body: request,
        },
    );
}
