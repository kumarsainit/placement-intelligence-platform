"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RecruiterCompanyForm } from "@/features/recruiter-company/components/recruiter-company-form";
import { useCreateRecruiterCompany } from "@/features/recruiter-company/hooks/use-create-recruiter-company";

import type { RecruiterCompanyFormValues } from "@/features/recruiter-company/schemas/recruiter-company-schema";

export default function CreateRecruiterCompanyPage() {
    const router = useRouter();

    const createMutation =
        useCreateRecruiterCompany();

    const handleSubmit = (
        values: RecruiterCompanyFormValues,
    ) => {
        createMutation.mutate(
            {
                name: values.name,
                website:
                    values.website || undefined,
                industry:
                    values.industry || undefined,
                description:
                    values.description || undefined,
                location:
                    values.location || undefined,
            },
            {
                onSuccess: (response) => {
                    router.push(
                        `/recruiter/companies/${response.data.id}`,
                    );
                },
            },
        );
    };

    return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <header className="mb-8">
                        <Link
                            href="/recruiter/companies"
                            className="text-sm font-medium hover:underline"
                        >
                            ← Companies
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold">
                            Create Company
                        </h1>

                        <p className="mt-2 text-zinc-600">
                            Add a company that can be
                            associated with recruiter job
                            postings.
                        </p>
                    </header>

                    {createMutation.isError && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {createMutation.error.message}
                        </div>
                    )}

                    <RecruiterCompanyForm
                        isSubmitting={
                            createMutation.isPending
                        }
                        onSubmit={handleSubmit}
                        onCancel={() =>
                            router.push(
                                "/recruiter/companies",
                            )
                        }
                    />
                </div>
            </main>
    );
}
