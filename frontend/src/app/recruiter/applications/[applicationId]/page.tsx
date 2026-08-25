"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { RecruiterApplicationDetails } from "@/features/recruiter-applications/components/recruiter-application-details";
import { useRecruiterApplication } from "@/features/recruiter-applications/hooks/use-recruiter-application";

export default function RecruiterApplicationPage() {
    const params = useParams();

    const applicationId = Number(
        params.applicationId,
    );

    const applicationQuery =
        useRecruiterApplication(
            applicationId,
        );

    const application =
        applicationQuery.data?.data;

    return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8">
                        <Link
                            href="/recruiter/jobs"
                            className="text-sm font-medium hover:underline"
                        >
                            ← My Jobs
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold">
                            Application Details
                        </h1>
                    </header>

                    {applicationQuery.isLoading && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            Loading application...
                        </div>
                    )}

                    {applicationQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h2 className="font-semibold text-red-700">
                                Unable to load application
                            </h2>

                            <p className="mt-2 text-sm text-red-600">
                                {
                                    applicationQuery
                                        .error
                                        .message
                                }
                            </p>
                        </div>
                    )}

                    {!applicationQuery.isLoading &&
                        !applicationQuery.isError &&
                        application && (
                            <RecruiterApplicationDetails
                                application={
                                    application
                                }
                            />
                        )}
                </div>
            </main>
    );
}
