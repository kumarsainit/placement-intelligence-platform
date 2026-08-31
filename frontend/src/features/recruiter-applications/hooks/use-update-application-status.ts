import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    updateApplicationStatus,
} from "@/features/recruiter-applications/api/recruiter-application-api";

import type {
    UpdateApplicationStatusRequest,
} from "@/features/recruiter-applications/types/recruiter-application";

export function useUpdateApplicationStatus() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: ({
                         applicationId,
                         request,
                     }: {
            applicationId: number;
            request: UpdateApplicationStatusRequest;
        }) =>
            updateApplicationStatus(
                applicationId,
                request,
            ),

        onSuccess: (response) => {
            const application =
                response.data;

            queryClient.invalidateQueries({
                queryKey: [
                    "recruiter-application",
                    application.id,
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "recruiter-applications",
                    "job",
                    application.jobId,
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "recruiter-dashboard",
                    "applications",
                ],
            });
        },
    });
}
