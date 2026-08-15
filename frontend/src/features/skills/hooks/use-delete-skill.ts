import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteUserSkill } from "@/features/skills/api/user-skill-api";
import { USER_SKILLS_QUERY_KEY } from "@/features/skills/hooks/use-user-skills";

export function useDeleteSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userSkillId: number) =>
            deleteUserSkill(userSkillId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: USER_SKILLS_QUERY_KEY,
            });
        },
    });
}
