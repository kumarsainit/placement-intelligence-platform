"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useCompanies } from "@/features/jobs/hooks/use-companies";
import { RecruiterJobForm } from "@/features/recruiter-jobs/components/recruiter-job-form";
import { useRecruiterJob } from "@/features/recruiter-jobs/hooks/use-recruiter-job";
import { useUpdateRecruiterJob } from "@/features/recruiter-jobs/hooks/use-update-recruiter-job";
import type { RecruiterJobFormValues } from "@/features/recruiter-jobs/schemas/recruiter-job-schema";

export default function RecruiterJobDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const jobId = Number(params.jobId);

    const jobQuery = useRecruiterJob(jobId);
    const companiesQuery = useCompanies();
    const updateMutation = useUpdateRecruiterJob();

    if (!Number.isInteger(jobId) || jobId <= 0) {
        return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h1 className="text-xl font-semibold text-red-700">
                            Invalid Job ID
                        </h1>
                        <p className="mt-2 text-sm text-red-600">
                            The requested job ID is invalid.
                        </p>
                        <Link
                            href="/recruiter/jobs"
                            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (jobQuery.isLoading || companiesQuery.isLoading) {
        return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                        <p className="text-sm text-zinc-500">
                            Loading job details...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (jobQuery.isError || !jobQuery.data?.data) {
        return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h1 className="text-xl font-semibold text-red-700">
                            Unable to load job
                        </h1>
                        <p className="mt-2 text-sm text-red-600">
                            {jobQuery.error?.message || "Job not found or inaccessible."}
                        </p>
                        <div className="mt-4 flex gap-3">
                            <Link
                                href="/recruiter/jobs"
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Back to Jobs
                            </Link>
                            <button
                                type="button"
                                onClick={() => jobQuery.refetch()}
                                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const job = jobQuery.data.data;
    const companies = companiesQuery.data?.data ?? [];

    const handleSubmit = (values: RecruiterJobFormValues) => {
        updateMutation.mutate(
            {
                jobId,
                request: {
                    ...values,
                    status: values.status ?? job.status,
                },
            },
            {
                onSuccess: () => {
                    router.push("/recruiter/jobs");
                },
            },
        );
    };

    return (
        <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
            <div className="mx-auto max-w-3xl">
                <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/recruiter/jobs"
                            className="text-sm font-medium hover:underline"
                        >
                            ← Back to Jobs
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold">
                            Edit Job
                        </h1>
                        <p className="mt-1 text-sm text-zinc-600">
                            {job.title} · {job.companyName}
                        </p>
                    </div>

                    <Link
                        href={`/recruiter/jobs/${job.id}/applications`}
                        className="w-fit rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                    >
                        View Applications →
                    </Link>
                </header>

                <RecruiterJobForm
                    companies={companies}
                    job={job}
                    isSubmitting={updateMutation.isPending}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push("/recruiter/jobs")}
                />

                {updateMutation.isError && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {updateMutation.error.message}
                    </div>
                )}
            </div>
        </main>
    );
}
