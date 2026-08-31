"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CareerHeader } from "@/components/ui/career-3";
import { AppErrorState } from "@/components/ui/error-3";
import { JobList } from "@/features/jobs/components/job-list";
import { JobPagination } from "@/features/jobs/components/job-pagination";
import { JobSearchFilters } from "@/features/jobs/components/job-search-filters";
import { useCompanies } from "@/features/jobs/hooks/use-companies";
import { useJobs } from "@/features/jobs/hooks/use-jobs";
import type {
    JobSearchFormValues,
} from "@/features/jobs/schemas/job-search-schema";

const DEFAULT_SEARCH: JobSearchFormValues = {
    keyword: "",
    location: "",
    companyId: undefined,
    employmentType: undefined,
    experienceLevel: undefined,
    minSalary: undefined,
    maxSalary: undefined,
    page: 0,
    size: 10,
};

export default function JobsPage() {
    const router = useRouter();

    const [searchParams, setSearchParams] =
        useState<JobSearchFormValues>(
            DEFAULT_SEARCH,
        );

    const jobsQuery = useJobs(searchParams);
    const companiesQuery = useCompanies();

    const pageData = jobsQuery.data?.data;

    const jobs = pageData?.content ?? [];

    const handleSearch = (
        values: JobSearchFormValues,
    ) => {
        setSearchParams({
            ...values,
            page: 0,
        });
    };

    const handlePageChange = (page: number) => {
        setSearchParams((current) => ({
            ...current,
            page,
        }));

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleViewDetails = (jobId: number) => {
        router.push(`/jobs/${jobId}`);
    };

    return (
        <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="space-y-8">
                    <CareerHeader
                        eyebrow="Placement Intelligence Jobs"
                        heading="Discover Career Opportunities"
                        subheading="Search and apply to open positions across verified partner companies that match your profile."
                    />

                    <JobSearchFilters
                        companies={
                            companiesQuery.data?.data ?? []
                        }
                        initialValues={searchParams}
                        onSearch={handleSearch}
                    />

                    {jobsQuery.isLoading && (
                        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                            <p className="mt-4 text-sm font-medium text-zinc-500">
                                Searching available jobs...
                            </p>
                        </div>
                    )}

                    {jobsQuery.isError && (
                        <AppErrorState
                            title="Unable to load job postings"
                            message={
                                jobsQuery.error?.message ??
                                "Something went wrong while retrieving jobs. Please try again."
                            }
                            onRetry={() => jobsQuery.refetch()}
                        />
                    )}

                    {jobsQuery.isSuccess && (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-zinc-950">
                                        Available Jobs
                                    </h2>

                                    <p className="mt-1 text-sm text-zinc-500">
                                        {pageData?.totalElements ?? 0}{" "}
                                        job
                                        {(pageData?.totalElements ?? 0) ===
                                        1
                                            ? ""
                                            : "s"}{" "}
                                        found
                                    </p>
                                </div>
                            </div>

                            <JobList
                                jobs={jobs}
                                onViewDetails={
                                    handleViewDetails
                                }
                            />

                            {pageData && (
                                <JobPagination
                                    currentPage={
                                        pageData.number
                                    }
                                    totalPages={
                                        pageData.totalPages
                                    }
                                    hasPreviousPage={
                                        !pageData.first
                                    }
                                    hasNextPage={
                                        !pageData.last
                                    }
                                    onPageChange={
                                        handlePageChange
                                    }
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
