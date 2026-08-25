"use client";

import Link from "next/link";

import { RecruiterJobList } from "@/features/recruiter-jobs/components/recruiter-job-list";
import { useDeleteRecruiterJob } from "@/features/recruiter-jobs/hooks/use-delete-recruiter-job";
import { useRecruiterJobs } from "@/features/recruiter-jobs/hooks/use-recruiter-jobs";

export default function RecruiterJobsPage() {
    const jobsQuery = useRecruiterJobs();
    const deleteMutation = useDeleteRecruiterJob();

    const jobs = jobsQuery.data?.data ?? [];

    const handleDelete = (jobId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?",
        );

        if (!confirmed) {
            return;
        }

        deleteMutation.mutate(jobId);
    };

    return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-5xl">
                    <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium hover:underline"
                            >
                                ← Dashboard
                            </Link>

                            <h1 className="mt-4 text-3xl font-bold">
                                My Jobs
                            </h1>

                            <p className="mt-2 text-zinc-600">
                                Create and manage the jobs you have
                                posted.
                            </p>
                        </div>

                        <Link
                            href="/recruiter/jobs/new"
                            className="w-fit rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                        >
                            Create Job
                        </Link>
                    </header>

                    <section className="mt-8">
                        {jobsQuery.isLoading && (
                            <div className="rounded-xl border bg-white p-8 shadow-sm">
                                <p className="text-zinc-600">
                                    Loading your jobs...
                                </p>
                            </div>
                        )}

                        {jobsQuery.isError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                                <h2 className="font-semibold text-red-700">
                                    Unable to load jobs
                                </h2>

                                <p className="mt-2 text-sm text-red-600">
                                    {jobsQuery.error.message}
                                </p>
                            </div>
                        )}

                        {!jobsQuery.isLoading &&
                            !jobsQuery.isError && (
                                <RecruiterJobList
                                    jobs={jobs}
                                    onDelete={handleDelete}
                                    deletingJobId={
                                        deleteMutation.isPending
                                            ? deleteMutation.variables
                                            : null
                                    }
                                />
                            )}

                        {deleteMutation.isError && (
                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {deleteMutation.error.message}
                            </div>
                        )}

                        {deleteMutation.isSuccess && (
                            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                                Job deleted successfully.
                            </div>
                        )}
                    </section>
                </div>
            </main>
    );
}
