"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";

import { ProjectForm } from "@/features/projects/components/project-form";
import { ProjectList } from "@/features/projects/components/project-list";
import { useAddProject } from "@/features/projects/hooks/use-add-project";
import { useDeleteProject } from "@/features/projects/hooks/use-delete-project";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useUpdateProject } from "@/features/projects/hooks/use-update-project";

import type { ProjectFormValues } from "@/features/projects/schemas/project-schema";
import type { Project } from "@/features/projects/types/project";

export default function ProjectsPage() {
    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    const [showForm, setShowForm] = useState(false);

    const projectsQuery = useProjects();

    const addProjectMutation = useAddProject();
    const updateProjectMutation = useUpdateProject();
    const deleteProjectMutation = useDeleteProject();

    const handleSubmit = (values: ProjectFormValues) => {
        if (editingProject) {
            updateProjectMutation.mutate(
                {
                    projectId: editingProject.id,
                    request: values,
                },
                {
                    onSuccess: () => {
                        setEditingProject(null);
                        setShowForm(false);
                    },
                },
            );

            return;
        }

        addProjectMutation.mutate(values, {
            onSuccess: () => {
                setShowForm(false);
            },
        });
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleDelete = (projectId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?",
        );

        if (!confirmed) {
            return;
        }

        deleteProjectMutation.mutate(projectId);
    };

    const handleCancel = () => {
        setEditingProject(null);
        setShowForm(false);
    };

    const isSubmitting =
        addProjectMutation.isPending ||
        updateProjectMutation.isPending;

    const isLoading = projectsQuery.isLoading;

    const error = projectsQuery.error;

    const mutationError =
        addProjectMutation.error ||
        updateProjectMutation.error ||
        deleteProjectMutation.error;

    return (
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Student Projects
                            </h1>

                            <p className="mt-2 text-zinc-600">
                                Manage the projects that showcase
                                your experience and skills.
                            </p>
                        </div>

                        {!showForm && (
                            <button
                                type="button"
                                onClick={() => setShowForm(true)}
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Add Project
                            </button>
                        )}
                    </header>

                    {showForm && (
                        <section className="mb-8">
                            <h2 className="mb-4 text-xl font-semibold">
                                {editingProject
                                    ? "Edit Project"
                                    : "Add Project"}
                            </h2>

                            <ProjectForm
                                editingProject={editingProject}
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                            />
                        </section>
                    )}

                    {mutationError && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
                            <p className="text-sm text-red-600">
                                {mutationError.message}
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="rounded-xl border p-8 text-center">
                            <p className="text-sm text-zinc-500">
                                Loading projects...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                            <p className="text-sm text-red-600">
                                Unable to load projects. Please try
                                again.
                            </p>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <section>
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">
                                    My Projects
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Projects added to your placement
                                    profile.
                                </p>
                            </div>

                            <ProjectList
                                projects={
                                    projectsQuery.data?.data ?? []
                                }
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                deletingProjectId={
                                    deleteProjectMutation.isPending
                                        ? deleteProjectMutation.variables
                                        : null
                                }
                            />
                        </section>
                    )}
                </div>
            </main>
    );
}
