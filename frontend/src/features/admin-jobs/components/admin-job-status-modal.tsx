"use client";

import React, { useState } from "react";
import type { Job, JobStatus } from "@/features/jobs/types/job";

interface AdminJobStatusModalProps {
    job: Job | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (job: Job, newStatus: JobStatus) => Promise<void>;
    isSubmitting?: boolean;
}

const statusOptions: { status: JobStatus; title: string; description: string }[] = [
    {
        status: "OPEN",
        title: "OPEN (Active Listing)",
        description: "Visible in student search and accepting job applications from eligible candidates.",
    },
    {
        status: "CLOSED",
        title: "CLOSED (Applications Halted)",
        description: "Application window is closed. Candidates cannot submit new applications.",
    },
    {
        status: "DRAFT",
        title: "DRAFT (Unpublished)",
        description: "Hidden from student search. Inactive and under review.",
    },
];

interface JobStatusFormProps {
    job: Job;
    onClose: () => void;
    onConfirm: (job: Job, newStatus: JobStatus) => Promise<void>;
    isSubmitting: boolean;
}

function JobStatusForm({
    job,
    onClose,
    onConfirm,
    isSubmitting,
}: JobStatusFormProps) {
    const [selectedStatus, setSelectedStatus] = useState<JobStatus>(job.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        📋
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                            Job Posting Status Governance
                        </h3>
                        <p className="text-xs text-zinc-500">
                            {job.title} — {job.companyName}
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-2.5">
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Select Target Status:
                    </p>

                    <div className="space-y-2">
                        {statusOptions.map((option) => (
                            <label
                                key={option.status}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                                    selectedStatus === option.status
                                        ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                                        : "border-zinc-200 hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="job-status"
                                    value={option.status}
                                    checked={selectedStatus === option.status}
                                    onChange={() => setSelectedStatus(option.status)}
                                    className="mt-0.5 h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                                        {option.title}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                        {option.description}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={() => onConfirm(job, selectedStatus)}
                        disabled={isSubmitting || selectedStatus === job.status}
                        className="rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        {isSubmitting ? "Updating Status..." : "Update Status"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AdminJobStatusModal(props: AdminJobStatusModalProps) {
    if (!props.isOpen || !props.job) return null;

    return (
        <JobStatusForm
            job={props.job}
            onClose={props.onClose}
            onConfirm={props.onConfirm}
            isSubmitting={props.isSubmitting ?? false}
        />
    );
}
