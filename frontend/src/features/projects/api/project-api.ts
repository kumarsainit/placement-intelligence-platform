import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

import type {
    AddProjectRequest,
    Project,
} from "@/features/projects/types/project";

export async function getProjects(): Promise<
    ApiResponse<Project[]>
> {
    return apiClient<Project[]>("/v1/users/projects", {
        method: "GET",
    });
}

export async function getProject(
    projectId: number,
): Promise<ApiResponse<Project>> {
    return apiClient<Project>(
        `/v1/users/projects/${projectId}`,
        {
            method: "GET",
        },
    );
}

export async function addProject(
    request: AddProjectRequest,
): Promise<ApiResponse<Project>> {
    return apiClient<Project>("/v1/users/projects", {
        method: "POST",
        body: request,
    });
}

export async function updateProject(
    projectId: number,
    request: AddProjectRequest,
): Promise<ApiResponse<Project>> {
    return apiClient<Project>(
        `/v1/users/projects/${projectId}`,
        {
            method: "PUT",
            body: request,
        },
    );
}

export async function deleteProject(
    projectId: number,
): Promise<ApiResponse<void>> {
    return apiClient<void>(
        `/v1/users/projects/${projectId}`,
        {
            method: "DELETE",
        },
    );
}
