import type { Job } from "@/features/jobs/types/job";

interface JobCardProps {
    job: Job;
    onViewDetails: (jobId: number) => void;
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
            month: "short",
            year: "numeric",
        },
    );
}

function formatEnum(value: string) {
    return value
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

export function JobCard({
                            job,
                            onViewDetails,
                        }: JobCardProps) {
    const isOpen = job.status === "OPEN";

    return (
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div>
                {/* Header Row: Status and Employment Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            {formatEnum(job.employmentType)}
                        </span>

                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                            {formatEnum(job.experienceLevel)}
                        </span>
                    </div>

                    <span
                        className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                            isOpen
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                    >
                        {formatEnum(job.status)}
                    </span>
                </div>

                {/* Job Title & Company */}
                <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-100 dark:text-zinc-950">
                        💼
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-lg font-bold tracking-tight text-zinc-950 transition group-hover:text-black dark:text-white sm:text-xl">
                            {job.title}
                        </h3>

                        <p className="mt-0.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {job.companyName}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {job.description}
                </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-zinc-950 dark:text-white">
                            {formatSalary(job.salaryMin, job.salaryMax)}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="inline-flex items-center gap-1">
                                📍 {job.location}
                            </span>
                            <span>•</span>
                            <span>{job.openings} opening{job.openings === 1 ? "" : "s"}</span>
                            <span>•</span>
                            <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onViewDetails(job.id)}
                        className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-950 focus:outline-none dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                        View Details →
                    </button>
                </div>
            </div>
        </article>
    );
}
