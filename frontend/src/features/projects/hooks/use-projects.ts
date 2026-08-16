import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/features/projects/api/project-api";

export const PROJECTS_QUERY_KEY = ["projects"];

export function useProjects() {
    return useQuery({
        queryKey: PROJECTS_QUERY_KEY,
        queryFn: getProjects,
    });
}
