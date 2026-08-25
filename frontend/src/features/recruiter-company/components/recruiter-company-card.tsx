import Link from "next/link";

import type { RecruiterCompany } from "@/features/recruiter-company/types/recruiter-company";

interface RecruiterCompanyCardProps {
    company: RecruiterCompany;
}

export function RecruiterCompanyCard({
                                         company,
                                     }: RecruiterCompanyCardProps) {
    return (
        <article className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        {company.name}
                    </h2>

                    {company.industry && (
                        <p className="mt-1 text-sm text-zinc-500">
                            {company.industry}
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

            {company.location && (
                <p className="mt-4 text-sm text-zinc-600">
                    📍 {company.location}
                </p>
            )}

            {company.description && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
                    {company.description}
                </p>
            )}

            <div className="mt-5 flex items-center gap-4">
                <Link
                    href={`/recruiter/companies/${company.id}`}
                    className="text-sm font-medium hover:underline"
                >
                    View Details →
                </Link>

                {company.website && (
                    <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium hover:underline"
                    >
                        Website ↗
                    </a>
                )}
            </div>
        </article>
    );
}
