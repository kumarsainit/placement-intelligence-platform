import { useQuery } from "@tanstack/react-query";
import { getJobMatchDetails } from "@/features/placement-intelligence/api/recommendation-api";

export const JOB_MATCH_DETAILS_QUERY_KEY = ["recommendations", "job"] as const;

export function useJobMatchDetails(jobId: number | undefined) {
    return useQuery({
        queryKey: [...JOB_MATCH_DETAILS_QUERY_KEY, jobId],
        queryFn: () => getJobMatchDetails(jobId!),
        enabled: typeof jobId === "number" && !Number.isNaN(jobId) && jobId > 0,
        staleTime: 60 * 1000,
    });
}
