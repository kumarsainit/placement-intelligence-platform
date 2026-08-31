import { useQuery } from "@tanstack/react-query";
import { getStudentInsights } from "@/features/placement-intelligence/api/recommendation-api";

export const STUDENT_INSIGHTS_QUERY_KEY = ["recommendations", "insights"] as const;

export function useStudentInsights() {
    return useQuery({
        queryKey: STUDENT_INSIGHTS_QUERY_KEY,
        queryFn: getStudentInsights,
        staleTime: 60 * 1000,
    });
}
