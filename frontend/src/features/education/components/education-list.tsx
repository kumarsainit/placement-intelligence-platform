"use client";

import type { UserEducation } from "@/features/education/types/education";
import { EducationCard } from "@/features/education/components/education-card";

interface EducationListProps {
    educations: UserEducation[];
    onEdit: (education: UserEducation) => void;
    onDelete: (id: number) => void;
    deletingId?: number | null;
}

export function EducationList({
    educations,
    onEdit,
    onDelete,
    deletingId = null,
}: EducationListProps) {
    if (educations.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-8 text-center">
                <h3 className="font-semibold">
                    No education records yet
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                    Add your educational qualifications to
                    build your student profile.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {educations.map((education) => (
                <EducationCard
                    key={education.id}
                    education={education}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    deleting={deletingId === education.id}
                />
            ))}
        </div>
    );
}
