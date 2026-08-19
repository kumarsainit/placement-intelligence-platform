"use client";

import Link from "next/link";

import { RecruiterJobCard } from "@/features/recruiter-jobs/components/recruiter-job-card";

import type { RecruiterJob } from "@/features/recruiter-jobs/types/recruiter-job";

interface RecruiterJobListProps {
    jobs: RecruiterJob[];
    onDelete?: (jobId: number) => void;
    deletingJobId?: number | null;
}

export function RecruiterJobList({
                                     jobs,
                                     onDelete,
                                     deletingJobId = null,
                                 }: RecruiterJobListProps) {
    if (jobs.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-lg font-semibold">
                    No jobs found
                </h2>

                <p className="mt-2 text-sm text-zinc-600">
                    You haven&apos;t created any jobs yet.
                </p>

                <Link
                    href="/recruiter/jobs/new"
                    className="mt-5 inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                    Create Your First Job
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <RecruiterJobCard
                    key={job.id}
                    job={job}
                    onDelete={onDelete}
                    isDeleting={
                        deletingJobId === job.id
                    }
                />
            ))}
        </div>
    );
}
