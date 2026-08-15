import { useQuery } from "@tanstack/react-query";

import { getSkills } from "@/features/skills/api/skill-api";

export const SKILLS_QUERY_KEY = ["skills"];

export function useSkills() {
    return useQuery({
        queryKey: SKILLS_QUERY_KEY,
        queryFn: getSkills,
    });
}
