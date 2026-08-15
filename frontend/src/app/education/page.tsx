"use client";

import { useState } from "react";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { EducationForm } from "@/features/education/components/education-form";
import { EducationList } from "@/features/education/components/education-list";
import { useAddEducation } from "@/features/education/hooks/use-add-education";
import { useDeleteEducation } from "@/features/education/hooks/use-delete-education";
import { useEducations } from "@/features/education/hooks/use-educations";
import { useUpdateEducation } from "@/features/education/hooks/use-update-education";

import type {
    AddUserEducationRequest,
    UserEducation,
} from "@/features/education/types/education";

export default function EducationPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingEducation, setEditingEducation] =
        useState<UserEducation | null>(null);

    const educationsQuery = useEducations();
    const addEducationMutation = useAddEducation();
    const updateEducationMutation = useUpdateEducation();
    const deleteEducationMutation = useDeleteEducation();

    const handleAdd = () => {
        setEditingEducation(null);
        setShowForm(true);
    };

    const handleEdit = (education: UserEducation) => {
        setEditingEducation(education);
        setShowForm(true);
    };

    const handleCancel = () => {
        setEditingEducation(null);
        setShowForm(false);
    };

    const handleSubmit = (
        request: AddUserEducationRequest,
    ) => {
        if (editingEducation) {
            updateEducationMutation.mutate(
                {
                    id: editingEducation.id,
                    request,
                },
                {
                    onSuccess: () => {
                        handleCancel();
                    },
                },
            );

            return;
        }

        addEducationMutation.mutate(request, {
            onSuccess: () => {
                handleCancel();
            },
        });
    };

    const handleDelete = (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this education record?",
        );

        if (!confirmed) {
            return;
        }

        deleteEducationMutation.mutate(id);
    };

    const isSubmitting =
        addEducationMutation.isPending ||
        updateEducationMutation.isPending;

    return (
        <AuthGuard>
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Education
                            </h1>

                            <p className="mt-2 text-zinc-600">
                                Manage your educational qualifications.
                            </p>
                        </div>

                        {!showForm && (
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                + Add Education
                            </button>
                        )}
                    </header>

                    {showForm ? (
                        <EducationForm
                            education={editingEducation}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isSubmitting={isSubmitting}
                        />
                    ) : (
                        <>
                            {educationsQuery.isLoading && (
                                <div className="rounded-xl border p-8 text-center">
                                    <p className="text-sm text-zinc-500">
                                        Loading education records...
                                    </p>
                                </div>
                            )}

                            {educationsQuery.isError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                                    <h2 className="font-semibold text-red-800">
                                        Unable to load education
                                    </h2>

                                    <p className="mt-1 text-sm text-red-700">
                                        Please try again.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            educationsQuery.refetch()
                                        }
                                        className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {educationsQuery.isSuccess && (
                                <EducationList
                                    educations={
                                        educationsQuery.data.data
                                    }
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    deletingId={
                                        deleteEducationMutation.isPending
                                            ? deleteEducationMutation.variables
                                            : null
                                    }
                                />
                            )}
                        </>
                    )}
                </div>
            </main>
        </AuthGuard>
    );
}
