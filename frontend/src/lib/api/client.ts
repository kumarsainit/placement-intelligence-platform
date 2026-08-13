import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/lib/api/errors";
import type { ApiResponse } from "@/types/api";

interface RequestOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    skipAuth?: boolean;
}

export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<ApiResponse<T>> {
    const { skipAuth = false, body, ...requestOptions } = options;

    const accessToken = useAuthStore.getState().accessToken;

    const headers = new Headers(requestOptions.headers);

    if (body !== undefined) {
        headers.set("Content-Type", "application/json");
    }

    if (accessToken && !skipAuth) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(`${env.apiBaseUrl}${endpoint}`, {
        ...requestOptions,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        if (!response.ok) {
            throw new ApiError(
                "The server returned an unexpected response.",
                response.status,
            );
        }

        throw new ApiError(
            "The server returned an invalid response.",
            response.status,
        );
    }

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new ApiError(
            result.message || "An unexpected API error occurred.",
            response.status,
            result.path,
        );
    }

    return result;
}
