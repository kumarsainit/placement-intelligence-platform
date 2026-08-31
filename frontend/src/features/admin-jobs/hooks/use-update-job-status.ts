import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminJobStatus } from "@/features/admin-jobs/api/admin-job-api";
import { ADMIN_JOBS_QUERY_KEY } from "@/features/admin-jobs/hooks/use-admin-jobs";
import { ADMIN_ANALYTICS_QUERY_KEY } from "@/features/admin-analytics/hooks/use-admin-analytics";
import type { UpdateJobStatusInput } from "@/features/admin-jobs/api/admin-job-api";

export function useUpdateJobStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            jobId,
            input,
        }: {
            jobId: number;
            input: UpdateJobStatusInput;
        }) => updateAdminJobStatus(jobId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_JOBS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ADMIN_ANALYTICS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
}
