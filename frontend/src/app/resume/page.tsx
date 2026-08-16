"use client";

import { useState } from "react";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ResumeList } from "@/features/resume/components/resume-list";
import { ResumeUploadForm } from "@/features/resume/components/resume-upload-form";
import { getResumeFile } from "@/features/resume/api/resume-api";
import { useDeleteResume } from "@/features/resume/hooks/use-delete-resume";
import { useResumes } from "@/features/resume/hooks/use-resumes";
import { useSetPrimaryResume } from "@/features/resume/hooks/use-set-primary-resume";
import { useUploadResume } from "@/features/resume/hooks/use-upload-resume";

export default function ResumePage() {
    const [viewingResumeId, setViewingResumeId] =
        useState<number | null>(null);

    const resumesQuery = useResumes();
    const uploadResumeMutation = useUploadResume();
    const setPrimaryResumeMutation =
        useSetPrimaryResume();
    const deleteResumeMutation = useDeleteResume();

    const handleUpload = (
        file: File,
        isPrimary: boolean,
    ) => {
        uploadResumeMutation.mutate({
            file,
            isPrimary,
        });
    };

    const handleView = async (resumeId: number) => {
        try {
            setViewingResumeId(resumeId);

            const blob = await getResumeFile(resumeId);
            const url = URL.createObjectURL(blob);

            window.open(url, "_blank", "noopener,noreferrer");

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 60_000);
        } catch {
            window.alert(
                "Unable to open the resume. Please try again.",
            );
        } finally {
            setViewingResumeId(null);
        }
    };

    const handleSetPrimary = (resumeId: number) => {
        setPrimaryResumeMutation.mutate(resumeId);
    };

    const handleDelete = (resumeId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resume?",
        );

        if (!confirmed) {
            return;
        }

        deleteResumeMutation.mutate(resumeId);
    };

    const isLoading = resumesQuery.isLoading;
    const error = resumesQuery.error;

    const settingPrimaryResumeId =
        setPrimaryResumeMutation.isPending
            ? setPrimaryResumeMutation.variables
            : null;

    const deletingResumeId =
        deleteResumeMutation.isPending
            ? deleteResumeMutation.variables
            : null;

    return (
        <AuthGuard>
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold">
                            Resume Management
                        </h1>

                        <p className="mt-2 text-zinc-600">
                            Upload and manage the resumes used for
                            your placement profile.
                        </p>
                    </header>

                    <section className="mb-8">
                        <h2 className="mb-4 text-xl font-semibold">
                            Upload Resume
                        </h2>

                        <ResumeUploadForm
                            isSubmitting={
                                uploadResumeMutation.isPending
                            }
                            onSubmit={handleUpload}
                        />

                        {uploadResumeMutation.error && (
                            <p className="mt-3 text-sm text-red-600">
                                {uploadResumeMutation.error.message}
                            </p>
                        )}
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">
                                My Resumes
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Manage your uploaded resumes and
                                choose your primary resume.
                            </p>
                        </div>

                        {isLoading && (
                            <div className="rounded-xl border p-8 text-center">
                                <p className="text-sm text-zinc-500">
                                    Loading resumes...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                                <p className="text-sm text-red-600">
                                    Unable to load resumes. Please
                                    try again.
                                </p>
                            </div>
                        )}

                        {!isLoading && !error && (
                            <ResumeList
                                resumes={
                                    resumesQuery.data?.data ?? []
                                }
                                onView={handleView}
                                onSetPrimary={
                                    handleSetPrimary
                                }
                                onDelete={handleDelete}
                                settingPrimaryResumeId={
                                    settingPrimaryResumeId
                                }
                                deletingResumeId={
                                    deletingResumeId
                                }
                            />
                        )}

                        {viewingResumeId !== null && (
                            <p className="mt-3 text-sm text-zinc-500">
                                Opening resume...
                            </p>
                        )}

                        {setPrimaryResumeMutation.error && (
                            <p className="mt-3 text-sm text-red-600">
                                {
                                    setPrimaryResumeMutation
                                        .error.message
                                }
                            </p>
                        )}

                        {deleteResumeMutation.error && (
                            <p className="mt-3 text-sm text-red-600">
                                {
                                    deleteResumeMutation
                                        .error.message
                                }
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </AuthGuard>
    );
}
