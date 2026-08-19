"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Controller,
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import {
    jobSearchSchema,
    type JobSearchFormInput,
    type JobSearchFormValues,
} from "@/features/jobs/schemas/job-search-schema";

import {
    EMPLOYMENT_TYPES,
    EXPERIENCE_LEVELS,
} from "@/features/jobs/types/job";

import type { Company } from "@/features/jobs/types/job";

interface JobSearchFiltersProps {
    companies: Company[];
    initialValues?: JobSearchFormValues;
    onSearch: (values: JobSearchFormValues) => void;
}

export function JobSearchFilters({
                                     companies,
                                     initialValues,
                                     onSearch,
                                 }: JobSearchFiltersProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<
        JobSearchFormInput,
        unknown,
        JobSearchFormValues
    >({
        resolver: zodResolver(jobSearchSchema),
        defaultValues: {
            keyword: initialValues?.keyword ?? "",
            location: initialValues?.location ?? "",
            companyId: initialValues?.companyId,
            employmentType:
            initialValues?.employmentType,
            experienceLevel:
            initialValues?.experienceLevel,
            minSalary: initialValues?.minSalary,
            maxSalary: initialValues?.maxSalary,
            page: initialValues?.page ?? 0,
            size: initialValues?.size ?? 10,
        },
    });

    const submitHandler: SubmitHandler<JobSearchFormValues> = (
        values,
    ) => {
        onSearch({
            ...values,
            page: 0,
        });
    };

    const handleClear = () => {
        reset({
            keyword: "",
            location: "",
            companyId: undefined,
            employmentType: undefined,
            experienceLevel: undefined,
            minSalary: undefined,
            maxSalary: undefined,
            page: 0,
            size: 10,
        });

        onSearch({
            page: 0,
            size: 10,
        });
    };

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label
                        htmlFor="keyword"
                        className="block text-sm font-medium"
                    >
                        Keyword
                    </label>

                    <input
                        id="keyword"
                        type="text"
                        placeholder="e.g. Java Developer"
                        {...register("keyword")}
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.keyword && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.keyword.message}
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
                        placeholder="e.g. Bangalore"
                        {...register("location")}
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.location && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.location.message}
                        </p>
                    )}
                </div>

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
                                    field.value === undefined
                                        ? ""
                                        : String(field.value)
                                }
                                onChange={(event) => {
                                    const value = event.target.value;

                                    field.onChange(
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                    );
                                }}
                                onBlur={field.onBlur}
                                className="mt-2 w-full rounded-lg border px-3 py-2"
                            >
                                <option value="">
                                    All Companies
                                </option>

                                {companies.map((company) => (
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
                        htmlFor="employmentType"
                        className="block text-sm font-medium"
                    >
                        Employment Type
                    </label>

                    <Controller
                        name="employmentType"
                        control={control}
                        render={({ field }) => (
                            <select
                                id="employmentType"
                                value={
                                    typeof field.value ===
                                    "string"
                                        ? field.value
                                        : ""
                                }
                                onChange={(event) => {
                                    field.onChange(
                                        event.target.value ===
                                        ""
                                            ? undefined
                                            : event.target
                                                .value,
                                    );
                                }}
                                onBlur={field.onBlur}
                                className="mt-2 w-full rounded-lg border px-3 py-2"
                            >
                                <option value="">
                                    All Types
                                </option>

                                {EMPLOYMENT_TYPES.map(
                                    (type) => (
                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type.replace(
                                                /_/g,
                                                " ",
                                            )}
                                        </option>
                                    ),
                                )}
                            </select>
                        )}
                    />

                    {errors.employmentType && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors.employmentType
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
                        render={({ field }) => (
                            <select
                                id="experienceLevel"
                                value={
                                    typeof field.value ===
                                    "string"
                                        ? field.value
                                        : ""
                                }
                                onChange={(event) => {
                                    field.onChange(
                                        event.target.value ===
                                        ""
                                            ? undefined
                                            : event.target
                                                .value,
                                    );
                                }}
                                onBlur={field.onBlur}
                                className="mt-2 w-full rounded-lg border px-3 py-2"
                            >
                                <option value="">
                                    All Levels
                                </option>

                                {EXPERIENCE_LEVELS.map(
                                    (level) => (
                                        <option
                                            key={level}
                                            value={level}
                                        >
                                            {level.replace(
                                                /_/g,
                                                " ",
                                            )}
                                        </option>
                                    ),
                                )}
                            </select>
                        )}
                    />

                    {errors.experienceLevel && (
                        <p className="mt-1 text-sm text-red-600">
                            {
                                errors.experienceLevel
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="minSalary"
                        className="block text-sm font-medium"
                    >
                        Minimum Salary
                    </label>

                    <input
                        id="minSalary"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 500000"
                        {...register("minSalary", {
                            setValueAs: (value) =>
                                value === ""
                                    ? undefined
                                    : Number(value),
                        })}
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.minSalary && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.minSalary.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="maxSalary"
                        className="block text-sm font-medium"
                    >
                        Maximum Salary
                    </label>

                    <input
                        id="maxSalary"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 1500000"
                        {...register("maxSalary", {
                            setValueAs: (value) =>
                                value === ""
                                    ? undefined
                                    : Number(value),
                        })}
                        className="mt-2 w-full rounded-lg border px-3 py-2"
                    />

                    {errors.maxSalary && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.maxSalary.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                >
                    Clear
                </button>

                <button
                    type="submit"
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                    Search Jobs
                </button>
            </div>
        </form>
    );
}
