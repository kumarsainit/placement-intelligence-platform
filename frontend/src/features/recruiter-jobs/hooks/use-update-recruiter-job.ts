import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateRecruiterJob } from "@/features/recruiter-jobs/api/recruiter-job-api";

import {
    RECRUITER_JOBS_QUERY_KEY,
} from "@/features/recruiter-jobs/hooks/use-recruiter-jobs";

import {
    RECRUITER_JOB_QUERY_KEY,
} from "@/features/recruiter-jobs/hooks/use-recruiter-job";

import type {
    UpdateRecruiterJobRequest,
} from "@/features/recruiter-jobs/types/recruiter-job";

export function useUpdateRecruiterJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         jobId,
                         request,
                     }: {
            jobId: number;
            request: UpdateRecruiterJobRequest;
        }) =>
            updateRecruiterJob(
                jobId,
                request,
            ),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: RECRUITER_JOBS_QUERY_KEY,
            });

            queryClient.invalidateQueries({
                queryKey: [
                    ...RECRUITER_JOB_QUERY_KEY,
                    variables.jobId,
                ],
            });
        },
    });
}
