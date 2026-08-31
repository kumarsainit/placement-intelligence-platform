import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminCompanyStatus } from "@/features/admin-companies/api/admin-company-api";
import { ADMIN_COMPANIES_QUERY_KEY } from "@/features/admin-companies/hooks/use-admin-companies";
import { ADMIN_ANALYTICS_QUERY_KEY } from "@/features/admin-analytics/hooks/use-admin-analytics";
import type { UpdateCompanyStatusInput } from "@/features/admin-companies/api/admin-company-api";

export function useUpdateCompanyStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            companyId,
            input,
        }: {
            companyId: number;
            input: UpdateCompanyStatusInput;
        }) => updateAdminCompanyStatus(companyId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_COMPANIES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ADMIN_ANALYTICS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
    });
}
