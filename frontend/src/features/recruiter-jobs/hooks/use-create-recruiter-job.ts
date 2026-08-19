import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { createRecruiterJob } from "@/features/recruiter-jobs/api/recruiter-job-api";

import {
    RECRUITER_JOBS_QUERY_KEY,
} from "@/features/recruiter-jobs/hooks/use-recruiter-jobs";

import type {
    CreateRecruiterJobRequest,
} from "@/features/recruiter-jobs/types/recruiter-job";

export function useCreateRecruiterJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: CreateRecruiterJobRequest,
        ) => createRecruiterJob(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: RECRUITER_JOBS_QUERY_KEY,
            });
        },
    });
}
