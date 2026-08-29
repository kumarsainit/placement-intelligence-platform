"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

                    <div>
                        <h1 className="text-3xl font-bold">
                            Find Your Next Opportunity
                        </h1>

                        <p className="mt-2 text-sm text-zinc-600">
                            Search and discover jobs that match
                            your skills and career goals.
                        </p>
                    </div>

                    <JobSearchFilters
                        companies={
                            companiesQuery.data?.data ?? []
                        }
                        initialValues={searchParams}
                        onSearch={handleSearch}
                    />

                    {jobsQuery.isLoading && (
                        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                            <p className="text-sm text-zinc-500">
                                Searching for jobs...
                            </p>
                        </div>
                    )}

                    {jobsQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h2 className="font-semibold text-red-700">
                                Unable to load jobs
                            </h2>

                            <p className="mt-2 text-sm text-red-600">
                                {jobsQuery.error?.message ??
                                    "Something went wrong while loading jobs."}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    jobsQuery.refetch()
                                }
                                className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {jobsQuery.isSuccess && (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">
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
