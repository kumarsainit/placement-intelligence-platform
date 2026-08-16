import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateProject } from "@/features/projects/api/project-api";
import { PROJECTS_QUERY_KEY } from "@/features/projects/hooks/use-projects";

import type { AddProjectRequest } from "@/features/projects/types/project";

interface UpdateProjectVariables {
    projectId: number;
    request: AddProjectRequest;
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            projectId,
            request,
        }: UpdateProjectVariables) =>
            updateProject(projectId, request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: PROJECTS_QUERY_KEY,
            });
        },
    });
}
