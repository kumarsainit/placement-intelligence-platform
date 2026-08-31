import { useQuery } from "@tanstack/react-query";

import { getAdminAnalytics } from "@/features/admin-analytics/api/admin-analytics-api";

export const ADMIN_ANALYTICS_QUERY_KEY = [
    "admin-analytics",
    "overview",
] as const;

export function useAdminAnalytics() {
    return useQuery({
        queryKey: ADMIN_ANALYTICS_QUERY_KEY,
        queryFn: getAdminAnalytics,
        staleTime: 60 * 1000,
    });
}
