import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

import type {
    AddUserEducationRequest,
    UserEducation,
} from "@/features/education/types/education";

export async function getEducations(): Promise<
    ApiResponse<UserEducation[]>
> {
    return apiClient<UserEducation[]>(
        "/v1/users/education",
        {
            method: "GET",
        },
    );
}

export async function getEducation(
    id: number,
): Promise<ApiResponse<UserEducation>> {
    return apiClient<UserEducation>(
        `/v1/users/education/${id}`,
        {
            method: "GET",
        },
    );
}

export async function addEducation(
    request: AddUserEducationRequest,
): Promise<ApiResponse<UserEducation>> {
    return apiClient<UserEducation>(
        "/v1/users/education",
        {
            method: "POST",
            body: request,
        },
    );
}

export async function updateEducation(
    id: number,
    request: AddUserEducationRequest,
): Promise<ApiResponse<UserEducation>> {
    return apiClient<UserEducation>(
        `/v1/users/education/${id}`,
        {
            method: "PUT",
            body: request,
        },
    );
}

export async function deleteEducation(
    id: number,
): Promise<ApiResponse<void>> {
    return apiClient<void>(
        `/v1/users/education/${id}`,
        {
            method: "DELETE",
        },
    );
}
