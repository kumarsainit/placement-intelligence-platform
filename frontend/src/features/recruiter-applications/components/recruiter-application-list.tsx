import Link from "next/link";

import { RecruiterApplicationCard } from "@/features/recruiter-applications/components/recruiter-application-card";
import type { RecruiterApplication } from "@/features/recruiter-applications/types/recruiter-application";

interface RecruiterApplicationListProps {
    applications: RecruiterApplication[];
    jobId: number;
}

export function RecruiterApplicationList({
                                             applications,
                                             jobId,
                                         }: RecruiterApplicationListProps) {
    if (applications.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-lg font-semibold">
                    No applications yet
                </h2>

                <p className="mt-2 text-sm text-zinc-600">
                    No students have applied for this
                    job yet.
                </p>

                <Link
                    href={`/recruiter/jobs/${jobId}`}
                    className="mt-4 inline-block text-sm font-medium hover:underline"
                >
                    ← Back to Job
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map(
                (application) => (
                    <RecruiterApplicationCard
                        key={application.id}
                        application={
                            application
                        }
                    />
                ),
            )}
        </div>
    );
}
