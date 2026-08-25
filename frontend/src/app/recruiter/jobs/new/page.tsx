"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCompanies } from "@/features/jobs/hooks/use-companies";
import { RecruiterJobForm } from "@/features/recruiter-jobs/components/recruiter-job-form";
import { useCreateRecruiterJob } from "@/features/recruiter-jobs/hooks/use-create-recruiter-job";
import type { RecruiterJobFormValues } from "@/features/recruiter-jobs/schemas/recruiter-job-schema";

export default function CreateRecruiterJobPage() {
    const router = useRouter();

    const companiesQuery = useCompanies();
    const createMutation = useCreateRecruiterJob();

    const companies =
        companiesQuery.data?.data ?? [];

    const handleSubmit = (
        values: RecruiterJobFormValues,
    ) => {
        createMutation.mutate(values, {
            onSuccess: (response) => {
                const jobId = response.data.id;

                router.push(
                    `/recruiter/jobs/${jobId}`,
                );
            },
        });
    };

    const isSubmitting =
        createMutation.isPending;

    return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <header className="mb-8">
                        <Link
                            href="/recruiter/jobs"
                            className="text-sm font-medium hover:underline"
                        >
                            ← My Jobs
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold">
                            Create Job
                        </h1>

                        <p className="mt-2 text-zinc-600">
                            Create a new job posting for your
                            company.
                        </p>
                    </header>

                    {companiesQuery.isLoading && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <p className="text-zinc-600">
                                Loading companies...
                            </p>
                        </div>
                    )}

                    {companiesQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h2 className="font-semibold text-red-700">
                                Unable to load companies
                            </h2>

                            <p className="mt-2 text-sm text-red-600">
                                {companiesQuery.error.message}
                            </p>
                        </div>
                    )}

                    {!companiesQuery.isLoading &&
                        !companiesQuery.isError &&
                        companies.length === 0 && (
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <h2 className="font-semibold">
                                    No companies available
                                </h2>

                                <p className="mt-2 text-sm text-zinc-600">
                                    A company must be available before
                                    you can create a job.
                                </p>
                            </div>
                        )}

                    {!companiesQuery.isLoading &&
                        !companiesQuery.isError &&
                        companies.length > 0 && (
                            <RecruiterJobForm
                                companies={companies}
                                isSubmitting={
                                    isSubmitting
                                }
                                onSubmit={handleSubmit}
                                onCancel={() =>
                                    router.push(
                                        "/recruiter/jobs",
                                    )
                                }
                            />
                        )}

                    {createMutation.isError && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {createMutation.error.message}
                        </div>
                    )}
                </div>
            </main>
    );
}
