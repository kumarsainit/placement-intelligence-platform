"use client";

import Link from "next/link";

import { ApplicationSummary } from "@/features/applications/components/application-summary";
import { ApplicationList } from "@/features/applications/components/application-list";
import { useApplications } from "@/features/applications/hooks/use-applications";

export default function ApplicationsPage() {
    const applicationsQuery = useApplications();

    return (
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                My Applications
                            </h1>

                            <p className="mt-2 text-zinc-600">
                                Track the jobs you have applied
                                for and monitor their status.
                            </p>
                        </div>

                        <Link
                            href="/jobs"
                            className="w-fit rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                        >
                            Browse Jobs
                        </Link>
                    </header>

                    {applicationsQuery.isLoading && (
                        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                            <p className="text-sm text-zinc-500">
                                Loading your applications...
                            </p>
                        </div>
                    )}

                    {applicationsQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h2 className="font-semibold text-red-700">
                                Unable to load applications
                            </h2>

                            <p className="mt-2 text-sm text-red-600">
                                Something went wrong while
                                fetching your applications.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    applicationsQuery.refetch()
                                }
                                className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!applicationsQuery.isLoading &&
                        !applicationsQuery.isError && (
                            <>
                                <ApplicationSummary
                                    applications={
                                        applicationsQuery.data
                                            ?.data ?? []
                                    }
                                />

                                <ApplicationList
                                    applications={
                                        applicationsQuery.data
                                            ?.data ?? []
                                    }
                                />
                            </>
                        )}
                </div>
            </main>
    );
}
