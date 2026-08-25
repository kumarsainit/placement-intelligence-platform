"use client";

import Link from "next/link";

import { RecruiterCompanyList } from "@/features/recruiter-company/components/recruiter-company-list";
import { useRecruiterCompanies } from "@/features/recruiter-company/hooks/use-recruiter-companies";

export default function RecruiterCompaniesPage() {
    const companiesQuery =
        useRecruiterCompanies();

    const companies =
        companiesQuery.data?.data ?? [];

    return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Link
                                href="/recruiter/jobs"
                                className="text-sm font-medium hover:underline"
                            >
                                ← My Jobs
                            </Link>

                            <h1 className="mt-4 text-3xl font-bold">
                                Companies
                            </h1>

                            <p className="mt-2 text-zinc-600">
                                Manage the companies available
                                for your job postings.
                            </p>
                        </div>

                        <Link
                            href="/recruiter/companies/new"
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            Create Company
                        </Link>
                    </header>

                    {companiesQuery.isLoading && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            Loading companies...
                        </div>
                    )}

                    {companiesQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h2 className="font-semibold text-red-700">
                                Unable to load companies
                            </h2>

                            <p className="mt-2 text-sm text-red-600">
                                {
                                    companiesQuery.error
                                        .message
                                }
                            </p>
                        </div>
                    )}

                    {!companiesQuery.isLoading &&
                        !companiesQuery.isError && (
                            <RecruiterCompanyList
                                companies={companies}
                            />
                        )}
                </div>
            </main>
    );
}
