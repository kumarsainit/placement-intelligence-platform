"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    Controller,
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import type {
    Company,
} from "@/features/jobs/types/job";

import {
    recruiterJobFormSchema,
    type RecruiterJobFormInput,
    type RecruiterJobFormValues,
} from "@/features/recruiter-jobs/schemas/recruiter-job-schema";

import type {
    RecruiterJob,
} from "@/features/recruiter-jobs/types/recruiter-job";

interface RecruiterJobFormProps {
    companies: Company[];
    job?: RecruiterJob | null;
    isSubmitting?: boolean;
    onSubmit: (
        values: RecruiterJobFormValues,
    ) => void;
    onCancel?: () => void;
}

const EMPLOYMENT_TYPE_OPTIONS = [
    {
        value: "FULL_TIME",
        label: "Full Time",
    },
    {
        value: "PART_TIME",
        label: "Part Time",
    },
    {
        value: "INTERNSHIP",
        label: "Internship",
    },
    {
        value: "CONTRACT",
        label: "Contract",
    },
    {
        value: "TEMPORARY",
        label: "Temporary",
    },
] as const;

const EXPERIENCE_LEVEL_OPTIONS = [
    {
        value: "ENTRY_LEVEL",
        label: "Entry Level",
    },
    {
        value: "MID_LEVEL",
        label: "Mid Level",
    },
    {
        value: "SENIOR_LEVEL",
        label: "Senior Level",
    },
    {
        value: "LEAD",
        label: "Lead",
    },
] as const;

const JOB_STATUS_OPTIONS = [
    {
        value: "DRAFT",
        label: "Draft",
    },
    {
        value: "OPEN",
        label: "Open",
    },
    {
        value: "CLOSED",
        label: "Closed",
    },
] as const;

function formatDateForInput(
    value?: string | null,
) {
    if (!value) {
        return "";
    }

    return value.slice(0, 10);
}

