"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { AppErrorState } from "@/components/ui/error-3";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import { useApplication } from "@/features/applications/hooks/use-application";
import { getResumeFile } from "@/features/resume/api/resume-api";

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

    const [isDownloadingResume, setIsDownloadingResume] = useState(false);
    const [resumeDownloadError, setResumeDownloadError] = useState<string | null>(null);

    const handleDownloadResume = async (resumeId: number, fileName: string) => {
        try {
            setIsDownloadingResume(true);
            setResumeDownloadError(null);
            const blob = await getResumeFile(resumeId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noreferrer";
            a.download = fileName || `resume-${resumeId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            setResumeDownloadError(
                error instanceof Error ? error.message : "Failed to load resume file",
            );
        } finally {
            setIsDownloadingResume(false);
        }
    };

    if (
        !Number.isInteger(applicationId) ||
        applicationId <= 0
    ) {
        return (
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-4xl">
                    <AppErrorState
                        title="Invalid Application"
                        message="The requested application ID is invalid."
                        backHref="/applications"
                        backLabel="Back to Applications"
                    />
                </div>
            </main>
        );
    }

    if (applicationQuery.isLoading) {
        return (
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                        <p className="mt-4 text-sm font-medium text-zinc-500">
                            Loading application details...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (
        applicationQuery.isError ||
        !applicationQuery.data?.data
    ) {
        return (
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-4xl">
                    <AppErrorState
                        title="Unable to load application"
                        message="The requested application could not be found or loaded."
                        onRetry={() => applicationQuery.refetch()}
                        backHref="/applications"
                        backLabel="Back to Applications"
                    />
                </div>
            </main>
        );
    }

    const application =
        applicationQuery.data.data;

    return (
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

                                    {application.companyName && (
                                        <p className="mt-1 text-base font-medium text-zinc-700">
                                            {application.companyName}
                                        </p>
                                    )}

                                    <p className="mt-2 text-sm text-zinc-500">
                                        Applied on{" "}
                                        {formatDate(
                                            application.appliedAt,
                                        )}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start gap-3 sm:items-end">
                                    <ApplicationStatusBadge
                                        status={application.status}
                                    />

                                    <Link
                                        href={`/jobs/${application.jobId}`}
                                        className="rounded-lg border bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50"
                                    >
                                        View Job Posting →
                                    </Link>
                                </div>
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
                                            Job
                                        </p>

                                        <p className="mt-1 font-medium">
                                            <Link
                                                href={`/jobs/${application.jobId}`}
                                                className="text-zinc-900 hover:underline"
                                            >
                                                {application.jobTitle} (#{application.jobId})
                                            </Link>
                                        </p>
                                    </div>

                                    {application.companyName && (
                                        <div>
                                            <p className="text-sm text-zinc-500">
                                                Company
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {application.companyName}
                                            </p>
                                        </div>
                                    )}

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
                                                    application.resumeFileName || "Submitted Resume"
                                                }
                                            </p>

                                            <p className="mt-1 text-sm text-zinc-500">
                                                {
                                                    application.resumeFileType || "PDF"
                                                }{" "}
                                                ·{" "}
                                                {formatFileSize(
                                                    application.resumeFileSize || 0,
                                                )}
                                            </p>

                                            {resumeDownloadError && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {resumeDownloadError}
                                                </p>
                                            )}
                                        </div>

                                        {application.resumeId && (
                                            <button
                                                type="button"
                                                onClick={() => handleDownloadResume(application.resumeId, application.resumeFileName)}
                                                disabled={isDownloadingResume}
                                                className="w-fit rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
                                            >
                                                {isDownloadingResume ? "Downloading..." : "View / Download Resume"}
                                            </button>
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
    );
}
