"use client";

import Link from "next/link";

import { AppErrorState } from "@/components/ui/error-3";
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
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
                            My Applications
                        </h1>

                        <p className="mt-2 text-sm text-zinc-600">
                            Track the jobs you have applied for and monitor their real-time status.
                        </p>
                    </div>

                    <Link
                        href="/jobs"
                        className="w-fit rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                        Browse Jobs →
                    </Link>
                </header>

                {applicationsQuery.isLoading && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                        <p className="mt-4 text-sm font-medium text-zinc-500">
                            Loading your applications...
                        </p>
                    </div>
                )}

                {applicationsQuery.isError && (
                    <AppErrorState
                        title="Unable to load applications"
                        message={
                            applicationsQuery.error?.message ??
                            "Something went wrong while fetching your applications. Please try again."
                        }
                        onRetry={() => applicationsQuery.refetch()}
                    />
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
