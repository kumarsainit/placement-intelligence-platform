import { useQuery } from "@tanstack/react-query";

import { getRecruiterJob } from "@/features/recruiter-jobs/api/recruiter-job-api";

export const RECRUITER_JOB_QUERY_KEY = [
    "recruiter-job",
];

export function useRecruiterJob(jobId: number) {
    return useQuery({
        queryKey: [
            ...RECRUITER_JOB_QUERY_KEY,
            jobId,
        ],
        queryFn: () => getRecruiterJob(jobId),
        enabled:
            Number.isInteger(jobId) &&
            jobId > 0,
    });
}
