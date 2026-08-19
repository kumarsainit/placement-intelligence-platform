"use client";

import Link from "next/link";

import type { RecruiterJob } from "@/features/recruiter-jobs/types/recruiter-job";

interface RecruiterJobCardProps {
    job: RecruiterJob;
    onDelete?: (jobId: number) => void;
    isDeleting?: boolean;
}

function formatEnum(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1),
        )
        .join(" ");
}

function formatDate(value: string) {
    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatSalary(
    salaryMin: number | null,
    salaryMax: number | null,
) {
    if (
        salaryMin === null &&
        salaryMax === null
    ) {
        return "Salary not disclosed";
    }

    if (
        salaryMin !== null &&
        salaryMax !== null
    ) {
        return `₹${salaryMin.toLocaleString("en-IN")} - ₹${salaryMax.toLocaleString("en-IN")}`;
    }

    if (salaryMin !== null) {
        return `From ₹${salaryMin.toLocaleString("en-IN")}`;
    }

    return `Up to ₹${salaryMax!.toLocaleString("en-IN")}`;
}

export function RecruiterJobCard({
                                     job,
                                     onDelete,
                                     isDeleting = false,
                                 }: RecruiterJobCardProps) {
    return (
        <article className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        {job.title}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-600">
                        {job.companyName}
                    </p>
                </div>

                <span className="w-fit rounded-full border px-3 py-1 text-xs font-medium">
                    {formatEnum(job.status)}
                </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
                <p>
                    <span className="font-medium text-zinc-900">
                        Location:
                    </span>{" "}
                    {job.location || "Not specified"}
                </p>

                <p>
                    <span className="font-medium text-zinc-900">
                        Employment:
                    </span>{" "}
                    {formatEnum(job.employmentType)}
                </p>

                <p>
                    <span className="font-medium text-zinc-900">
                        Experience:
                    </span>{" "}
                    {formatEnum(job.experienceLevel)}
                </p>

                <p>
                    <span className="font-medium text-zinc-900">
                        Openings:
                    </span>{" "}
                    {job.openings}
                </p>

                <p>
                    <span className="font-medium text-zinc-900">
                        Salary:
                    </span>{" "}
                    {formatSalary(
                        job.salaryMin,
                        job.salaryMax,
                    )}
                </p>

                <p>
                    <span className="font-medium text-zinc-900">
                        Deadline:
                    </span>{" "}
                    {formatDate(
                        job.applicationDeadline,
                    )}
                </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <Link
                    href={`/recruiter/jobs/${job.id}`}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                >
                    View / Edit
                </Link>

                {onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(job.id)}
                        disabled={isDeleting}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                )}
            </div>
        </article>
    );
}
