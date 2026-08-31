import React from "react";
import Link from "next/link";
import type { StudentPlacementInsights } from "@/features/placement-intelligence/types/recommendation";

interface StudentInsightsCardProps {
    insights: StudentPlacementInsights;
}

export function StudentInsightsCard({ insights }: StudentInsightsCardProps) {
    const {
        profileCompleteness,
        totalSkills,
        totalProjects,
        hasPrimaryResume,
        eligibleJobsCount,
        matchedJobsCount,
        topInDemandSkills,
    } = insights;

    return (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Placement Intelligence Insights
                    </div>
                    <h2 className="mt-1.5 text-lg font-bold text-zinc-950 dark:text-white">
                        Your Candidate Placement Readiness
                    </h2>
                </div>

                <Link
                    href="/profile"
                    className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                    Improve Profile Readiness →
                </Link>
            </div>

            {/* Metrics Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <p className="text-[11px] font-medium text-zinc-500">Profile Readiness</p>
                    <p className="mt-1 text-2xl font-extrabold text-zinc-950 dark:text-white">
                        {profileCompleteness}%
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${profileCompleteness}%` }}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <p className="text-[11px] font-medium text-zinc-500">Active Skills</p>
                    <p className="mt-1 text-2xl font-extrabold text-zinc-950 dark:text-white">
                        {totalSkills}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-400">Recorded on profile</p>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <p className="text-[11px] font-medium text-zinc-500">Projects</p>
                    <p className="mt-1 text-2xl font-extrabold text-zinc-950 dark:text-white">
                        {totalProjects}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-400">Technical portfolio</p>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <p className="text-[11px] font-medium text-zinc-500">Primary Resume</p>
                    <p className="mt-1 text-base font-bold text-zinc-900 dark:text-white">
                        {hasPrimaryResume ? (
                            <span className="text-emerald-600 dark:text-emerald-400">✓ Uploaded</span>
                        ) : (
                            <span className="text-amber-600 dark:text-amber-400">Pending</span>
                        )}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-400">Recruiter ready</p>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <p className="text-[11px] font-medium text-zinc-500">Eligible Drives</p>
                    <p className="mt-1 text-2xl font-extrabold text-zinc-950 dark:text-white">
                        {eligibleJobsCount}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-400">Open opportunities</p>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <p className="text-[11px] font-medium text-zinc-500">High Match Jobs</p>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {matchedJobsCount}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-400">Suitable matches</p>
                </div>
            </div>

            {/* In-Demand Placement Skills */}
            {topInDemandSkills && topInDemandSkills.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Top skills in active recruitment drives:
                    </span>
                    {topInDemandSkills.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
