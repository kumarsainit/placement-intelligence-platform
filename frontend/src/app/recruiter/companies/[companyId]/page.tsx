"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useRecruiterCompany } from "@/features/recruiter-company/hooks/use-recruiter-company";

function formatDate(value: string) {
    return new Date(value).toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    );
}

export default function RecruiterCompanyPage() {
    const params = useParams();

    const companyId = Number(
        params.companyId,
    );

    const companyQuery =
        useRecruiterCompany(companyId);

    const company =
        companyQuery.data?.data;

    return (
        <AuthGuard>
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
                            Company Details
                        </h1>
                    </header>

                    {companyQuery.isLoading && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            Loading company...
                        </div>
                    )}

                    {companyQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                            <h2 className="font-semibold text-red-700">
                                Unable to load company
                            </h2>

                            <p className="mt-2 text-sm text-red-600">
                                {
                                    companyQuery.error
                                        .message
                                }
                            </p>
                        </div>
                    )}

                    {!companyQuery.isLoading &&
                        !companyQuery.isError &&
                        company && (
                            <div className="space-y-6">
                                <section className="rounded-xl border bg-white p-6 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {company.name}
                                            </h2>

                                            {company.industry && (
                                                <p className="mt-2 text-sm text-zinc-600">
                                                    {
                                                        company.industry
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                company.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-zinc-100 text-zinc-600"
                                            }`}
                                        >
                                            {company.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    {company.description && (
                                        <p className="mt-6 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                                            {
                                                company.description
                                            }
                                        </p>
                                    )}
                                </section>

                                <section className="rounded-xl border bg-white p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold">
                                        Company Information
                                    </h2>

                                    <dl className="mt-4 space-y-4">
                                        {company.website && (
                                            <div>
                                                <dt className="text-sm text-zinc-500">
                                                    Website
                                                </dt>

                                                <dd className="mt-1">
                                                    <a
                                                        href={
                                                            company.website
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm font-medium hover:underline"
                                                    >
                                                        {
                                                            company.website
                                                        }
                                                    </a>
                                                </dd>
                                            </div>
                                        )}

                                        {company.location && (
                                            <div>
                                                <dt className="text-sm text-zinc-500">
                                                    Location
                                                </dt>

                                                <dd className="mt-1 text-sm font-medium">
                                                    {
                                                        company.location
                                                    }
                                                </dd>
                                            </div>
                                        )}

                                        <div>
                                            <dt className="text-sm text-zinc-500">
                                                Created
                                            </dt>

                                            <dd className="mt-1 text-sm font-medium">
                                                {formatDate(
                                                    company.createdAt,
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm text-zinc-500">
                                                Last Updated
                                            </dt>

                                            <dd className="mt-1 text-sm font-medium">
                                                {formatDate(
                                                    company.updatedAt,
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </section>

                                <Link
                                    href="/recruiter/jobs"
                                    className="inline-block text-sm font-medium hover:underline"
                                >
                                    ← Back to Jobs
                                </Link>
                            </div>
                        )}
                </div>
            </main>
        </AuthGuard>
    );
}
