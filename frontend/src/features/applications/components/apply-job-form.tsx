"use client";

import { useEffect } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import {
    applicationSchema,
    type ApplicationFormValues,
} from "@/features/applications/schemas/application-schema";

import { useResumes } from "@/features/resume/hooks/use-resumes";

interface ApplyJobFormProps {
    isSubmitting?: boolean;
    onSubmit: (
        values: ApplicationFormValues,
    ) => void;
    onCancel?: () => void;
}

export function ApplyJobForm({
                                 isSubmitting = false,
                                 onSubmit,
                                 onCancel,
                             }: ApplyJobFormProps) {
    const resumesQuery = useResumes();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            resumeId: 0,
            coverLetter: "",
        },
    });

    const resumes = resumesQuery.data?.data;

    useEffect(() => {
        if (!resumes || resumes.length === 0) {
            return;
        }

        if (getValues("resumeId") === 0) {
            const primaryResume =
                resumes.find((resume) => resume.isPrimary) ?? resumes[0];
            if (primaryResume) {
                setValue("resumeId", primaryResume.id, {
                    shouldValidate: true,
                });
            }
        }
    }, [resumes, getValues, setValue]);

    const submitHandler: SubmitHandler<
        ApplicationFormValues
    > = (values) => {
        onSubmit(values);
    };

    const resumeList = resumes ?? [];
    const hasResumes = resumeList.length > 0;

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <h2 className="text-xl font-semibold">
                    Apply for this job
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Select a resume and optionally add a
                    cover letter.
                </p>
            </div>

            <div>
                <label
                    htmlFor="resumeId"
                    className="block text-sm font-medium"
                >
                    Resume
                </label>

                {resumesQuery.isLoading && (
                    <div className="mt-2 rounded-lg border bg-zinc-50 p-3 text-sm text-zinc-500">
                        Loading your resumes...
                    </div>
                )}

                {resumesQuery.isError && (
                    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        Unable to load your resumes.
                        Please try again.
                    </div>
                )}

                {!resumesQuery.isLoading &&
                    !resumesQuery.isError &&
                    !hasResumes && (
                        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm text-amber-700">
                                You don&apos;t have any resumes
                                uploaded yet.
                            </p>

                            <p className="mt-1 text-sm text-amber-600">
                                Please upload a resume before
                                applying for this job.
                            </p>

                            <Link
                                href="/resume"
                                className="mt-3 inline-block rounded-lg bg-black px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800"
                            >
                                Upload Resume →
                            </Link>
                        </div>
                    )}

                {!resumesQuery.isLoading &&
                    !resumesQuery.isError &&
                    hasResumes && (
                        <select
                            id="resumeId"
                            {...register(
                                "resumeId",
                                {
                                    setValueAs: (
                                        value,
                                    ) =>
                                        Number(value),
                                },
                            )}
                            disabled={isSubmitting}
                            className="mt-2 w-full rounded-lg border px-3 py-2"
                        >
                            <option value={0}>
                                Select a resume
                            </option>

                            {resumeList.map((resume) => (
                                <option
                                    key={resume.id}
                                    value={resume.id}
                                >
                                    {resume.fileName}
                                    {resume.isPrimary
                                        ? " — Primary"
                                        : ""}
                                </option>
                            ))}
                        </select>
                    )}

                {errors.resumeId && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.resumeId.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="coverLetter"
                    className="block text-sm font-medium"
                >
                    Cover Letter
                    <span className="ml-1 font-normal text-zinc-400">
                        (Optional)
                    </span>
                </label>

                <textarea
                    id="coverLetter"
                    rows={8}
                    maxLength={5000}
                    placeholder="Tell the recruiter why you are a good fit for this position..."
                    {...register("coverLetter")}
                    disabled={isSubmitting}
                    className="mt-2 w-full resize-y rounded-lg border px-3 py-2"
                />

                {errors.coverLetter && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.coverLetter.message}
                    </p>
                )}

                <p className="mt-1 text-right text-xs text-zinc-400">
                    Maximum 5000 characters
                </p>
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
                    disabled={
                        isSubmitting ||
                        resumesQuery.isLoading ||
                        resumesQuery.isError ||
                        !hasResumes
                    }
                    className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Submitting..."
                        : "Submit Application"}
                </button>
            </div>
        </form>
    );
}
