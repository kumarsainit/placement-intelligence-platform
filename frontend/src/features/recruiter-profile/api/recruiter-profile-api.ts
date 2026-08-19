import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";

import type {
    CreateRecruiterProfileRequest,
    RecruiterProfile,
    UpdateRecruiterProfileRequest,
} from "@/features/recruiter-profile/types/recruiter-profile";

const RECRUITER_PROFILE_ENDPOINT =
    "/v1/users/recruiter-profile";

export async function getRecruiterProfile(): Promise<
    ApiResponse<RecruiterProfile>
> {
    return apiClient<RecruiterProfile>(
        RECRUITER_PROFILE_ENDPOINT,
        {
            method: "GET",
        },
    );
}

export async function createRecruiterProfile(
    request: CreateRecruiterProfileRequest,
): Promise<ApiResponse<RecruiterProfile>> {
    return apiClient<RecruiterProfile>(
        RECRUITER_PROFILE_ENDPOINT,
        {
            method: "POST",
            body: request,
        },
    );
}

export async function updateRecruiterProfile(
    request: UpdateRecruiterProfileRequest,
): Promise<ApiResponse<RecruiterProfile>> {
    return apiClient<RecruiterProfile>(
        RECRUITER_PROFILE_ENDPOINT,
        {
            method: "PUT",
            body: request,
        },
    );
}
