import type { Company } from "@/features/company/types/company";

export type RecruiterCompany = Company;

export interface CreateRecruiterCompanyRequest {
    name: string;
    website?: string;
    industry?: string;
    description?: string;
    location?: string;
}
