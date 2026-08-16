import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { setPrimaryResume } from "@/features/resume/api/resume-api";
import { RESUMES_QUERY_KEY } from "@/features/resume/hooks/use-resumes";

export function useSetPrimaryResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (resumeId: number) =>
            setPrimaryResume(resumeId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: RESUMES_QUERY_KEY,
            });
        },
    });
}
