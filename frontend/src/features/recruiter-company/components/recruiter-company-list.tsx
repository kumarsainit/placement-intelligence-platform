import Link from "next/link";

import { RecruiterCompanyCard } from "@/features/recruiter-company/components/recruiter-company-card";

import type { RecruiterCompany } from "@/features/recruiter-company/types/recruiter-company";

interface RecruiterCompanyListProps {
    companies: RecruiterCompany[];
}

export function RecruiterCompanyList({
                                         companies,
                                     }: RecruiterCompanyListProps) {
    if (companies.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-lg font-semibold">
                    No companies found
                </h2>

                <p className="mt-2 text-sm text-zinc-600">
                    Create your first company to use it
                    for job postings.
                </p>

                <Link
                    href="/recruiter/companies/new"
                    className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    Create Company
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {companies.map((company) => (
                <RecruiterCompanyCard
                    key={company.id}
                    company={company}
                />
            ))}
        </div>
    );
}
