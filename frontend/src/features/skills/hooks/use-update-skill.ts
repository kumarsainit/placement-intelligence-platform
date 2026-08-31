import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateUserSkill } from "@/features/skills/api/user-skill-api";
import { USER_SKILLS_QUERY_KEY } from "@/features/skills/hooks/use-user-skills";

import type { AddUserSkillRequest } from "@/features/skills/types/skill";

interface UpdateSkillVariables {
    userSkillId: number;
    request: AddUserSkillRequest;
}

export function useUpdateSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userSkillId,
            request,
        }: UpdateSkillVariables) =>
            updateUserSkill(userSkillId, request),

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
