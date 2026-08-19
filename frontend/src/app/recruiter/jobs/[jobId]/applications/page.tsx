"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { RecruiterApplicationList } from "@/features/recruiter-applications/components/recruiter-application-list";
import { useRecruiterApplications } from "@/features/recruiter-applications/hooks/use-recruiter-applications";

export default function RecruiterJobApplicationsPage() {
    const params = useParams();

    const jobId = Number(params.jobId);

    const applicationsQuery =
        useRecruiterApplications(jobId);

    const applications =
        applicationsQuery.data?.data ?? [];

    return (
        <AuthGuard>
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8">
                        <Link
                            href={`/recruiter/jobs/${jobId}`}
                            className="text-sm font-medium hover:underline"
                        >
                            ← Job Details
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold">
                            Job Applications
                        </h1>

                        <p className="mt-2 text-zinc-600">
                            Review students who applied
                            for this job.
                        </p>
                    </header>

                    {applicationsQuery.isLoading && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            Loading applications...
                        </div>
                    )}

                    {applicationsQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h2 className="font-semibold text-red-700">
                                Unable to load applications
                            </h2>

                            <p className="mt-2 text-sm text-red-600">
                                {
                                    applicationsQuery
                                        .error
                                        .message
                                }
                            </p>
                        </div>
                    )}

                    {!applicationsQuery.isLoading &&
                        !applicationsQuery.isError && (
                            <RecruiterApplicationList
                                applications={
                                    applications
                                }
                                jobId={jobId}
                            />
                        )}
                </div>
            </main>
        </AuthGuard>
    );
}
