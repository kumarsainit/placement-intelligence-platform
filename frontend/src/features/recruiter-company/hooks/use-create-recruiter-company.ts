import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createRecruiterCompany,
} from "@/features/recruiter-company/api/recruiter-company-api";

import {
    RECRUITER_COMPANIES_QUERY_KEY,
} from "@/features/recruiter-company/hooks/use-recruiter-companies";

import type {
    CreateRecruiterCompanyRequest,
} from "@/features/recruiter-company/types/recruiter-company";

export function useCreateRecruiterCompany() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            request: CreateRecruiterCompanyRequest,
        ) =>
            createRecruiterCompany(
                request,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                RECRUITER_COMPANIES_QUERY_KEY,
            });

            queryClient.invalidateQueries({
                queryKey: ["companies"],
            });

            queryClient.invalidateQueries({
                queryKey: ["recruiter-dashboard"],
            });
        },
    });
}
