import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { addUserSkill } from "@/features/skills/api/user-skill-api";
import { USER_SKILLS_QUERY_KEY } from "@/features/skills/hooks/use-user-skills";

import type { AddUserSkillRequest } from "@/features/skills/types/skill";

export function useAddSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AddUserSkillRequest) =>
            addUserSkill(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: USER_SKILLS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
                queryKey: ["recommendations"],
            });
        },
    });
}
