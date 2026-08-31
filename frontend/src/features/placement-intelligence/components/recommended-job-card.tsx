import React from "react";
import Link from "next/link";
import { MatchScoreBadge } from "@/features/placement-intelligence/components/match-score-badge";
import type { JobRecommendation } from "@/features/placement-intelligence/types/recommendation";

interface RecommendedJobCardProps {
    recommendation: JobRecommendation;
    onViewDetails?: (jobId: number) => void;
}

function formatEnum(value: string) {
    return value
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatSalary(salaryMin: number | null, salaryMax: number | null) {
    if (salaryMin === null && salaryMax === null) {
        return null;
    }

    if (salaryMin !== null && salaryMax !== null) {
        return `₹${salaryMin.toLocaleString()} - ₹${salaryMax.toLocaleString()}`;
    }

    if (salaryMin !== null) {
        return `From ₹${salaryMin.toLocaleString()}`;
    }

    return `Up to ₹${salaryMax!.toLocaleString()}`;
}

export function RecommendedJobCard({
    recommendation,
    onViewDetails,
}: RecommendedJobCardProps) {
    const { job, matchScore, matchGrade, matchedSkills, missingSkills, hasApplied, applicationStatus } = recommendation;
    const salary = formatSalary(job.salaryMin, job.salaryMax);

    return (
        <article className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className="space-y-4">
                {/* Header: Title, Company, Score Badge */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <Link
                            href={`/jobs/${job.id}`}
                            className="text-base font-bold text-zinc-950 transition group-hover:text-zinc-700 dark:text-white dark:group-hover:text-zinc-300"
                        >
                            {job.title}
                        </Link>
                        <p className="mt-0.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                            {job.companyName}
                        </p>
                    </div>

                    <MatchScoreBadge score={matchScore} grade={matchGrade} />
                </div>

                {/* Job Metadata Chips */}
                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    <span className="rounded-md bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">
                        📍 {job.location}
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">
                        {formatEnum(job.employmentType)}
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">
                        {formatEnum(job.experienceLevel)}
                    </span>
                    {salary && (
                        <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            💰 {salary}
                        </span>
                    )}
                </div>

                {/* Matched Skills & Skill Gaps */}
                {(matchedSkills.length > 0 || missingSkills.length > 0) && (
                    <div className="space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
                        {matchedSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                    Matched:
                                </span>
                                {matchedSkills.slice(0, 4).map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-md border border-emerald-200 bg-emerald-50/70 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                                    >
                                        ✓ {skill}
                                    </span>
                                ))}
                                {matchedSkills.length > 4 && (
                                    <span className="text-[10px] text-zinc-400">
                                        +{matchedSkills.length - 4} more
                                    </span>
                                )}
                            </div>
                        )}

                        {missingSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                    Skill gaps:
                                </span>
                                {missingSkills.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {missingSkills.length > 3 && (
                                    <span className="text-[10px] text-zinc-400">
                                        +{missingSkills.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Actions and Status */}
            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <div>
                    {hasApplied ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            ✓ Applied {applicationStatus ? `(${formatEnum(applicationStatus)})` : ""}
                        </span>
                    ) : (
                        <span className="text-xs text-zinc-400">
                            {job.openings} open position{job.openings === 1 ? "" : "s"}
                        </span>
                    )}
                </div>

                {onViewDetails ? (
                    <button
                        type="button"
                        onClick={() => onViewDetails(job.id)}
                        className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                        View Job →
                    </button>
                ) : (
                    <Link
                        href={`/jobs/${job.id}`}
                        className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                        View Job →
                    </Link>
                )}
            </div>
        </article>
    );
}
