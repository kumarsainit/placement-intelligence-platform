"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppErrorState } from "@/components/ui/error-3";
import { useAdminJobs } from "@/features/admin-jobs/hooks/use-admin-jobs";
import { useUpdateJobStatus } from "@/features/admin-jobs/hooks/use-update-job-status";
import { AdminJobTable } from "@/features/admin-jobs/components/admin-job-table";
import { AdminJobStatusModal } from "@/features/admin-jobs/components/admin-job-status-modal";
import type { Job, JobStatus } from "@/features/jobs/types/job";

export default function AdminJobsPage() {
    const { data: jobsResponse, isLoading, isError, error, refetch } = useAdminJobs();
    const updateStatusMutation = useUpdateJobStatus();

    const [statusTargetJob, setStatusTargetJob] = useState<Job | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);

    const jobs = jobsResponse?.data ?? [];

    const handleStatusConfirm = async (job: Job, newStatus: JobStatus) => {
        try {
            setActionError(null);
            setActionSuccess(null);
            await updateStatusMutation.mutateAsync({
                jobId: job.id,
                input: { status: newStatus },
            });
            setStatusTargetJob(null);
            setActionSuccess(
                `Successfully updated status for "${job.title}" to ${newStatus}.`,
            );
        } catch (err: unknown) {
            setActionError(
                err instanceof Error ? err.message : "Failed to update job status.",
            );
        }
    };

    if (isLoading) {
        return (
            <main className="mx-auto max-w-6xl p-6 sm:p-8">
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-white" />
                    <p className="mt-4 text-sm font-medium text-zinc-500">
                        Loading placement job postings directory...
                    </p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="mx-auto max-w-6xl p-6 sm:p-8">
                <AppErrorState
                    title="Unable to load job postings"
                    message={
                        error instanceof Error
                            ? error.message
                            : "An error occurred while loading platform jobs. Please try again."
                    }
                    onRetry={() => refetch()}
                />
            </main>
        );
    }

    const totalOpen = jobs.filter((j) => j.status === "OPEN").length;
    const totalClosed = jobs.filter((j) => j.status === "CLOSED").length;
    const totalDraft = jobs.filter((j) => j.status === "DRAFT").length;
    const totalOpenings = jobs
        .filter((j) => j.status === "OPEN")
        .reduce((sum, j) => sum + j.openings, 0);

    return (
        <main className="mx-auto max-w-6xl p-6 sm:p-8">
            <div className="space-y-8">
                {/* Header Row */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Job Postings Oversight
                        </div>

                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                            Job Postings Governance
                        </h1>

                        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                            Inspect platform-wide job opportunities, track active opening capacities, and manage drive status.
                        </p>
                    </div>

                    <div className="flex gap-2.5">
                        <Link
                            href="/admin/dashboard"
                            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            ← Analytics Dashboard
                        </Link>
                    </div>
                </header>

                {/* Feedback Alerts */}
                {actionSuccess && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <span>✓ {actionSuccess}</span>
                        <button
                            type="button"
                            onClick={() => setActionSuccess(null)}
                            className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {actionError && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                        <span>⚠️ {actionError}</span>
                        <button
                            type="button"
                            onClick={() => setActionError(null)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Summary Metrics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Total Postings</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                            {jobs.length}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">All registered job listings</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Open Drives</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {totalOpen}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">{totalOpenings} open positions</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Closed Drives</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-500 dark:text-zinc-400">
                            {totalClosed}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">Completed recruitment drives</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Draft Postings</p>
                        <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {totalDraft}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">Pending recruiter publishing</p>
                    </div>
                </div>

                {/* Main Jobs Table */}
                <AdminJobTable
                    jobs={jobs}
                    onUpdateStatus={(job) => {
                        setActionError(null);
                        setActionSuccess(null);
                        setStatusTargetJob(job);
                    }}
                    isUpdatingStatus={updateStatusMutation.isPending}
                />

                {/* Status Confirmation Modal */}
                <AdminJobStatusModal
                    job={statusTargetJob}
                    isOpen={statusTargetJob !== null}
                    onClose={() => setStatusTargetJob(null)}
                    onConfirm={handleStatusConfirm}
                    isSubmitting={updateStatusMutation.isPending}
                />
            </div>
        </main>
    );
}
