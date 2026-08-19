"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    Controller,
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import {
    recruiterProfileSchema,
    type RecruiterProfileFormInput,
    type RecruiterProfileFormValues,
} from "@/features/recruiter-profile/schemas/recruiter-profile-schema";

import type {
    RecruiterProfile,
} from "@/features/recruiter-profile/types/recruiter-profile";

import type { Company } from "@/features/jobs/types/job";

interface RecruiterProfileFormProps {
    companies: Company[];
    profile?: RecruiterProfile | null;
    isSubmitting?: boolean;
    onSubmit: (
        values: RecruiterProfileFormValues,
    ) => void;
    onCancel?: () => void;
}

export function RecruiterProfileForm({
                                         companies,
                                         profile = null,
                                         isSubmitting = false,
                                         onSubmit,
                                         onCancel,
                                     }: RecruiterProfileFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<
        RecruiterProfileFormInput,
        unknown,
        RecruiterProfileFormValues
    >({
        resolver: zodResolver(
            recruiterProfileSchema,
        ),
        defaultValues: {
            companyId: profile?.companyId ?? 0,
            designation:
                profile?.designation ?? "",
            department:
                profile?.department ?? "",
            employeeId:
                profile?.employeeId ?? "",
        },
    });

    useEffect(() => {
        reset({
            companyId: profile?.companyId ?? 0,
            designation:
                profile?.designation ?? "",
            department:
                profile?.department ?? "",
            employeeId:
                profile?.employeeId ?? "",
        });
    }, [profile, reset]);

    const submitHandler: SubmitHandler<
        RecruiterProfileFormValues
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
                                typeof field.value ===
                                "number"
                                    ? field.value
                                    : 0
                            }
                            onChange={(event) => {
                                field.onChange(
                                    Number(
                                        event.target
                                            .value,
                                    ),
                                );
                            }}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            className="mt-2 w-full rounded-lg border px-3 py-2"
                        >
                            <option value={0}>
                                Select a company
                            </option>

                            {companies
                                .filter(
                                    (company) =>
                                        company.isActive,
                                )
                                .map((company) => (
                                    <option
                                        key={company.id}
                                        value={company.id}
                                    >
                                        {company.name}
                                    </option>
                                ))}
                        </select>
                    )}
                />

                {errors.companyId && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.companyId.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="designation"
                    className="block text-sm font-medium"
                >
                    Designation
                </label>

                <input
                    id="designation"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    {...register("designation")}
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                />

                {errors.designation && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.designation.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="department"
                    className="block text-sm font-medium"
                >
                    Department
                </label>

                <input
                    id="department"
                    type="text"
                    placeholder="e.g. Engineering"
                    {...register("department")}
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                />

                {errors.department && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.department.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="employeeId"
                    className="block text-sm font-medium"
                >
                    Employee ID
                </label>

                <input
                    id="employeeId"
                    type="text"
                    placeholder="e.g. EMP-1024"
                    {...register("employeeId")}
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                />

                {errors.employeeId && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.employeeId.message}
                    </p>
                )}
            </div>

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
                        : profile
                            ? "Update Profile"
                            : "Create Profile"}
                </button>
            </div>
        </form>
    );
}
