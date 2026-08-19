import { ApplicationCard } from "@/features/applications/components/application-card";

import type { JobApplication } from "@/features/applications/types/application";

interface ApplicationListProps {
    applications: JobApplication[];
}

export function ApplicationList({
                                    applications,
                                }: ApplicationListProps) {
    if (applications.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                <h3 className="text-lg font-semibold">
                    No applications yet
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                    Applications you submit for jobs will
                    appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((application) => (
                <ApplicationCard
                    key={application.id}
                    application={application}
                />
            ))}
        </div>
    );
}
