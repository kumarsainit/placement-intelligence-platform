"use client";

import { ResumeCard } from "@/features/resume/components/resume-card";
import type { Resume } from "@/features/resume/types/resume";

interface ResumeListProps {
    resumes: Resume[];
    onView: (resumeId: number) => void;
    onSetPrimary: (resumeId: number) => void;
    onDelete: (resumeId: number) => void;
    settingPrimaryResumeId?: number | null;
    deletingResumeId?: number | null;
}

export function ResumeList({
    resumes,
    onView,
    onSetPrimary,
    onDelete,
    settingPrimaryResumeId = null,
    deletingResumeId = null,
}: ResumeListProps) {
    if (resumes.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-10 text-center">
                <h3 className="text-lg font-semibold">
                    No resumes uploaded yet
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                    Upload your resume to complete your placement
                    profile.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {resumes.map((resume) => (
                <ResumeCard
                    key={resume.id}
                    resume={resume}
                    onView={onView}
                    onSetPrimary={onSetPrimary}
                    onDelete={onDelete}
                    isSettingPrimary={
                        settingPrimaryResumeId === resume.id
                    }
                    isDeleting={
                        deletingResumeId === resume.id
                    }
                />
            ))}
        </div>
    );
}
