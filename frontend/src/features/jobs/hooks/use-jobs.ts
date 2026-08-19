import { useQuery } from "@tanstack/react-query";

import { searchJobs } from "@/features/jobs/api/job-api";

import type { JobSearchParams } from "@/features/jobs/types/job";

export const JOBS_QUERY_KEY = ["jobs"];

export function useJobs(
    params: JobSearchParams,
) {
    return useQuery({
        queryKey: [...JOBS_QUERY_KEY, params],
        queryFn: () => searchJobs(params),
    });
}
