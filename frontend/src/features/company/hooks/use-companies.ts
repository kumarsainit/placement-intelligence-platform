import { useQuery } from "@tanstack/react-query";

import {
    getCompanies,
} from "@/features/company/api/company-api";

export const COMPANIES_QUERY_KEY = [
    "companies",
];

export function useCompanies() {
    return useQuery({
        queryKey: COMPANIES_QUERY_KEY,
        queryFn: getCompanies,
        staleTime: 5 * 60 * 1000,
    });
}
