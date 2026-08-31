import { apiClient } from "@/lib/api/client";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/lib/api/errors";

import type { ApiResponse } from "@/types/api";

import type {
    RecruiterApplication,
    UpdateApplicationStatusRequest,
} from "@/features/recruiter-applications/types/recruiter-application";

const RECRUITER_APPLICATIONS_ENDPOINT =
    "/v1/recruiter/applications";

export async function getAllRecruiterApplications(): Promise<
    ApiResponse<RecruiterApplication[]>
> {
    return apiClient<RecruiterApplication[]>(
        RECRUITER_APPLICATIONS_ENDPOINT,
        {
            method: "GET",
        },
    );
}

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

export async function getRecruiterApplicationResumeFile(
    applicationId: number,
): Promise<Blob> {
    const accessToken = useAuthStore.getState().accessToken;

    const headers = new Headers();

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(
        `${env.apiBaseUrl}${RECRUITER_APPLICATIONS_ENDPOINT}/${applicationId}/resume`,
        {
            method: "GET",
            headers,
        },
    );

    if (!response.ok) {
        throw new ApiError(
            "Unable to retrieve application resume file.",
            response.status,
        );
    }

    return response.blob();
}
