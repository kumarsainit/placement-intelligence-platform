"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

        if (!profile) {
            return;
        }

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
            <div className="rounded-xl border p-8">
                <p className="text-sm text-zinc-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    if (profileQuery.isError) {
        return (
            <div className="rounded-xl border border-red-200 p-8">
                <p className="text-sm text-red-600">
                    Failed to load your profile.
                </p>

                <button
                    type="button"
                    onClick={() => profileQuery.refetch()}
                    className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-100"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-xl border bg-white p-8 shadow-sm"
        >
            {/* Personal Information */}

            <section>
                <h2 className="text-lg font-semibold">
                    Personal Information
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <FormField
                        label="Full Name"
                        error={errors.fullName?.message}
                    >
                        <input
                            {...register("fullName")}
                            className="input"
                            placeholder="Enter your full name"
                        />
                    </FormField>

                    <FormField
                        label="College"
                        error={errors.college?.message}
                    >
                        <input
                            {...register("college")}
                            className="input"
                            placeholder="Enter your college"
                        />
                    </FormField>

                    <FormField
                        label="Degree"
                        error={errors.degree?.message}
                    >
                        <input
                            {...register("degree")}
                            className="input"
                            placeholder="e.g. M.Tech"
                        />
                    </FormField>

                    <FormField
                        label="Branch"
                        error={errors.branch?.message}
                    >
                        <input
                            {...register("branch")}
                            className="input"
                            placeholder="e.g. Mathematics & Computing"
                        />
                    </FormField>

                    <FormField
                        label="Graduation Year"
                        error={errors.graduationYear?.message}
                    >
                        <input
                            type="number"
                            {...register("graduationYear", {
                                setValueAs: (value) =>
                                    value === ""
                                        ? undefined
                                        : Number(value),
                            })}
                            className="input"
                            placeholder="2027"
                        />
                    </FormField>

                    <FormField
                        label="CGPA"
                        error={errors.cgpa?.message}
                    >
                        <input
                            type="number"
                            step="0.01"
                            {...register("cgpa", {
                                setValueAs: (value) =>
                                    value === ""
                                        ? undefined
                                        : Number(value),
                            })}
                            className="input"
                            placeholder="8.50"
                        />
                    </FormField>
                </div>
            </section>

            {/* Professional Information */}

            <section>
                <h2 className="text-lg font-semibold">
                    Professional Information
                </h2>

                <div className="mt-6">
                    <FormField
                        label="Bio"
                        error={errors.bio?.message}
                    >
                        <textarea
                            {...register("bio")}
                            rows={5}
                            className="input resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </FormField>
                </div>
            </section>

            {/* Developer Profiles */}

            <section>
                <h2 className="text-lg font-semibold">
                    Developer Profiles
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <FormField
                        label="GitHub"
                        error={errors.githubUrl?.message}
                    >
                        <input
                            {...register("githubUrl")}
                            className="input"
                            placeholder="https://github.com/username"
                        />
                    </FormField>

                    <FormField
                        label="LinkedIn"
                        error={errors.linkedinUrl?.message}
                    >
                        <input
                            {...register("linkedinUrl")}
                            className="input"
                            placeholder="https://linkedin.com/in/username"
                        />
                    </FormField>

                    <FormField
                        label="LeetCode"
                        error={errors.leetcodeUrl?.message}
                    >
                        <input
                            {...register("leetcodeUrl")}
                            className="input"
                            placeholder="https://leetcode.com/username"
                        />
                    </FormField>

                    <FormField
                        label="Codeforces"
                        error={errors.codeforcesUrl?.message}
                    >
                        <input
                            {...register("codeforcesUrl")}
                            className="input"
                            placeholder="https://codeforces.com/profile/username"
                        />
                    </FormField>

                    <div className="md:col-span-2">
                        <FormField
                            label="Portfolio"
                            error={errors.portfolioUrl?.message}
                        >
                            <input
                                {...register("portfolioUrl")}
                                className="input"
                                placeholder="https://yourportfolio.com"
                            />
                        </FormField>
                    </div>
                </div>
            </section>

            {/* Account information */}

            {profileQuery.data?.data && (
                <section className="border-t pt-6">
                    <h2 className="text-lg font-semibold">
                        Account Information
                    </h2>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Username
                            </p>

                            <p className="mt-1 text-sm">
                                {profileQuery.data.data.username}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Phone Number
                            </p>

                            <p className="mt-1 text-sm">
                                {profileQuery.data.data.phoneNumber}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Status */}

            {updateProfileMutation.isSuccess && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                    <p className="text-sm text-green-700">
                        Profile updated successfully.
                    </p>
                </div>
            )}

            {updateProfileMutation.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">
                        Failed to update your profile. Please try again.
                    </p>
                </div>
            )}

            {/* Submit */}

            <div className="flex justify-end border-t pt-6">
                <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {updateProfileMutation.isPending
                        ? "Saving..."
                        : "Save Profile"}
                </button>
            </div>
        </form>
    );
}

interface FormFieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
}

function FormField({
    label,
    error,
    children,
}: FormFieldProps) {
    return (
        <div>
            <label className="text-sm font-medium text-zinc-900">
                {label}
            </label>

            {children}

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
