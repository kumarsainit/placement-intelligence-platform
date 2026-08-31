import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Company } from "@/features/company/types/company";

const ADMIN_COMPANIES_ENDPOINT = "/v1/admin/companies";

export interface UpdateCompanyStatusInput {
    isActive: boolean;
}

export async function getAdminCompanies(): Promise<ApiResponse<Company[]>> {
    return apiClient<Company[]>(ADMIN_COMPANIES_ENDPOINT, {
        method: "GET",
    });
}

export async function getAdminCompanyById(
    companyId: number,
): Promise<ApiResponse<Company>> {
    return apiClient<Company>(`${ADMIN_COMPANIES_ENDPOINT}/${companyId}`, {
        method: "GET",
    });
}

export async function updateAdminCompanyStatus(
    companyId: number,
    input: UpdateCompanyStatusInput,
): Promise<ApiResponse<Company>> {
    return apiClient<Company>(`${ADMIN_COMPANIES_ENDPOINT}/${companyId}/status`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}
