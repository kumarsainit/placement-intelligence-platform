"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import { useApplication } from "@/features/applications/hooks/use-application";

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatFileSize(size: number) {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ApplicationDetailsPage() {
    const params = useParams();

    const applicationId = Number(params.applicationId);

    const applicationQuery =
        useApplication(applicationId);

    if (
        !Number.isInteger(applicationId) ||
        applicationId <= 0
    ) {
        return (
            <AuthGuard>
                <main className="min-h-screen bg-zinc-50 p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h1 className="text-xl font-semibold text-red-700">
                                Invalid Application
                            </h1>

                            <p className="mt-2 text-sm text-red-600">
                                The requested application ID is
                                invalid.
                            </p>

                            <Link
                                href="/applications"
                                className="mt-5 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Back to Applications
                            </Link>
                        </div>
                    </div>
                </main>
            </AuthGuard>
        );
    }

    if (applicationQuery.isLoading) {
        return (
            <AuthGuard>
                <main className="min-h-screen bg-zinc-50 p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                            <p className="text-sm text-zinc-500">
                                Loading application details...
                            </p>
                        </div>
                    </div>
                </main>
            </AuthGuard>
        );
    }

    if (
        applicationQuery.isError ||
        !applicationQuery.data?.data
    ) {
        return (
            <AuthGuard>
                <main className="min-h-screen bg-zinc-50 p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h1 className="text-xl font-semibold text-red-700">
                                Unable to load application
                            </h1>

                            <p className="mt-2 text-sm text-red-600">
                                The requested application could not
                                be found or loaded.
                            </p>

                            <div className="mt-5 flex gap-3">
                                <Link
                                    href="/applications"
                                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                                >
                                    Back to Applications
                                </Link>

                                <button
                                    type="button"
                                    onClick={() =>
                                        applicationQuery.refetch()
                                    }
                                    className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </AuthGuard>
        );
    }

    const application =
        applicationQuery.data.data;

    return (
        <AuthGuard>
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href="/applications"
                        className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-black"
                    >
                        ← Back to Applications
                    </Link>

                    <article className="mt-6 rounded-xl border bg-white shadow-sm">
                        <header className="border-b p-6 sm:p-8">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500">
                                        Application #{application.id}
                                    </p>

                                    <h1 className="mt-2 text-3xl font-bold">
                                        {application.jobTitle}
                                    </h1>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        Applied on{" "}
                                        {formatDate(
                                            application.appliedAt,
                                        )}
                                    </p>
                                </div>

                                <ApplicationStatusBadge
                                    status={application.status}
                                />
                            </div>
                        </header>

                        <div className="space-y-10 p-6 sm:p-8">
                            <section>
                                <h2 className="text-xl font-semibold">
                                    Application Details
                                </h2>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            Application ID
                                        </p>

                                        <p className="mt-1 font-medium">
                                            #{application.id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            Job ID
                                        </p>

                                        <p className="mt-1 font-medium">
                                            #{application.jobId}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            Current Status
                                        </p>

                                        <div className="mt-2">
                                            <ApplicationStatusBadge
                                                status={
                                                    application.status
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            Last Updated
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {formatDate(
                                                application.updatedAt,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold">
                                    Submitted Resume
                                </h2>

                                <div className="mt-4 rounded-xl border bg-zinc-50 p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium">
                                                {
                                                    application.resumeFileName
                                                }
                                            </p>

                                            <p className="mt-1 text-sm text-zinc-500">
                                                {
                                                    application.resumeFileType
                                                }{" "}
                                                ·{" "}
                                                {formatFileSize(
                                                    application.resumeFileSize,
                                                )}
                                            </p>
                                        </div>

                                        {application.resumeFileUrl && (
                                            <a
                                                href={
                                                    application.resumeFileUrl
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-fit rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                                            >
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold">
                                    Cover Letter
                                </h2>

                                {application.coverLetter ? (
                                    <div className="mt-4 whitespace-pre-wrap rounded-xl border bg-zinc-50 p-5 text-sm leading-7 text-zinc-700">
                                        {application.coverLetter}
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-xl border bg-zinc-50 p-5 text-sm text-zinc-500">
                                        No cover letter was submitted
                                        with this application.
                                    </div>
                                )}
                            </section>
                        </div>
                    </article>
                </div>
            </main>
        </AuthGuard>
    );
}
