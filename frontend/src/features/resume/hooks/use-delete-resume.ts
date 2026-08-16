import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteResume } from "@/features/resume/api/resume-api";
import { RESUMES_QUERY_KEY } from "@/features/resume/hooks/use-resumes";

export function useDeleteResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (resumeId: number) =>
            deleteResume(resumeId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: RESUMES_QUERY_KEY,
            });
        },
    });
}
