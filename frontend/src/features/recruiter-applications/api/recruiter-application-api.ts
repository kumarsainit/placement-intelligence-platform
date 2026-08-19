import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";

import type {
    RecruiterApplication,
    UpdateApplicationStatusRequest,
} from "@/features/recruiter-applications/types/recruiter-application";

const RECRUITER_APPLICATIONS_ENDPOINT =
    "/v1/recruiter/applications";

export async function getRecruiterJobApplications(
    jobId: number,
): Promise<
    ApiResponse<RecruiterApplication[]>
> {
    return apiClient<RecruiterApplication[]>(
        `/v1/recruiter/jobs/${jobId}/applications`,
        {
            method: "GET",
        },
    );
}

export async function getRecruiterApplication(
    applicationId: number,
): Promise<
    ApiResponse<RecruiterApplication>
> {
    return apiClient<RecruiterApplication>(
        `${RECRUITER_APPLICATIONS_ENDPOINT}/${applicationId}`,
        {
            method: "GET",
        },
    );
}

export async function updateApplicationStatus(
    applicationId: number,
    request: UpdateApplicationStatusRequest,
): Promise<
    ApiResponse<RecruiterApplication>
> {
    return apiClient<RecruiterApplication>(
        `${RECRUITER_APPLICATIONS_ENDPOINT}/${applicationId}/status`,
        {
            method: "PUT",
            body: request,
        },
    );
}
