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
import { useJobRecommendations } from "@/features/placement-intelligence/hooks/use-job-recommendations";
import { RecommendedJobCard } from "@/features/placement-intelligence/components/recommended-job-card";
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

type ViewTab = "all" | "recommended";

export default function JobsPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<ViewTab>("all");
    const [searchParams, setSearchParams] =
        useState<JobSearchFormValues>(
            DEFAULT_SEARCH,
        );

    const jobsQuery = useJobs(searchParams);
    const companiesQuery = useCompanies();
    const recommendationsQuery = useJobRecommendations();

    const pageData = jobsQuery.data?.data;
    const jobs = pageData?.content ?? [];
    const recommendations = recommendationsQuery.data?.data ?? [];

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

                    {/* View Tabs */}
                    <div className="flex gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={() => setActiveTab("all")}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                activeTab === "all"
                                    ? "bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-900"
                                    : "bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                            }`}
                        >
                            All Opportunities
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("recommended")}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                                activeTab === "recommended"
                                    ? "bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-900"
                                    : "bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                            }`}
                        >
                            <span>Recommended for You</span>
                            {recommendations.length > 0 && (
                                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                                    {recommendations.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeTab === "recommended" ? (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                                    Recommended Opportunities for You
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Ranked by suitability score based on your skills, academic discipline, and projects.
                                </p>
                            </div>

                            {recommendationsQuery.isLoading && (
                                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-white" />
                                    <p className="mt-4 text-xs font-medium text-zinc-500">
                                        Calculating personalized matches...
                                    </p>
                                </div>
                            )}

                            {recommendationsQuery.isError && (
                                <AppErrorState
                                    title="Unable to load recommendations"
                                    message="An error occurred while fetching your personalized recommendations."
                                    onRetry={() => recommendationsQuery.refetch()}
                                />
                            )}

                            {recommendationsQuery.isSuccess && (
                                recommendations.length === 0 ? (
                                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                            No placement recommendations found
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Add skills or project experiences to your profile to receive placement recommendations.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {recommendations.map((rec) => (
                                            <RecommendedJobCard
                                                key={rec.job.id}
                                                recommendation={rec}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
