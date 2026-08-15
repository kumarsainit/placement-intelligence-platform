import { useQuery } from "@tanstack/react-query";

import { getUserSkills } from "@/features/skills/api/user-skill-api";

export const USER_SKILLS_QUERY_KEY = ["user-skills"];

export function useUserSkills() {
    return useQuery({
        queryKey: USER_SKILLS_QUERY_KEY,
        queryFn: getUserSkills,
    });
}
