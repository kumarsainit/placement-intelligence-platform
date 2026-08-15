"use client";

import type { UserSkill } from "@/features/skills/types/skill";

interface SkillCardProps {
    skill: UserSkill;
    onEdit: (skill: UserSkill) => void;
    onDelete: (skillId: number) => void;
    isDeleting?: boolean;
}

export function SkillCard({
    skill,
    onEdit,
    onDelete,
    isDeleting = false,
}: SkillCardProps) {
    return (
        <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        {skill.skillName}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                        {skill.category}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(skill)}
                        className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(skill.id)}
                        disabled={isDeleting}
                        className="rounded-lg border px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-zinc-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Proficiency
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {skill.proficiency || "Not specified"}
                    </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Experience
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {skill.yearsOfExperience != null
                            ? `${skill.yearsOfExperience} years`
                            : "Not specified"}
                    </p>
                </div>
            </div>
        </article>
    );
}
