import { useQuery } from "@tanstack/react-query";

import {
    getRecruiterCompany,
} from "@/features/recruiter-company/api/recruiter-company-api";

export function useRecruiterCompany(
    companyId: number,
) {
    return useQuery({
        queryKey: [
            "recruiter-company",
            companyId,
        ],
        queryFn: () =>
            getRecruiterCompany(companyId),
        enabled:
            Number.isFinite(companyId) &&
            companyId > 0,
    });
}
