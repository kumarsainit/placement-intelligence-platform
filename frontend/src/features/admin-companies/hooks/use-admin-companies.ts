import { useQuery } from "@tanstack/react-query";
import { getAdminCompanies } from "@/features/admin-companies/api/admin-company-api";

export const ADMIN_COMPANIES_QUERY_KEY = ["admin-companies"] as const;

export function useAdminCompanies() {
    return useQuery({
        queryKey: ADMIN_COMPANIES_QUERY_KEY,
        queryFn: getAdminCompanies,
        staleTime: 30 * 1000,
    });
}
