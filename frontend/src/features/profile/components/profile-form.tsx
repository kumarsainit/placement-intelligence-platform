"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    User,
    Globe,
    Save,
    Loader2,
    CheckCircle2,
    FileText,
} from "lucide-react";
import {
    profileSchema,
    type ProfileFormValues,
} from "@/features/profile/schemas/profile-schema";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useUpdateProfile } from "@/features/profile/hooks/use-update-profile";

export function ProfileForm() {
    const profileQuery = useProfile();
    const updateProfileMutation = useUpdateProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: "",
            college: "",
            degree: "",
            branch: "",
            graduationYear: undefined,
            cgpa: undefined,
            bio: "",
            githubUrl: "",
            linkedinUrl: "",
            leetcodeUrl: "",
            codeforcesUrl: "",
            portfolioUrl: "",
        },
    });

    useEffect(() => {
        const profile = profileQuery.data?.data;
        if (!profile) return;

        reset({
            fullName: profile.fullName ?? "",
            college: profile.college ?? "",
            degree: profile.degree ?? "",
            branch: profile.branch ?? "",
            graduationYear: profile.graduationYear ?? undefined,
            cgpa: profile.cgpa ?? undefined,
            bio: profile.bio ?? "",
            githubUrl: profile.githubUrl ?? "",
            linkedinUrl: profile.linkedinUrl ?? "",
            leetcodeUrl: profile.leetcodeUrl ?? "",
            codeforcesUrl: profile.codeforcesUrl ?? "",
            portfolioUrl: profile.portfolioUrl ?? "",
        });
    }, [profileQuery.data, reset]);

    const onSubmit = async (values: ProfileFormValues) => {
        await updateProfileMutation.mutateAsync(values);
    };

    if (profileQuery.isLoading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto size-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="mt-3 text-xs font-semibold text-slate-500">
                    Loading profile information...
                </p>
            </div>
        );
    }

    if (profileQuery.isError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/40">
                <p className="text-xs font-bold text-red-700 dark:text-red-300">
                    Failed to load your profile.
                </p>
                <button
                    type="button"
                    onClick={() => profileQuery.refetch()}
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900"
        >
            {/* Status alerts */}
            {updateProfileMutation.isSuccess && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    <span>Your student profile has been saved successfully.</span>
                </div>
            )}

            {updateProfileMutation.isError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-50 p-4 text-xs font-bold text-red-800 dark:bg-red-950/40 dark:text-red-300">
                    Failed to save profile. Please verify your entries and try again.
                </div>
            )}

            {/* Section 1: Academic & Personal Information */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <User className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Personal & Academic Information
                    </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Full Legal Name
                        </label>
                        <input
                            {...register("fullName")}
                            placeholder="e.g. John Doe"
                            className="input"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            College / University Name
                        </label>
                        <input
                            {...register("college")}
                            placeholder="e.g. National Institute of Technology"
                            className="input"
                        />
                        {errors.college && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.college.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Degree Level
                        </label>
                        <input
                            {...register("degree")}
                            placeholder="e.g. B.Tech / M.Tech"
                            className="input"
                        />
                        {errors.degree && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.degree.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Academic Branch / Major
                        </label>
                        <input
                            {...register("branch")}
                            placeholder="e.g. Computer Science & Engineering"
                            className="input"
                        />
                        {errors.branch && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.branch.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Expected Graduation Year
                        </label>
                        <input
                            type="number"
                            {...register("graduationYear", {
                                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                            })}
                            placeholder="e.g. 2026"
                            className="input"
                        />
                        {errors.graduationYear && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.graduationYear.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Cumulative CGPA / Grade
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("cgpa", {
                                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                            })}
                            placeholder="e.g. 8.75"
                            className="input"
                        />
                        {errors.cgpa && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.cgpa.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 2: Bio */}
            <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 pb-2">
                    <FileText className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Career Objective & Bio
                    </h2>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        About You
                    </label>
                    <textarea
                        {...register("bio")}
                        rows={4}
                        placeholder="Write a brief overview of your technical interests, problem-solving passion, and career aspirations..."
                        className="input resize-none"
                    />
                    {errors.bio && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                            {errors.bio.message}
                        </p>
                    )}
                </div>
            </section>

            {/* Section 3: Developer & Portfolio Links */}
            <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 pb-2">
                    <Globe className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Developer Profiles & Portfolio
                    </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            GitHub Profile URL
                        </label>
                        <input
                            {...register("githubUrl")}
                            placeholder="https://github.com/username"
                            className="input"
                        />
                        {errors.githubUrl && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.githubUrl.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            LinkedIn Profile URL
                        </label>
                        <input
                            {...register("linkedinUrl")}
                            placeholder="https://linkedin.com/in/username"
                            className="input"
                        />
                        {errors.linkedinUrl && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.linkedinUrl.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            LeetCode URL
                        </label>
                        <input
                            {...register("leetcodeUrl")}
                            placeholder="https://leetcode.com/username"
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Codeforces URL
                        </label>
                        <input
                            {...register("codeforcesUrl")}
                            placeholder="https://codeforces.com/profile/username"
                            className="input"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Personal Portfolio Website
                        </label>
                        <input
                            {...register("portfolioUrl")}
                            placeholder="https://yourportfolio.dev"
                            className="input"
                        />
                    </div>
                </div>
            </section>

            {/* Submit Action */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                >
                    {updateProfileMutation.isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Saving Changes...</span>
                        </>
                    ) : (
                        <>
                            <Save className="size-4" />
                            <span>Save Profile Changes</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
