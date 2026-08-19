"use client";

import {
    APPLICATION_STATUSES,
    type ApplicationStatus,
} from "@/features/recruiter-applications/types/recruiter-application";

interface RecruiterApplicationStatusSelectProps {
    value: ApplicationStatus;
    onChange: (
        status: ApplicationStatus,
    ) => void;
    disabled?: boolean;
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

export function RecruiterApplicationStatusSelect({
                                                     value,
                                                     onChange,
                                                     disabled = false,
                                                 }: RecruiterApplicationStatusSelectProps) {
    return (
        <select
            value={value}
            onChange={(event) =>
                onChange(
                    event.target
                        .value as ApplicationStatus,
                )
            }
            disabled={disabled}
            className="rounded-lg border px-3 py-2 text-sm"
        >
            {APPLICATION_STATUSES.map(
                (status) => (
                    <option
                        key={status}
                        value={status}
                    >
                        {STATUS_LABELS[status]}
                    </option>
                ),
            )}
        </select>
    );
}
