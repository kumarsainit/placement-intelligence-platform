import Link from "next/link";

import type { RecruiterApplication } from "@/features/recruiter-applications/types/recruiter-application";

interface RecruiterApplicationCardProps {
    application: RecruiterApplication;
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    );
}

export function RecruiterApplicationCard({
                                             application,
                                         }: RecruiterApplicationCardProps) {
    return (
        <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        {application.applicantUsername}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-600">
                        Applied for{" "}
                        <span className="font-medium text-zinc-900">
                            {application.jobTitle}
                        </span>
                    </p>
                </div>

                <span className="inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium">
                    {application.status}
                </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                    <p className="text-zinc-500">
                        Applied
                    </p>

                    <p className="mt-1 font-medium">
                        {formatDate(
                            application.appliedAt,
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-zinc-500">
                        Resume
                    </p>

                    <a
                        href={
                            application.resumeFileUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block font-medium hover:underline"
                    >
                        {application.resumeFileName}
                    </a>
                </div>
            </div>

            {application.coverLetter && (
                <div className="mt-5">
                    <p className="text-sm text-zinc-500">
                        Cover Letter
                    </p>

                    <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-zinc-700">
                        {application.coverLetter}
                    </p>
                </div>
            )}

            <div className="mt-5 border-t pt-4">
                <Link
                    href={`/recruiter/applications/${application.id}`}
                    className="text-sm font-medium hover:underline"
                >
                    View Application →
                </Link>
            </div>
        </article>
    );
}
