import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteRecruiterJob } from "@/features/recruiter-jobs/api/recruiter-job-api";

import {
    RECRUITER_JOBS_QUERY_KEY,
} from "@/features/recruiter-jobs/hooks/use-recruiter-jobs";

import {
    RECRUITER_JOB_QUERY_KEY,
} from "@/features/recruiter-jobs/hooks/use-recruiter-job";

export function useDeleteRecruiterJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            jobId: number,
        ) => deleteRecruiterJob(jobId),

        onSuccess: (_, jobId) => {
            queryClient.invalidateQueries({
                queryKey: RECRUITER_JOBS_QUERY_KEY,
            });

            queryClient.removeQueries({
                queryKey: [
                    ...RECRUITER_JOB_QUERY_KEY,
                    jobId,
                ],
            });

            queryClient.invalidateQueries({
                queryKey: ["recruiter-dashboard"],
            });

            queryClient.invalidateQueries({
                queryKey: ["jobs"],
            });
        },
    });
}
