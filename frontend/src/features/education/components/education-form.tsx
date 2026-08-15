"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    useForm,
    useWatch,
} from "react-hook-form";

import {
    educationSchema,
    type EducationFormValues,
} from "@/features/education/schemas/education-schema";

import {
    EDUCATION_LEVELS,
    type UserEducation,
    type AddUserEducationRequest,
} from "@/features/education/types/education";

interface EducationFormProps {
    education?: UserEducation | null;
    onSubmit: (
        request: AddUserEducationRequest,
    ) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const educationLevelLabels: Record<
    (typeof EDUCATION_LEVELS)[number],
    string
> = {
    TENTH: "10th",
    TWELFTH: "12th",
    DIPLOMA: "Diploma",
    BACHELOR: "Bachelor's",
    MASTER: "Master's",
    PHD: "PhD",
    OTHER: "Other",
};

export function EducationForm({
    education,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: EducationFormProps) {
    const isEditing = Boolean(education);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<EducationFormValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            educationLevel:
                education?.educationLevel ?? undefined,
            degree: education?.degree ?? "",
            institution: education?.institution ?? "",
            fieldOfStudy:
                education?.fieldOfStudy ?? "",
            startYear:
                education?.startYear ?? undefined,
            endYear:
                education?.endYear ?? undefined,
            cgpa: education?.cgpa ?? undefined,
            percentage:
                education?.percentage ?? undefined,
            currentlyPursuing:
                education?.currentlyPursuing ?? false,
        },
    });

    const currentlyPursuing = useWatch({
        control,
        name: "currentlyPursuing",
    });

    const cgpa = useWatch({
        control,
        name: "cgpa",
    });

    const percentage = useWatch({
        control,
        name: "percentage",
    });

    useEffect(() => {
        if (!education) {
            reset({
                educationLevel: undefined,
                degree: "",
                institution: "",
                fieldOfStudy: "",
                startYear: undefined,
                endYear: undefined,
                cgpa: undefined,
                percentage: undefined,
                currentlyPursuing: false,
            });

            return;
        }

        reset({
            educationLevel: education.educationLevel,
            degree: education.degree ?? "",
            institution: education.institution,
            fieldOfStudy:
                education.fieldOfStudy ?? "",
            startYear:
                education.startYear ?? undefined,
            endYear:
                education.endYear ?? undefined,
            cgpa: education.cgpa ?? undefined,
            percentage:
                education.percentage ?? undefined,
            currentlyPursuing:
                education.currentlyPursuing,
        });
    }, [education, reset]);

    useEffect(() => {
        if (currentlyPursuing) {
            setValue("endYear", undefined);
        }
    }, [currentlyPursuing, setValue]);

    useEffect(() => {
        if (cgpa !== undefined && cgpa !== null) {
            setValue("percentage", undefined);
        }
    }, [cgpa, setValue]);

    useEffect(() => {
        if (
            percentage !== undefined &&
            percentage !== null
        ) {
            setValue("cgpa", undefined);
        }
    }, [percentage, setValue]);

    const submitForm = (
        values: EducationFormValues,
    ) => {
        const request: AddUserEducationRequest = {
            educationLevel:
                values.educationLevel as AddUserEducationRequest["educationLevel"],
            institution: values.institution,
            currentlyPursuing:
                values.currentlyPursuing,
        };

        if (values.degree) {
            request.degree = values.degree;
        }

        if (values.fieldOfStudy) {
            request.fieldOfStudy =
                values.fieldOfStudy;
        }

        if (values.startYear !== undefined) {
            request.startYear = values.startYear;
        }

        if (
            values.endYear !== undefined &&
            !values.currentlyPursuing
        ) {
            request.endYear = values.endYear;
        }

        if (values.cgpa !== undefined) {
            request.cgpa = values.cgpa;
        }

        if (values.percentage !== undefined) {
            request.percentage =
                values.percentage;
        }

        onSubmit(request);
    };

    return (
        <form
            onSubmit={handleSubmit(submitForm)}
            className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <h2 className="text-xl font-semibold">
                    {isEditing
                        ? "Edit Education"
                        : "Add Education"}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Add your educational qualification
                    details.
                </p>
            </div>

            {/* Education Level */}

            <div>
                <label
                    htmlFor="educationLevel"
                    className="mb-2 block text-sm font-medium"
                >
                    Education Level
                </label>

                <select
                    id="educationLevel"
                    {...register("educationLevel")}
                    className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                >
                    <option value="">
                        Select education level
                    </option>

                    {EDUCATION_LEVELS.map((level) => (
                        <option
                            key={level}
                            value={level}
                        >
                            {educationLevelLabels[level]}
                        </option>
                    ))}
                </select>

                {errors.educationLevel && (
                    <p className="mt-1 text-sm text-red-600">
                        {
                            errors.educationLevel
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Degree */}

            <div>
                <label
                    htmlFor="degree"
                    className="mb-2 block text-sm font-medium"
                >
                    Degree
                </label>

                <input
                    id="degree"
                    {...register("degree")}
                    placeholder="e.g. M.Tech"
                    className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                />

                {errors.degree && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.degree.message}
                    </p>
                )}
            </div>

            {/* Institution */}

            <div>
                <label
                    htmlFor="institution"
                    className="mb-2 block text-sm font-medium"
                >
                    Institution
                </label>

                <input
                    id="institution"
                    {...register("institution")}
                    placeholder="e.g. NIT Jalandhar"
                    className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                />

                {errors.institution && (
                    <p className="mt-1 text-sm text-red-600">
                        {
                            errors.institution
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Field of Study */}

            <div>
                <label
                    htmlFor="fieldOfStudy"
                    className="mb-2 block text-sm font-medium"
                >
                    Field of Study
                </label>

                <input
                    id="fieldOfStudy"
                    {...register("fieldOfStudy")}
                    placeholder="e.g. Mathematics & Computing"
                    className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                />

                {errors.fieldOfStudy && (
                    <p className="mt-1 text-sm text-red-600">
                        {
                            errors.fieldOfStudy
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Years */}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="startYear"
                        className="mb-2 block text-sm font-medium"
                    >
                        Start Year
                    </label>

                    <input
                        id="startYear"
                        type="number"
                        {...register("startYear", {
                            valueAsNumber: true,
                        })}
                        placeholder="e.g. 2025"
                        className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                    />

                    {errors.startYear && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors.startYear
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="endYear"
                        className="mb-2 block text-sm font-medium"
                    >
                        End Year
                    </label>

                    <input
                        id="endYear"
                        type="number"
                        disabled={currentlyPursuing}
                        {...register("endYear", {
                            valueAsNumber: true,
                        })}
                        placeholder={
                            currentlyPursuing
                                ? "Currently pursuing"
                                : "e.g. 2027"
                        }
                        className="w-full rounded-lg border px-3 py-2.5 outline-none disabled:bg-zinc-100 disabled:text-zinc-400 focus:ring-2 focus:ring-zinc-300"
                    />

                    {errors.endYear && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors.endYear
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* Currently Pursuing */}

            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    {...register(
                        "currentlyPursuing",
                    )}
                    className="h-4 w-4"
                />

                <span className="text-sm font-medium">
                    I am currently pursuing this
                    education
                </span>
            </label>

            {/* Academic Score */}

            <div>
                <p className="mb-3 text-sm font-medium">
                    Academic Score
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="cgpa"
                            className="mb-2 block text-sm text-zinc-600"
                        >
                            CGPA
                        </label>

                        <input
                            id="cgpa"
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            {...register("cgpa", {
                                valueAsNumber: true,
                            })}
                            placeholder="e.g. 8.50"
                            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                        />

                        {errors.cgpa && (
                            <p className="mt-1 text-sm text-red-600">
                                {
                                    errors.cgpa
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="percentage"
                            className="mb-2 block text-sm text-zinc-600"
                        >
                            Percentage
                        </label>

                        <input
                            id="percentage"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            {...register(
                                "percentage",
                                {
                                    valueAsNumber: true,
                                },
                            )}
                            placeholder="e.g. 85.50"
                            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                        />

                        {errors.percentage && (
                            <p className="mt-1 text-sm text-red-600">
                                {
                                    errors
                                        .percentage
                                        .message
                                }
                            </p>
                        )}
                    </div>
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                    Enter either CGPA or percentage,
                    not both.
                </p>
            </div>

            {/* Actions */}

            <div className="flex justify-end gap-3 border-t pt-5">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Saving..."
                        : isEditing
                          ? "Update Education"
                          : "Add Education"}
                </button>
            </div>
        </form>
    );
}
