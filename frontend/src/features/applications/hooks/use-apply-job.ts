import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { applyForJob } from "@/features/applications/api/application-api";
import { APPLICATIONS_QUERY_KEY } from "@/features/applications/hooks/use-applications";
import { JOB_QUERY_KEY } from "@/features/jobs/hooks/use-job";

import type { CreateJobApplicationRequest } from "@/features/applications/types/application";

export function useApplyJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: CreateJobApplicationRequest,
        ) => applyForJob(request),

        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: APPLICATIONS_QUERY_KEY,
            });

            if (variables?.jobId) {
                queryClient.invalidateQueries({
                    queryKey: [...JOB_QUERY_KEY, variables.jobId],
                });
            }
        },
    });
}
