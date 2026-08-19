import { JobCard } from "@/features/jobs/components/job-card";

import type { Job } from "@/features/jobs/types/job";

interface JobListProps {
    jobs: Job[];
    onViewDetails: (jobId: number) => void;
}

export function JobList({
                            jobs,
                            onViewDetails,
                        }: JobListProps) {
    if (jobs.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                <h3 className="text-lg font-semibold">
                    No jobs found
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                    Try changing your search filters.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
}
