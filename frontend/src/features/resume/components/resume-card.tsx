"use client";

import type { Resume } from "@/features/resume/types/resume";

interface ResumeCardProps {
    resume: Resume;
    onView: (resumeId: number) => void;
    onSetPrimary: (resumeId: number) => void;
    onDelete: (resumeId: number) => void;
    isSettingPrimary?: boolean;
    isDeleting?: boolean;
}

export function ResumeCard({
    resume,
    onView,
    onSetPrimary,
    onDelete,
    isSettingPrimary = false,
    isDeleting = false,
}: ResumeCardProps) {
    const fileSizeMb = (
        resume.fileSize /
        1024 /
        1024
    ).toFixed(2);

    const uploadedAt = new Date(
        resume.uploadedAt,
    ).toLocaleDateString();

    return (
        <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="break-all text-lg font-semibold">
                        {resume.fileName}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                        {resume.fileType} · {fileSizeMb} MB
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                        Uploaded {uploadedAt}
                    </p>
                </div>

                {resume.isPrimary && (
                    <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Primary
                    </span>
                )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => onView(resume.id)}
                    className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
                >
                    View
                </button>

                {!resume.isPrimary && (
                    <button
                        type="button"
                        onClick={() =>
                            onSetPrimary(resume.id)
                        }
                        disabled={
                            isSettingPrimary ||
                            isDeleting
                        }
                        className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSettingPrimary
                            ? "Setting..."
                            : "Set Primary"}
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onDelete(resume.id)}
                    disabled={
                        isSettingPrimary ||
                        isDeleting
                    }
                    className="rounded-lg border px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isDeleting
                        ? "Deleting..."
                        : "Delete"}
                </button>
            </div>
        </article>
    );
}
