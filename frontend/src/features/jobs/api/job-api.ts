import { apiClient } from "@/lib/api/client";

import type {
    ApiResponse,
} from "@/types/api";

import type {
    Company,
    Job,
    JobSearchParams,
    PageResponse,
} from "@/features/jobs/types/job";

export async function getJobs(): Promise<
    ApiResponse<Job[]>
> {
    return apiClient<Job[]>("/v1/jobs", {
        method: "GET",
    });
}

export async function getJob(
    jobId: number,
): Promise<ApiResponse<Job>> {
    return apiClient<Job>(
        `/v1/jobs/${jobId}`,
        {
            method: "GET",
        },
    );
}

export async function searchJobs(
    params: JobSearchParams,
): Promise<ApiResponse<PageResponse<Job>>> {
    const searchParams = new URLSearchParams();

    if (params.keyword?.trim()) {
        searchParams.set(
            "keyword",
            params.keyword.trim(),
        );
    }

    if (params.location?.trim()) {
        searchParams.set(
            "location",
            params.location.trim(),
        );
    }

    if (params.companyId !== undefined) {
        searchParams.set(
            "companyId",
            String(params.companyId),
        );
    }

    if (params.employmentType) {
        searchParams.set(
            "employmentType",
            params.employmentType,
        );
    }

    if (params.experienceLevel) {
        searchParams.set(
            "experienceLevel",
            params.experienceLevel,
        );
    }

    if (params.minSalary !== undefined) {
        searchParams.set(
            "minSalary",
            String(params.minSalary),
        );
    }

    if (params.maxSalary !== undefined) {
        searchParams.set(
            "maxSalary",
            String(params.maxSalary),
        );
    }

    if (params.page !== undefined) {
        searchParams.set(
            "page",
            String(params.page),
        );
    }

    if (params.size !== undefined) {
        searchParams.set(
            "size",
            String(params.size),
        );
    }

    const queryString = searchParams.toString();

    return apiClient<PageResponse<Job>>(
        `/v1/jobs/search${queryString ? `?${queryString}` : ""}`,
        {
            method: "GET",
        },
    );
}

export async function getCompanies(): Promise<
    ApiResponse<Company[]>
> {
    return apiClient<Company[]>(
        "/v1/companies",
        {
            method: "GET",
        },
    );
}
