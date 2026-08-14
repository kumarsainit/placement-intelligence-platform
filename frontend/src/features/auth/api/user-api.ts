import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

export interface CurrentUserResponse {
    username: string;
    authenticated: boolean;
}

export async function getCurrentUser(): Promise<
    ApiResponse<CurrentUserResponse>
> {
    return apiClient<CurrentUserResponse>("/v1/users/me", {
        method: "GET",
    });
}
