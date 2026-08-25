import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";

import type { Company } from "@/features/company/types/company";

const COMPANIES_ENDPOINT = "/v1/companies";

export async function getCompanies(): Promise<
    ApiResponse<Company[]>
> {
    return apiClient<Company[]>(
        COMPANIES_ENDPOINT,
        {
            method: "GET",
        },
    );
}

export async function getCompany(
    companyId: number,
): Promise<ApiResponse<Company>> {
    return apiClient<Company>(
        `${COMPANIES_ENDPOINT}/${companyId}`,
        {
            method: "GET",
        },
    );
}
