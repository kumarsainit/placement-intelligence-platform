import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { applyForJob } from "@/features/applications/api/application-api";
import { APPLICATIONS_QUERY_KEY } from "@/features/applications/hooks/use-applications";

import type { CreateJobApplicationRequest } from "@/features/applications/types/application";

export function useApplyJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: CreateJobApplicationRequest,
        ) => applyForJob(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: APPLICATIONS_QUERY_KEY,
            });
        },
    });
}
