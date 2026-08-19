import type {
    ApplicationStatus,
} from "@/features/applications/types/application";

interface ApplicationStatusBadgeProps {
    status: ApplicationStatus;
}

const STATUS_LABELS: Record<
    ApplicationStatus,
    string
> = {
    APPLIED: "Applied",
    SHORTLISTED: "Shortlisted",
    REJECTED: "Rejected",
    SELECTED: "Selected",
};

export function ApplicationStatusBadge({
                                           status,
                                       }: ApplicationStatusBadgeProps) {
    const className =
        status === "SELECTED"
            ? "bg-green-100 text-green-700"
            : status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : status === "SHORTLISTED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-zinc-100 text-zinc-700";

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}
