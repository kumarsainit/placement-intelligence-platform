import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

import type { Skill } from "@/features/skills/types/skill";

export async function getSkills(): Promise<
    ApiResponse<Skill[]>
> {
    return apiClient<Skill[]>("/v1/skills", {
        method: "GET",
    });
}
