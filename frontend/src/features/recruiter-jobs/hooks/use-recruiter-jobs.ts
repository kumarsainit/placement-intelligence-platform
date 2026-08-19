import { useQuery } from "@tanstack/react-query";

import { getRecruiterJobs } from "@/features/recruiter-jobs/api/recruiter-job-api";

export const RECRUITER_JOBS_QUERY_KEY = [
    "recruiter-jobs",
];

export function useRecruiterJobs() {
    return useQuery({
        queryKey: RECRUITER_JOBS_QUERY_KEY,
        queryFn: getRecruiterJobs,
    });
}
