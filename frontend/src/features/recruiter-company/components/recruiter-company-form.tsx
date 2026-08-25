"use client";

import {
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    recruiterCompanySchema,
} from "@/features/recruiter-company/schemas/recruiter-company-schema";

import type {
    RecruiterCompanyFormValues,
} from "@/features/recruiter-company/schemas/recruiter-company-schema";

interface RecruiterCompanyFormProps {
    isSubmitting?: boolean;
    onSubmit: (
        values: RecruiterCompanyFormValues,
    ) => void;
    onCancel?: () => void;
}

export function RecruiterCompanyForm({
                                         isSubmitting = false,
                                         onSubmit,
                                         onCancel,
                                     }: RecruiterCompanyFormProps) {
    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm<RecruiterCompanyFormValues>({
        resolver: zodResolver(
            recruiterCompanySchema,
        ),
        defaultValues: {
            name: "",
            website: "",
            industry: "",
            description: "",
            location: "",
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium"
                >
                    Company Name
                </label>

                <input
                    id="name"
                    {...register("name")}
                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                    placeholder="Company name"
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="website"
                    className="block text-sm font-medium"
                >
                    Website
                </label>

                <input
                    id="website"
                    {...register("website")}
                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                    placeholder="https://example.com"
                />

                {errors.website && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.website.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="industry"
                    className="block text-sm font-medium"
                >
                    Industry
                </label>

                <input
                    id="industry"
                    {...register("industry")}
                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                    placeholder="Software, Finance, Consulting..."
                />

                {errors.industry && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.industry.message}
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
                    {...register("location")}
                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                    placeholder="Bengaluru, India"
                />

                {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.location.message}
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
                    {...register("description")}
                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                    placeholder="Describe the company..."
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-100"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Creating..."
                        : "Create Company"}
                </button>
            </div>
        </form>
    );
}
