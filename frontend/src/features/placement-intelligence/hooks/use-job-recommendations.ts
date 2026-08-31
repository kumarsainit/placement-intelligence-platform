import { useQuery } from "@tanstack/react-query";
import { getJobRecommendations } from "@/features/placement-intelligence/api/recommendation-api";

export const RECOMMENDATIONS_QUERY_KEY = ["recommendations", "jobs"] as const;

export function useJobRecommendations() {
    return useQuery({
        queryKey: RECOMMENDATIONS_QUERY_KEY,
        queryFn: getJobRecommendations,
        staleTime: 60 * 1000,
    });
}
