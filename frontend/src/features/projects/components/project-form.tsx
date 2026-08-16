"use client";

import { useEffect } from "react";
import {
    useForm,
    type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    projectSchema,
    type ProjectFormValues,
} from "@/features/projects/schemas/project-schema";

import type { Project } from "@/features/projects/types/project";

interface ProjectFormProps {
    editingProject?: Project | null;
    isSubmitting?: boolean;
    onSubmit: (values: ProjectFormValues) => void;
    onCancel?: () => void;
}

export function ProjectForm({
    editingProject = null,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: ProjectFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: editingProject?.title ?? "",
            description:
                editingProject?.description ?? "",
            technologies:
                editingProject?.technologies ?? "",
            projectUrl:
                editingProject?.projectUrl ?? "",
            githubUrl:
                editingProject?.githubUrl ?? "",
            startDate:
                editingProject?.startDate ?? "",
            endDate:
                editingProject?.endDate ?? "",
            currentlyWorking:
                editingProject?.currentlyWorking ?? false,
        },
    });

    useEffect(() => {
        reset({
            title: editingProject?.title ?? "",
            description:
                editingProject?.description ?? "",
            technologies:
                editingProject?.technologies ?? "",
            projectUrl:
                editingProject?.projectUrl ?? "",
            githubUrl:
                editingProject?.githubUrl ?? "",
            startDate:
                editingProject?.startDate ?? "",
            endDate:
                editingProject?.endDate ?? "",
            currentlyWorking:
                editingProject?.currentlyWorking ?? false,
        });
    }, [editingProject, reset]);

    const submitHandler: SubmitHandler<
        ProjectFormValues
    > = (values) => {
        onSubmit(values);
    };

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium"
                >
                    Project Title
                </label>

                <input
                    id="title"
                    type="text"
                    placeholder="e.g. Placement Intelligence Platform"
                    {...register("title")}
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                />

                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    rows={5}
                    placeholder="Describe your project, its purpose, and your contribution."
                    {...register("description")}
                    disabled={isSubmitting}
                    className="mt-2 w-full resize-y rounded-lg border px-3 py-2"
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="technologies"
                    className="block text-sm font-medium"
                >
                    Technologies
                </label>

                <textarea
                    id="technologies"
                    rows={3}
                    placeholder="e.g. Java, Spring Boot, React, PostgreSQL"
                    {...register("technologies")}
                    disabled={isSubmitting}
                    className="mt-2 w-full resize-y rounded-lg border px-3 py-2"
                />

                {errors.technologies && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.technologies.message}
                    </p>
                )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="projectUrl"
                        className="block text-sm font-medium"
                    >
                        Project URL
                    </label>

                    <input
                        id="projectUrl"
                        type="text"
                        placeholder="https://example.com"
                        {...register("projectUrl")}
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.projectUrl && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.projectUrl.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="githubUrl"
                        className="block text-sm font-medium"
                    >
                        GitHub URL
                    </label>

                    <input
                        id="githubUrl"
                        type="text"
                        placeholder="https://github.com/username/repository"
                        {...register("githubUrl")}
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.githubUrl && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.githubUrl.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="startDate"
                        className="block text-sm font-medium"
                    >
                        Start Date
                    </label>

                    <input
                        id="startDate"
                        type="date"
                        {...register("startDate")}
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.startDate.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="endDate"
                        className="block text-sm font-medium"
                    >
                        End Date
                    </label>

                    <input
                        id="endDate"
                        type="date"
                        {...register("endDate")}
                        disabled={
                            isSubmitting
                        }
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.endDate && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.endDate.message}
                        </p>
                    )}
                </div>
            </div>

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    {...register("currentlyWorking")}
                    disabled={isSubmitting}
                    className="h-4 w-4"
                />

                <span className="text-sm font-medium">
                    I am currently working on this project
                </span>
            </label>

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Saving..."
                        : editingProject
                            ? "Update Project"
                            : "Add Project"}
                </button>
            </div>
        </form>
    );
}
