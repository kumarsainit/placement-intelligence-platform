import { useQuery } from "@tanstack/react-query";

import { getJob } from "@/features/jobs/api/job-api";

export const JOB_QUERY_KEY = ["job"];

export function useJob(jobId: number) {
    return useQuery({
        queryKey: [...JOB_QUERY_KEY, jobId],
        queryFn: () => getJob(jobId),
        enabled: Number.isInteger(jobId) && jobId > 0,
    });
}
