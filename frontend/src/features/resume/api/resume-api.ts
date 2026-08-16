import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/lib/api/errors";
import type { ApiResponse } from "@/types/api";

import type { Resume } from "@/features/resume/types/resume";

async function multipartRequest<T>(
    endpoint: string,
    formData: FormData,
): Promise<ApiResponse<T>> {
    const accessToken = useAuthStore.getState().accessToken;

    const headers = new Headers();

    if (accessToken) {
        headers.set(
            "Authorization",
            `Bearer ${accessToken}`,
        );
    }

    const response = await fetch(
        `${env.apiBaseUrl}${endpoint}`,
        {
            method: "POST",
            headers,
            body: formData,
        },
    );

    const contentType =
        response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        throw new ApiError(
            "The server returned an unexpected response.",
            response.status,
        );
    }

    const result =
        (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new ApiError(
            result.message ||
                "An unexpected API error occurred.",
            response.status,
            result.path,
        );
    }

    return result;
}

async function authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<ApiResponse<T>> {
    const accessToken =
        useAuthStore.getState().accessToken;

    const headers = new Headers(options.headers);

    if (accessToken) {
        headers.set(
            "Authorization",
            `Bearer ${accessToken}`,
        );
    }

    const response = await fetch(
        `${env.apiBaseUrl}${endpoint}`,
        {
            ...options,
            headers,
        },
    );

    const contentType =
        response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        throw new ApiError(
            "The server returned an unexpected response.",
            response.status,
        );
    }

    const result =
        (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new ApiError(
            result.message ||
                "An unexpected API error occurred.",
            response.status,
            result.path,
        );
    }

    return result;
}

export async function getResumes(): Promise<
    ApiResponse<Resume[]>
> {
    return authenticatedRequest<Resume[]>(
        "/v1/users/resumes",
        {
            method: "GET",
        },
    );
}

export async function uploadResume(
    file: File,
    isPrimary = false,
): Promise<ApiResponse<Resume>> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "isPrimary",
        String(isPrimary),
    );

    return multipartRequest<Resume>(
        "/v1/users/resumes",
        formData,
    );
}

export async function getResume(
    resumeId: number,
): Promise<ApiResponse<Resume>> {
    return authenticatedRequest<Resume>(
        `/v1/users/resumes/${resumeId}`,
        {
            method: "GET",
        },
    );
}

export async function setPrimaryResume(
    resumeId: number,
): Promise<ApiResponse<Resume>> {
    return authenticatedRequest<Resume>(
        `/v1/users/resumes/${resumeId}/primary`,
        {
            method: "PUT",
        },
    );
}

export async function deleteResume(
    resumeId: number,
): Promise<ApiResponse<void>> {
    return authenticatedRequest<void>(
        `/v1/users/resumes/${resumeId}`,
        {
            method: "DELETE",
        },
    );
}

export async function getResumeFile(
    resumeId: number,
): Promise<Blob> {
    const accessToken =
        useAuthStore.getState().accessToken;

    const headers = new Headers();

    if (accessToken) {
        headers.set(
            "Authorization",
            `Bearer ${accessToken}`,
        );
    }

    const response = await fetch(
        `${env.apiBaseUrl}/v1/users/resumes/${resumeId}/file`,
        {
            method: "GET",
            headers,
        },
    );

    if (!response.ok) {
        throw new ApiError(
            "Unable to retrieve resume file.",
            response.status,
        );
    }

    return response.blob();
}
