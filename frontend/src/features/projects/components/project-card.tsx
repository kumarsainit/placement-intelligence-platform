"use client";

import type { Project } from "@/features/projects/types/project";

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (projectId: number) => void;
    isDeleting?: boolean;
}

export function ProjectCard({
    project,
    onEdit,
    onDelete,
    isDeleting = false,
}: ProjectCardProps) {
    const formatDate = (date: string | null) => {
        if (!date) {
            return "Not specified";
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString();
    };

    return (
        <article className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">
                            {project.title}
                        </h3>

                        {project.currentlyWorking && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                Currently Working
                            </span>
                        )}
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                        {project.description}
                    </p>
                </div>

                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(project)}
                        disabled={isDeleting}
                        className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(project.id)}
                        disabled={isDeleting}
                        className="rounded-lg border px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>

            <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Technologies
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-zinc-700">
                    {project.technologies}
                </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-zinc-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Start Date
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {formatDate(project.startDate)}
                    </p>
                </div>

                <div className="rounded-lg bg-zinc-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        End Date
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {project.currentlyWorking
                            ? "Present"
                            : formatDate(project.endDate)}
                    </p>
                </div>
            </div>

            {(project.projectUrl || project.githubUrl) && (
                <div className="mt-5 flex flex-wrap gap-3">
                    {project.projectUrl && (
                        <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
                        >
                            Project
                        </a>
                    )}

                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
                        >
                            GitHub
                        </a>
                    )}
                </div>
            )}
        </article>
    );
}
