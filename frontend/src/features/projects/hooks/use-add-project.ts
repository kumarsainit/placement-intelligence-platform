import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { addProject } from "@/features/projects/api/project-api";
import { PROJECTS_QUERY_KEY } from "@/features/projects/hooks/use-projects";

import type { AddProjectRequest } from "@/features/projects/types/project";

export function useAddProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AddProjectRequest) =>
            addProject(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: PROJECTS_QUERY_KEY,
            });
        },
    });
}
