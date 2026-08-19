"use client";

import Link from "next/link";

import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";

import type { JobApplication } from "@/features/applications/types/application";

interface ApplicationCardProps {
    application: JobApplication;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function ApplicationCard({
                                    application,
                                }: ApplicationCardProps) {
    return (
        <article className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold">
                        {application.jobTitle}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                        Application #{application.id}
                    </p>
                </div>

                <ApplicationStatusBadge
                    status={application.status}
                />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs text-zinc-500">
                        Resume
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {application.resumeFileName}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-zinc-500">
                        Applied On
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {formatDate(application.appliedAt)}
                    </p>
                </div>
            </div>

            {application.coverLetter && (
                <div className="mt-5">
                    <p className="text-xs text-zinc-500">
                        Cover Letter
                    </p>

                    <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-zinc-700">
                        {application.coverLetter}
                    </p>
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <Link
                    href={`/applications/${application.id}`}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                >
                    View Application
                </Link>
            </div>
        </article>
    );
}