export function RecruiterJobForm({
                                     companies,
                                     job = null,
                                     isSubmitting = false,
                                     onSubmit,
                                     onCancel,
                                 }: RecruiterJobFormProps) {
    const isEditing = Boolean(job);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<
        RecruiterJobFormInput,
        unknown,
        RecruiterJobFormValues
    >({
        resolver: zodResolver(
            recruiterJobFormSchema,
        ),
        defaultValues: {
            companyId:
                job?.companyId ?? 0,
            title:
                job?.title ?? "",
            description:
                job?.description ?? "",
            location:
                job?.location ?? "",
            employmentType:
                job?.employmentType ??
                "FULL_TIME",
            experienceLevel:
                job?.experienceLevel ??
                "ENTRY_LEVEL",
            salaryMin:
                job?.salaryMin ??
                undefined,
            salaryMax:
                job?.salaryMax ??
                undefined,
            openings:
                job?.openings ?? 1,
            applicationDeadline:
                formatDateForInput(
                    job?.applicationDeadline,
                ),
            status:
                job?.status ??
                "DRAFT",
        },
    });

    useEffect(() => {
        reset({
            companyId:
                job?.companyId ?? 0,
            title:
                job?.title ?? "",
            description:
                job?.description ?? "",
            location:
                job?.location ?? "",
            employmentType:
                job?.employmentType ??
                "FULL_TIME",
            experienceLevel:
                job?.experienceLevel ??
                "ENTRY_LEVEL",
            salaryMin:
                job?.salaryMin ??
                undefined,
            salaryMax:
                job?.salaryMax ??
                undefined,
            openings:
                job?.openings ?? 1,
            applicationDeadline:
                formatDateForInput(
                    job?.applicationDeadline,
                ),
            status:
                job?.status ??
                "DRAFT",
        });
    }, [job, reset]);

    const submitHandler: SubmitHandler<
        RecruiterJobFormValues
    > = (values) => {
        onSubmit(values);
    };

    return (
        <form
            onSubmit={handleSubmit(
                submitHandler,
            )}
            className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <label
                    htmlFor="companyId"
                    className="block text-sm font-medium"
                >
                    Company
                </label>

                <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                        <select
                            id="companyId"
                            value={
                                field.value ?? 0
                            }
                            onChange={(
                                event,
                            ) => {
                                field.onChange(
                                    Number(
                                        event
                                            .target
                                            .value,
                                    ),
                                );
                            }}
                            onBlur={
                                field.onBlur
                            }
                            disabled={
                                isSubmitting
                            }
                            className="mt-2 w-full rounded-lg border px-3 py-2"
                        >
                            <option value={0}>
                                Select a company
                            </option>

                            {companies
                                .filter(
                                    (
                                        company,
                                    ) =>
                                        company.isActive,
                                )
                                .map(
                                    (
                                        company,
                                    ) => (
                                        <option
                                            key={
                                                company.id
                                            }
                                            value={
                                                company.id
                                            }
                                        >
                                            {
                                                company.name
                                            }
                                        </option>
                                    ),
                                )}
                        </select>
                    )}
                />

                {errors.companyId && (
                    <p className="mt-1 text-sm text-red-600">
                        {
                            errors
                                .companyId
                                .message
                        }
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium"
                >
                    Job Title
                </label>

                <input
                    id="title"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    {...register(
                        "title",
                    )}
                    disabled={
                        isSubmitting
                    }
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                />

                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                        {
                            errors.title
                                .message
                        }
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium"
                >
                    Job Description
                </label>

                <textarea
                    id="description"
                    rows={7}
                    placeholder="Describe the role, responsibilities, and requirements."
                    {...register(
                        "description",
                    )}
                    disabled={
                        isSubmitting
                    }
                    className="mt-2 w-full resize-y rounded-lg border px-3 py-2"
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {
                            errors
                                .description
                                .message
                        }
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="location"
                    className="block text-sm font-medium"
                >
                    Location
                </label>

                <input
                    id="location"
                    type="text"
                    placeholder="e.g. Bengaluru, India"
                    {...register(
                        "location",
                    )}
                    disabled={
                        isSubmitting
                    }
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                />

                {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                        {
                            errors.location
                                .message
                        }
                    </p>
                )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="employmentType"
                        className="block text-sm font-medium"
                    >
                        Employment Type
                    </label>

                    <Controller
                        name="employmentType"
                        control={control}
                        render={({
                                     field,
                                 }) => (
                            <select
                                id="employmentType"
                                value={
                                    field.value
                                }
                                onChange={
                                    field.onChange
                                }
                                onBlur={
                                    field.onBlur
                                }
                                disabled={
                                    isSubmitting
                                }
                                className="mt-2 w-full rounded-lg border px-3 py-2"
                            >
                                {EMPLOYMENT_TYPE_OPTIONS.map(
                                    (
                                        option,
                                    ) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        )}
                    />

                    {errors.employmentType && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors
                                    .employmentType
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="experienceLevel"
                        className="block text-sm font-medium"
                    >
                        Experience Level
                    </label>

                    <Controller
                        name="experienceLevel"
                        control={control}
                        render={({
                                     field,
                                 }) => (
                            <select
                                id="experienceLevel"
                                value={
                                    field.value
                                }
                                onChange={
                                    field.onChange
                                }
                                onBlur={
                                    field.onBlur
                                }
                                disabled={
                                    isSubmitting
                                }
                                className="mt-2 w-full rounded-lg border px-3 py-2"
                            >
                                {EXPERIENCE_LEVEL_OPTIONS.map(
                                    (
                                        option,
                                    ) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        )}
                    />

                    {errors.experienceLevel && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors
                                    .experienceLevel
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="salaryMin"
                        className="block text-sm font-medium"
                    >
                        Minimum Salary
                    </label>

                    <input
                        id="salaryMin"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 600000"
                        {...register(
                            "salaryMin",
                            {
                                setValueAs:
                                    (
                                        value,
                                    ) =>
                                        value ===
                                        ""
                                            ? undefined
                                            : Number(
                                                value,
                                            ),
                            },
                        )}
                        disabled={
                            isSubmitting
                        }
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.salaryMin && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors
                                    .salaryMin
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="salaryMax"
                        className="block text-sm font-medium"
                    >
                        Maximum Salary
                    </label>

                    <input
                        id="salaryMax"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1000000"
                        {...register(
                            "salaryMax",
                            {
                                setValueAs:
                                    (
                                        value,
                                    ) =>
                                        value ===
                                        ""
                                            ? undefined
                                            : Number(
                                                value,
                                            ),
                            },
                        )}
                        disabled={
                            isSubmitting
                        }
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.salaryMax && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors
                                    .salaryMax
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="openings"
                        className="block text-sm font-medium"
                    >
                        Number of Openings
                    </label>

                    <input
                        id="openings"
                        type="number"
                        min="1"
                        step="1"
                        {...register(
                            "openings",
                            {
                                setValueAs:
                                    (
                                        value,
                                    ) =>
                                        value ===
                                        ""
                                            ? undefined
                                            : Number(
                                                value,
                                            ),
                            },
                        )}
                        disabled={
                            isSubmitting
                        }
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.openings && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors
                                    .openings
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="applicationDeadline"
                        className="block text-sm font-medium"
                    >
                        Application Deadline
                    </label>

                    <input
                        id="applicationDeadline"
                        type="date"
                        {...register(
                            "applicationDeadline",
                        )}
                        disabled={
                            isSubmitting
                        }
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.applicationDeadline && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors
                                    .applicationDeadline
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>

            {isEditing && (
                <div>
                    <label
                        htmlFor="status"
                        className="block text-sm font-medium"
                    >
                        Job Status
                    </label>

                    <Controller
                        name="status"
                        control={control}
                        render={({
                                     field,
                                 }) => (
                            <select
                                id="status"
                                value={
                                    field.value ??
                                    "DRAFT"
                                }
                                onChange={
                                    field.onChange
                                }
                                onBlur={
                                    field.onBlur
                                }
                                disabled={
                                    isSubmitting
                                }
                                className="mt-2 w-full rounded-lg border px-3 py-2"
                            >
                                {JOB_STATUS_OPTIONS.map(
                                    (
                                        option,
                                    ) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        )}
                    />

                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors
                                    .status
                                    .message
                            }
                        </p>
                    )}
                </div>
            )}

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={
                            isSubmitting
                        }
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={
                        isSubmitting
                    }
                    className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Saving..."
                        : isEditing
                            ? "Update Job"
                            : "Create Job"}
                </button>
            </div>
        </form>
    );
}
