import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteProject } from "@/features/projects/api/project-api";
import { PROJECTS_QUERY_KEY } from "@/features/projects/hooks/use-projects";

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectId: number) =>
            deleteProject(projectId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: PROJECTS_QUERY_KEY,
            });
        },
    });
}
