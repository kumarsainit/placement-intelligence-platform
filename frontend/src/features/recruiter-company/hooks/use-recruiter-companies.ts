import { useQuery } from "@tanstack/react-query";

import {
    getRecruiterCompanies,
} from "@/features/recruiter-company/api/recruiter-company-api";

export const RECRUITER_COMPANIES_QUERY_KEY = [
    "recruiter-companies",
];

export function useRecruiterCompanies() {
    return useQuery({
        queryKey:
        RECRUITER_COMPANIES_QUERY_KEY,
        queryFn: getRecruiterCompanies,
        staleTime: 5 * 60 * 1000,
    });
}
