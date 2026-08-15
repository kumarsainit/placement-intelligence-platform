import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

import type {
    UpdateProfileRequest,
    UserProfile,
} from "@/features/profile/types/profile";

export async function getProfile(): Promise<
    ApiResponse<UserProfile>
> {
    return apiClient<UserProfile>("/v1/users/profile", {
        method: "GET",
    });
}

export async function updateProfile(
    request: UpdateProfileRequest,
): Promise<ApiResponse<UserProfile>> {
    return apiClient<UserProfile>("/v1/users/profile", {
        method: "PUT",
        body: request,
    });
}
