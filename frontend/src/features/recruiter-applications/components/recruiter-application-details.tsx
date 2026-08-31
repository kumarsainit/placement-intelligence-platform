"use client";

import { useState } from "react";
import Link from "next/link";

import { RecruiterApplicationStatusSelect } from "@/features/recruiter-applications/components/recruiter-application-status-select";
import { useUpdateApplicationStatus } from "@/features/recruiter-applications/hooks/use-update-application-status";
import { getRecruiterApplicationResumeFile } from "@/features/recruiter-applications/api/recruiter-application-api";
import type {
    ApplicationStatus,
    RecruiterApplication,
} from "@/features/recruiter-applications/types/recruiter-application";

interface RecruiterApplicationDetailsProps {
    application: RecruiterApplication;
}

function formatDate(value: string) {
    return new Date(value).toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    );
}

export function RecruiterApplicationDetails({
                                                application,
                                            }: RecruiterApplicationDetailsProps) {
    const updateStatusMutation =
        useUpdateApplicationStatus();

    const [isDownloadingResume, setIsDownloadingResume] = useState(false);
    const [resumeDownloadError, setResumeDownloadError] = useState<string | null>(null);

    const handleDownloadResume = async () => {
        try {
            setIsDownloadingResume(true);
            setResumeDownloadError(null);
            const blob = await getRecruiterApplicationResumeFile(application.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noreferrer";
            a.download = application.resumeFileName || `resume-app-${application.id}.pdf`;
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

    const handleStatusChange = (
        status: ApplicationStatus,
    ) => {
        if (status === application.status) {
            return;
        }

        updateStatusMutation.mutate({
            applicationId: application.id,
            request: {
                status,
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Application Header */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm text-zinc-500">
                            Applicant
                        </p>

                        <h1 className="mt-1 text-2xl font-bold">
                            {application.applicantUsername}
                        </h1>

                        <p className="mt-2 text-sm text-zinc-600">
                            Applied for{" "}
                            <span className="font-medium text-zinc-900">
                                {application.jobTitle}
                            </span>
                        </p>
                    </div>

                    <div>
                        <p className="mb-2 text-sm text-zinc-500">
                            Application Status
                        </p>

                        <RecruiterApplicationStatusSelect
                            value={application.status}
                            onChange={handleStatusChange}
                            disabled={
                                updateStatusMutation.isPending
                            }
                        />
                    </div>
                </div>

                {updateStatusMutation.isError && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {updateStatusMutation.error.message}
                    </div>
                )}

                {updateStatusMutation.isSuccess && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        Application status updated successfully.
                    </div>
                )}
            </div>

            {/* Resume */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    Resume
                </h2>

                <div className="mt-4 rounded-lg border p-4">
                    <p className="font-medium">
                        {application.resumeFileName || "Candidate Resume"}
                    </p>

                    <div className="mt-1 text-sm text-zinc-500">
                        {application.resumeFileType || "PDF"} ·{" "}
                        {application.resumeFileSize?.toLocaleString() || "0"}{" "}
                        bytes
                    </div>

                    {resumeDownloadError && (
                        <div className="mt-2 text-sm text-red-600">
                            {resumeDownloadError}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleDownloadResume}
                        disabled={isDownloadingResume}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                        {isDownloadingResume ? "Downloading..." : "View / Download Resume →"}
                    </button>
                </div>
            </div>

            {/* Cover Letter */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    Cover Letter
                </h2>

                {application.coverLetter ? (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                        {application.coverLetter}
                    </p>
                ) : (
                    <p className="mt-4 text-sm text-zinc-500">
                        No cover letter was provided.
                    </p>
                )}
            </div>

            {/* Application Information */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    Application Information
                </h2>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-zinc-500">
                            Application ID
                        </dt>

                        <dd className="mt-1 font-medium">
                            {application.id}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-sm text-zinc-500">
                            Job ID
                        </dt>

                        <dd className="mt-1 font-medium">
                            {application.jobId}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-sm text-zinc-500">
                            Applied At
                        </dt>

                        <dd className="mt-1 font-medium">
                            {formatDate(application.appliedAt)}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-sm text-zinc-500">
                            Last Updated
                        </dt>

                        <dd className="mt-1 font-medium">
                            {formatDate(application.updatedAt)}
                        </dd>
                    </div>
                </dl>
            </div>

            {/* Back Navigation */}
            <Link
                href={`/recruiter/jobs/${application.jobId}/applications`}
                className="inline-block text-sm font-medium hover:underline"
            >
                ← Back to Applications
            </Link>
        </div>
    );
}
