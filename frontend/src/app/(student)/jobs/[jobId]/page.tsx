"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ApplyJobForm } from "@/features/applications/components/apply-job-form";
import { useApplications } from "@/features/applications/hooks/use-applications";
import { useApplyJob } from "@/features/applications/hooks/use-apply-job";
import type { ApplicationFormValues } from "@/features/applications/schemas/application-schema";
import { useJob } from "@/features/jobs/hooks/use-job";

function formatEnum(value: string) {
    return value
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

function formatSalary(
    salaryMin: number | null,
    salaryMax: number | null,
) {
    if (salaryMin === null && salaryMax === null) {
        return "Salary not specified";
    }

    if (salaryMin !== null && salaryMax !== null) {
        return `₹${salaryMin.toLocaleString()} - ₹${salaryMax.toLocaleString()}`;
    }

    if (salaryMin !== null) {
        return `From ₹${salaryMin.toLocaleString()}`;
    }

    return `Up to ₹${salaryMax!.toLocaleString()}`;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    );
}

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const jobId = Number(params.jobId);

    const jobQuery = useJob(jobId);
    const applyJobMutation = useApplyJob();
    const applicationsQuery = useApplications();

    const handleApply = (
        values: ApplicationFormValues,
    ) => {
        applyJobMutation.mutate(
            {
                jobId,
                resumeId: values.resumeId,
                coverLetter:
                    values.coverLetter?.trim() || undefined,
            },
            {
                onSuccess: (response) => {
                    const applicationId =
                        response.data.id;

                    router.push(
                        `/applications/${applicationId}`,
                    );
                },
            },
        );
    };

    if (!Number.isInteger(jobId) || jobId <= 0) {
        return (
                <main className="min-h-screen bg-zinc-50 p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h1 className="text-xl font-semibold text-red-700">
                                Invalid Job
                            </h1>

                            <p className="mt-2 text-sm text-red-600">
                                The requested job ID is invalid.
                            </p>

                            <Link
                                href="/jobs"
                                className="mt-5 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Back to Jobs
                            </Link>
                        </div>
                    </div>
                </main>
        );
    }

    if (jobQuery.isLoading) {
        return (
                <main className="min-h-screen bg-zinc-50 p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                            <p className="text-sm text-zinc-500">
                                Loading job details...
                            </p>
                        </div>
                    </div>
                </main>
        );
    }

    if (
        jobQuery.isError ||
        !jobQuery.data?.data
    ) {
        return (
                <main className="min-h-screen bg-zinc-50 p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h1 className="text-xl font-semibold text-red-700">
                                Unable to load job
                            </h1>

                            <p className="mt-2 text-sm text-red-600">
                                The requested job could not be
                                found or loaded.
                            </p>

                            <Link
                                href="/jobs"
                                className="mt-5 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Back to Jobs
                            </Link>
                        </div>
                    </div>
                </main>
        );
    }

    const job = jobQuery.data.data;

    const isOpen = job.status === "OPEN";

    const existingApplication =
        applicationsQuery.data?.data.find(
            (application) =>
                application.jobId === job.id,
        );

    return (
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-black"
                    >
                        ← Back to Jobs
                    </Link>

                    <article className="mt-6 rounded-xl border bg-white shadow-sm">
                        <div className="border-b p-6 sm:p-8">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {job.title}
                                    </h1>

                                    <p className="mt-2 text-lg font-medium text-zinc-700">
                                        {job.companyName}
                                    </p>
                                </div>

                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                                        isOpen
                                            ? "bg-green-100 text-green-700"
                                            : "bg-zinc-100 text-zinc-700"
                                    }`}
                                >
                                    {formatEnum(job.status)}
                                </span>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
                                    📍 {job.location}
                                </span>

                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
                                    {formatEnum(
                                        job.employmentType,
                                    )}
                                </span>

                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
                                    {formatEnum(
                                        job.experienceLevel,
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <section>
                                <h2 className="text-xl font-semibold">
                                    Job Overview
                                </h2>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            Salary
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {formatSalary(
                                                job.salaryMin,
                                                job.salaryMax,
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            Openings
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {job.openings}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            Application Deadline
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {formatDate(
                                                job.applicationDeadline,
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            Posted
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {formatDate(
                                                job.createdAt,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-10">
                                <h2 className="text-xl font-semibold">
                                    Job Description
                                </h2>

                                <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                                    {job.description}
                                </div>
                            </section>

                            <section className="mt-10 rounded-xl bg-zinc-50 p-5">
                                <h2 className="font-semibold">
                                    Company
                                </h2>

                                <p className="mt-2 text-sm text-zinc-600">
                                    {job.companyName}
                                </p>

                                <p className="mt-1 text-sm text-zinc-600">
                                    {job.location}
                                </p>
                            </section>

                            <section className="mt-10 border-t pt-10">
                                {existingApplication ? (
                                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                                        <h2 className="font-semibold text-blue-800">
                                            You have already applied
                                        </h2>

                                        <p className="mt-1 text-sm text-blue-700">
                                            You submitted an application for this job
                                            on{" "}
                                            {formatDate(
                                                existingApplication.appliedAt,
                                            )}
                                            .
                                        </p>

                                        <Link
                                            href={`/applications/${existingApplication.id}`}
                                            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                                        >
                                            View Application
                                        </Link>
                                    </div>
                                ) : isOpen ? (
                                    <>
                                        <h2 className="mb-5 text-2xl font-semibold">
                                            Apply for this job
                                        </h2>

                                        <ApplyJobForm
                                            isSubmitting={
                                                applyJobMutation.isPending
                                            }
                                            onSubmit={handleApply}
                                        />

                                        {applyJobMutation.isError && (
                                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                                                <p className="text-sm text-red-600">
                                                    {applyJobMutation.error?.message ||
                                                        "Unable to submit your application. Please try again."}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                                        <h2 className="font-semibold text-amber-800">
                                            Applications are closed
                                        </h2>

                                        <p className="mt-1 text-sm text-amber-700">
                                            This job is no longer accepting
                                            applications.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </article>
                </div>
            </main>
    );
}
