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
    return (
        <article className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h3 className="text-xl font-semibold">
                        {job.title}
                    </h3>

                    <p className="mt-1 font-medium text-zinc-700">
                        {job.companyName}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-600">
                        <span className="rounded-full bg-zinc-100 px-3 py-1">
                            {job.location}
                        </span>

                        <span className="rounded-full bg-zinc-100 px-3 py-1">
                            {formatEnum(job.employmentType)}
                        </span>

                        <span className="rounded-full bg-zinc-100 px-3 py-1">
                            {formatEnum(job.experienceLevel)}
                        </span>
                    </div>
                </div>

                <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    {formatEnum(job.status)}
                </span>
            </div>

            <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
                {job.description}
            </p>

            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                    <p className="text-zinc-500">
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
                    <p className="text-zinc-500">
                        Openings
                    </p>
                    <p className="mt-1 font-medium">
                        {job.openings}
                    </p>
                </div>

                <div>
                    <p className="text-zinc-500">
                        Application Deadline
                    </p>
                    <p className="mt-1 font-medium">
                        {formatDate(
                            job.applicationDeadline,
                        )}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={() =>
                        onViewDetails(job.id)
                    }
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                    View Details
                </button>
            </div>
        </article>
    );
}
