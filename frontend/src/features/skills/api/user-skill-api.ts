import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

import type {
    AddUserSkillRequest,
    UserSkill,
} from "@/features/skills/types/skill";

export async function getUserSkills(): Promise<
    ApiResponse<UserSkill[]>
> {
    return apiClient<UserSkill[]>("/v1/users/skills", {
        method: "GET",
    });
}

export async function addUserSkill(
    request: AddUserSkillRequest,
): Promise<ApiResponse<UserSkill>> {
    return apiClient<UserSkill>("/v1/users/skills", {
        method: "POST",
        body: request,
    });
}

export async function updateUserSkill(
    userSkillId: number,
    request: AddUserSkillRequest,
): Promise<ApiResponse<UserSkill>> {
    return apiClient<UserSkill>(
        `/v1/users/skills/${userSkillId}`,
        {
            method: "PUT",
            body: request,
        },
    );
}

export async function deleteUserSkill(
    userSkillId: number,
): Promise<ApiResponse<void>> {
    return apiClient<void>(
        `/v1/users/skills/${userSkillId}`,
        {
            method: "DELETE",
        },
    );
}
