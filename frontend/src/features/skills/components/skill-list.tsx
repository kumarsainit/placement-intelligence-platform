"use client";

import { SkillCard } from "@/features/skills/components/skill-card";
import type { UserSkill } from "@/features/skills/types/skill";

interface SkillListProps {
    skills: UserSkill[];
    onEdit: (skill: UserSkill) => void;
    onDelete: (skillId: number) => void;
    deletingSkillId?: number | null;
}

export function SkillList({
    skills,
    onEdit,
    onDelete,
    deletingSkillId = null,
}: SkillListProps) {
    if (skills.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-10 text-center">
                <h3 className="text-lg font-semibold">
                    No skills added yet
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                    Add your technical and professional skills to
                    build your placement profile.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {skills.map((skill) => (
                <SkillCard
                    key={skill.id}
                    skill={skill}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={deletingSkillId === skill.id}
                />
            ))}
        </div>
    );
}
