"use client";

import Link from "next/link";

import { useCompanies } from "@/features/jobs/hooks/use-companies";
import { RecruiterProfileForm } from "@/features/recruiter-profile/components/recruiter-profile-form";
import { useCreateRecruiterProfile } from "@/features/recruiter-profile/hooks/use-create-recruiter-profile";
import { useRecruiterProfile } from "@/features/recruiter-profile/hooks/use-recruiter-profile";
import { useUpdateRecruiterProfile } from "@/features/recruiter-profile/hooks/use-update-recruiter-profile";
import type { RecruiterProfileFormValues } from "@/features/recruiter-profile/schemas/recruiter-profile-schema";

export default function RecruiterProfilePage() {
    const profileQuery = useRecruiterProfile();
    const companiesQuery = useCompanies();

    const createMutation =
        useCreateRecruiterProfile();

    const updateMutation =
        useUpdateRecruiterProfile();

    const profile = profileQuery.data?.data ?? null;
    const companies = companiesQuery.data?.data ?? [];

    const isLoading =
        profileQuery.isLoading ||
        companiesQuery.isLoading;

    const isSubmitting =
        createMutation.isPending ||
        updateMutation.isPending;

    const error =
        profileQuery.error ||
        companiesQuery.error ||
        createMutation.error ||
        updateMutation.error;

    const handleSubmit = (
        values: RecruiterProfileFormValues,
    ) => {
        if (profile) {
            updateMutation.mutate(values);
            return;
        }

        createMutation.mutate(values);
    };

    return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <header className="mb-8">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium hover:underline"
                        >
                            ← Dashboard
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold">
                            Recruiter Profile
                        </h1>

                        <p className="mt-2 text-zinc-600">
                            Manage your recruiter information and
                            company association.
                        </p>
                    </header>

                    {isLoading && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <p className="text-zinc-600">
                                Loading recruiter profile...
                            </p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <p className="font-medium text-red-700">
                                Unable to load recruiter profile.
                            </p>

                            <p className="mt-2 text-sm text-red-600">
                                {error.message}
                            </p>
                        </div>
                    )}

                    {!isLoading &&
                        !error &&
                        companies.length === 0 && (
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <h2 className="font-semibold">
                                    No companies available
                                </h2>

                                <p className="mt-2 text-sm text-zinc-600">
                                    A company must be available before
                                    a recruiter profile can be created.
                                </p>
                            </div>
                        )}

                    {!isLoading &&
                        !error &&
                        companies.length > 0 && (
                            <RecruiterProfileForm
                                companies={companies}
                                profile={profile}
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmit}
                            />
                        )}

                    {(createMutation.isSuccess ||
                        updateMutation.isSuccess) && (
                        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            Recruiter profile saved successfully.
                        </div>
                    )}

                    {createMutation.isError && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {createMutation.error.message}
                        </div>
                    )}

                    {updateMutation.isError && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {updateMutation.error.message}
                        </div>
                    )}
                </div>
            </main>
    );
}
