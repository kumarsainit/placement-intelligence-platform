"use client";

import React, { useState } from "react";
import type { Job, JobStatus } from "@/features/jobs/types/job";

interface AdminJobTableProps {
    jobs: Job[];
    onUpdateStatus: (job: Job) => void;
    isUpdatingStatus?: boolean;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getStatusBadge(status: JobStatus) {
    switch (status) {
        case "OPEN":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400";
        case "CLOSED":
            return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300";
        case "DRAFT":
        default:
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400";
    }
}

export function AdminJobTable({
    jobs,
    onUpdateStatus,
    isUpdatingStatus = false,
}: AdminJobTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(job.id).includes(searchTerm);

        const matchesStatus =
            statusFilter === "ALL" || job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by job title, company, location, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="job-status-filter" className="text-xs font-semibold text-zinc-500">
                        Status:
                    </label>
                    <select
                        id="job-status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                        <option value="ALL">All ({jobs.length})</option>
                        <option value="OPEN">Open Postings</option>
                        <option value="CLOSED">Closed Postings</option>
                        <option value="DRAFT">Drafts</option>
                    </select>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-zinc-200 bg-zinc-50/80 font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-950/50">
                            <tr>
                                <th className="px-5 py-3.5">Job Title</th>
                                <th className="px-5 py-3.5">Company</th>
                                <th className="px-5 py-3.5">Location / Type</th>
                                <th className="px-5 py-3.5">Openings</th>
                                <th className="px-5 py-3.5">Deadline</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-10 text-center text-xs text-zinc-400"
                                    >
                                        No platform job postings match your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr
                                        key={job.id}
                                        className="transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div>
                                                <span className="font-semibold text-zinc-900 dark:text-white">
                                                    {job.title}
                                                </span>
                                                <p className="text-[11px] text-zinc-400">
                                                    ID: #{job.id} • {job.experienceLevel.replace("_", " ")}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 font-medium text-zinc-800 dark:text-zinc-200">
                                            {job.companyName}
                                        </td>

                                        <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                                            {job.location} • {job.employmentType.replace("_", " ")}
                                        </td>

                                        <td className="px-5 py-4 font-mono text-zinc-700 dark:text-zinc-300">
                                            {job.openings} positions
                                        </td>

                                        <td className="px-5 py-4 text-zinc-500">
                                            {formatDate(job.applicationDeadline)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-block rounded-md border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${getStatusBadge(
                                                    job.status,
                                                )}`}
                                            >
                                                {job.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => onUpdateStatus(job)}
                                                disabled={isUpdatingStatus}
                                                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                            >
                                                Manage Status
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
