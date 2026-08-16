"use client";

import { ProjectCard } from "@/features/projects/components/project-card";
import type { Project } from "@/features/projects/types/project";

interface ProjectListProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (projectId: number) => void;
    deletingProjectId?: number | null;
}

export function ProjectList({
    projects,
    onEdit,
    onDelete,
    deletingProjectId = null,
}: ProjectListProps) {
    if (projects.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-10 text-center">
                <h3 className="text-lg font-semibold">
                    No projects added yet
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                    Add your academic, personal, or professional
                    projects to strengthen your placement profile.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={
                        deletingProjectId === project.id
                    }
                />
            ))}
        </div>
    );
}
