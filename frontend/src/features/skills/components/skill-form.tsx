"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    Controller,
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import {
    skillSchema,
    type SkillFormInput,
    type SkillFormValues,
} from "@/features/skills/schemas/skill-schema";

import type {
    Skill,
    UserSkill,
} from "@/features/skills/types/skill";

interface SkillFormProps {
    skills: Skill[];
    editingSkill?: UserSkill | null;
    isSubmitting?: boolean;
    onSubmit: (values: SkillFormValues) => void;
    onCancel?: () => void;
}

export function SkillForm({
    skills,
    editingSkill = null,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: SkillFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<
        SkillFormInput,
        unknown,
        SkillFormValues
    >({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            skillId: editingSkill?.skillId ?? 0,
            proficiency: editingSkill?.proficiency ?? "",
            yearsOfExperience:
                editingSkill?.yearsOfExperience ?? undefined,
        },
    });

    useEffect(() => {
        reset({
            skillId: editingSkill?.skillId ?? 0,
            proficiency: editingSkill?.proficiency ?? "",
            yearsOfExperience:
                editingSkill?.yearsOfExperience ?? undefined,
        });
    }, [editingSkill, reset]);

    const submitHandler: SubmitHandler<SkillFormValues> = (
        values,
    ) => {
        onSubmit(values);
    };

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <label
                    htmlFor="skillId"
                    className="block text-sm font-medium"
                >
                    Skill
                </label>

                <Controller
                    name="skillId"
                    control={control}
                    render={({ field }) => (
                        <select
                            id="skillId"
                            value={
                                typeof field.value === "number"
                                    ? field.value
                                    : 0
                            }
                            onChange={(event) => {
                                field.onChange(
                                    Number(event.target.value),
                                );
                            }}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            className="mt-2 w-full rounded-lg border px-3 py-2"
                        >
                            <option value={0}>
                                Select a skill
                            </option>

                            {skills
                                .filter((skill) => skill.isActive)
                                .map((skill) => (
                                    <option
                                        key={skill.id}
                                        value={skill.id}
                                    >
                                        {skill.name} — {skill.category}
                                    </option>
                                ))}
                        </select>
                    )}
                />

                {errors.skillId && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.skillId.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="proficiency"
                    className="block text-sm font-medium"
                >
                    Proficiency
                </label>

                <input
                    id="proficiency"
                    type="text"
                    placeholder="e.g. Beginner, Intermediate, Advanced"
                    {...register("proficiency")}
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                />

                {errors.proficiency && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.proficiency.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="yearsOfExperience"
                    className="block text-sm font-medium"
                >
                    Years of Experience
                </label>

                <input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    max="99.99"
                    step="0.01"
                    placeholder="e.g. 2.5"
                    {...register("yearsOfExperience", {
                        setValueAs: (value) =>
                            value === ""
                                ? undefined
                                : Number(value),
                    })}
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                />

                {errors.yearsOfExperience && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.yearsOfExperience.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
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
                        : editingSkill
                            ? "Update Skill"
                            : "Add Skill"}
                </button>
            </div>
        </form>
    );
}
