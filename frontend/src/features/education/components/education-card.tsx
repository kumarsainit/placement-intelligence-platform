"use client";

import type { UserEducation } from "@/features/education/types/education";

interface EducationCardProps {
    education: UserEducation;
    onEdit: (education: UserEducation) => void;
    onDelete: (id: number) => void;
    deleting?: boolean;
}

const educationLevelLabels: Record<string, string> = {
    TENTH: "10th",
    TWELFTH: "12th",
    DIPLOMA: "Diploma",
    BACHELOR: "Bachelor's",
    MASTER: "Master's",
    PHD: "PhD",
    OTHER: "Other",
};

export function EducationCard({
    education,
    onEdit,
    onDelete,
    deleting = false,
}: EducationCardProps) {
    return (
        <article className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-zinc-500">
                        {educationLevelLabels[
                            education.educationLevel
                        ] ?? education.educationLevel}
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                        {education.degree ||
                            education.fieldOfStudy ||
                            "Education"}
                    </h3>

                    <p className="mt-1 text-zinc-700">
                        {education.institution}
                    </p>
                </div>

                {education.currentlyPursuing && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Currently Pursuing
                    </span>
                )}
            </div>

            {education.fieldOfStudy && education.degree && (
                <p className="mt-3 text-sm text-zinc-600">
                    Field of Study: {education.fieldOfStudy}
                </p>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-600">
                {(education.startYear ||
                    education.endYear ||
                    education.currentlyPursuing) && (
                    <span>
                        {education.startYear ?? "—"} -{" "}
                        {education.currentlyPursuing
                            ? "Present"
                            : education.endYear ?? "—"}
                    </span>
                )}

                {education.cgpa !== null && (
                    <span>
                        CGPA: {education.cgpa}
                    </span>
                )}

                {education.percentage !== null && (
                    <span>
                        Percentage: {education.percentage}%
                    </span>
                )}
            </div>

            <div className="mt-6 flex gap-3 border-t pt-4">
                <button
                    type="button"
                    onClick={() => onEdit(education)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(education.id)}
                    disabled={deleting}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </article>
    );
}
