import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";

import type {
    CreateRecruiterCompanyRequest,
    RecruiterCompany,
} from "@/features/recruiter-company/types/recruiter-company";

const COMPANIES_ENDPOINT = "/v1/companies";

export async function createRecruiterCompany(
    request: CreateRecruiterCompanyRequest,
): Promise<ApiResponse<RecruiterCompany>> {
    return apiClient<RecruiterCompany>(
        COMPANIES_ENDPOINT,
        {
            method: "POST",
            body: request,
        },
    );
}

export async function getRecruiterCompanies(): Promise<
    ApiResponse<RecruiterCompany[]>
> {
    return apiClient<RecruiterCompany[]>(
        COMPANIES_ENDPOINT,
        {
            method: "GET",
        },
    );
}

export async function getRecruiterCompany(
    companyId: number,
): Promise<ApiResponse<RecruiterCompany>> {
    return apiClient<RecruiterCompany>(
        `${COMPANIES_ENDPOINT}/${companyId}`,
        {
            method: "GET",
        },
    );
}
