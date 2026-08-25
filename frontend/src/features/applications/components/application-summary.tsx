import type { JobApplication } from "@/features/applications/types/application";

interface ApplicationSummaryProps {
    applications: JobApplication[];
}

interface SummaryCardProps {
    label: string;
    count: number;
}

function SummaryCard({
                         label,
                         count,
                     }: SummaryCardProps) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold">
                {count}
            </p>
        </div>
    );
}

export function ApplicationSummary({
                                       applications,
                                   }: ApplicationSummaryProps) {
    const total = applications.length;

    const applied = applications.filter(
        (application) =>
            application.status === "APPLIED",
    ).length;

    const shortlisted = applications.filter(
        (application) =>
            application.status === "SHORTLISTED",
    ).length;

    const selected = applications.filter(
        (application) =>
            application.status === "SELECTED",
    ).length;

    const rejected = applications.filter(
        (application) =>
            application.status === "REJECTED",
    ).length;

    return (
        <section
            aria-label="Application summary"
            className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
            <SummaryCard
                label="Total Applications"
                count={total}
            />

            <SummaryCard
                label="Applied"
                count={applied}
            />

            <SummaryCard
                label="Shortlisted"
                count={shortlisted}
            />

            <SummaryCard
                label="Selected"
                count={selected}
            />

            <SummaryCard
                label="Rejected"
                count={rejected}
            />
        </section>
    );
}
