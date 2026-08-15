"use client";

import { useState } from "react";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { SkillForm } from "@/features/skills/components/skill-form";
import { SkillList } from "@/features/skills/components/skill-list";
import { useAddSkill } from "@/features/skills/hooks/use-add-skill";
import { useDeleteSkill } from "@/features/skills/hooks/use-delete-skill";
import { useSkills } from "@/features/skills/hooks/use-skills";
import { useUpdateSkill } from "@/features/skills/hooks/use-update-skill";
import { useUserSkills } from "@/features/skills/hooks/use-user-skills";

import type {
    SkillFormValues,
} from "@/features/skills/schemas/skill-schema";

import type {
    UserSkill,
} from "@/features/skills/types/skill";

export default function SkillsPage() {
    const [editingSkill, setEditingSkill] =
        useState<UserSkill | null>(null);

    const [showForm, setShowForm] = useState(false);

    const skillsQuery = useSkills();
    const userSkillsQuery = useUserSkills();

    const addSkillMutation = useAddSkill();
    const updateSkillMutation = useUpdateSkill();
    const deleteSkillMutation = useDeleteSkill();

    const handleSubmit = (values: SkillFormValues) => {
        if (editingSkill) {
            updateSkillMutation.mutate(
                {
                    userSkillId: editingSkill.id,
                    request: values,
                },
                {
                    onSuccess: () => {
                        setEditingSkill(null);
                        setShowForm(false);
                    },
                },
            );

            return;
        }

        addSkillMutation.mutate(values, {
            onSuccess: () => {
                setShowForm(false);
            },
        });
    };

    const handleEdit = (skill: UserSkill) => {
        setEditingSkill(skill);
        setShowForm(true);
    };

    const handleDelete = (skillId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this skill?",
        );

        if (!confirmed) {
            return;
        }

        deleteSkillMutation.mutate(skillId);
    };

    const handleCancel = () => {
        setEditingSkill(null);
        setShowForm(false);
    };

    const isSubmitting =
        addSkillMutation.isPending ||
        updateSkillMutation.isPending;

    const isLoading =
        skillsQuery.isLoading ||
        userSkillsQuery.isLoading;

    const error =
        skillsQuery.error ||
        userSkillsQuery.error;

    return (
        <AuthGuard>
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Student Skills
                            </h1>

                            <p className="mt-2 text-zinc-600">
                                Manage your technical and
                                professional skills.
                            </p>
                        </div>

                        {!showForm && (
                            <button
                                type="button"
                                onClick={() => setShowForm(true)}
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Add Skill
                            </button>
                        )}
                    </header>

                    {showForm && (
                        <section className="mb-8">
                            <h2 className="mb-4 text-xl font-semibold">
                                {editingSkill
                                    ? "Edit Skill"
                                    : "Add Skill"}
                            </h2>

                            <SkillForm
                                skills={
                                    skillsQuery.data?.data ?? []
                                }
                                editingSkill={editingSkill}
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                            />
                        </section>
                    )}

                    {isLoading && (
                        <div className="rounded-xl border p-8 text-center">
                            <p className="text-sm text-zinc-500">
                                Loading skills...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                            <p className="text-sm text-red-600">
                                Unable to load skills. Please try
                                again.
                            </p>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <section>
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">
                                    My Skills
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Skills added to your placement
                                    profile.
                                </p>
                            </div>

                            <SkillList
                                skills={
                                    userSkillsQuery.data?.data ?? []
                                }
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                deletingSkillId={
                                    deleteSkillMutation.isPending
                                        ? deleteSkillMutation.variables
                                        : null
                                }
                            />
                        </section>
                    )}
                </div>
            </main>
        </AuthGuard>
    );
}
