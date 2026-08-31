import { useQuery } from "@tanstack/react-query";
import { getAdminJobs } from "@/features/admin-jobs/api/admin-job-api";

export const ADMIN_JOBS_QUERY_KEY = ["admin-jobs"] as const;

export function useAdminJobs() {
    return useQuery({
        queryKey: ADMIN_JOBS_QUERY_KEY,
        queryFn: getAdminJobs,
        staleTime: 30 * 1000,
    });
}
