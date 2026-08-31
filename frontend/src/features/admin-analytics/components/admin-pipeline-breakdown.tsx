import React from "react";
import type { AdminAnalytics } from "@/features/admin-analytics/types/admin-analytics";

interface AdminPipelineBreakdownProps {
    analytics: AdminAnalytics;
}

export function AdminPipelineBreakdown({ analytics }: AdminPipelineBreakdownProps) {
    const total = analytics.totalApplications > 0 ? analytics.totalApplications : 1;

    const stages = [
        {
            label: "Applied",
            count: analytics.appliedApplications,
            percentage: Math.round((analytics.appliedApplications / total) * 100),
            color: "bg-blue-500",
            textColor: "text-blue-700 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-950/40",
            borderColor: "border-blue-200 dark:border-blue-900/60",
        },
        {
            label: "Shortlisted",
            count: analytics.shortlistedApplications,
            percentage: Math.round((analytics.shortlistedApplications / total) * 100),
            color: "bg-amber-500",
            textColor: "text-amber-700 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-950/40",
            borderColor: "border-amber-200 dark:border-amber-900/60",
        },
        {
            label: "Selected / Offered",
            count: analytics.offeredApplications,
            percentage: Math.round((analytics.offeredApplications / total) * 100),
            color: "bg-emerald-500",
            textColor: "text-emerald-700 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
            borderColor: "border-emerald-200 dark:border-emerald-900/60",
        },
        {
            label: "Rejected",
            count: analytics.rejectedApplications,
            percentage: Math.round((analytics.rejectedApplications / total) * 100),
            color: "bg-red-500",
            textColor: "text-red-700 dark:text-red-400",
            bgColor: "bg-red-50 dark:bg-red-950/40",
            borderColor: "border-red-200 dark:border-red-900/60",
        },
    ];

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                        Application Pipeline Distribution
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Conversion breakdown across {analytics.totalApplications} total submitted candidate applications.
                    </p>
                </div>

                <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {analytics.totalApplications} Total
                </span>
            </div>

            {/* Stacked bar visualization */}
            {analytics.totalApplications > 0 ? (
                <div className="mt-6 space-y-6">
                    <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-zinc-100 p-0.5 dark:bg-zinc-800">
                        {stages.map(
                            (stage) =>
                                stage.count > 0 && (
                                    <div
                                        key={stage.label}
                                        style={{ width: `${(stage.count / total) * 100}%` }}
                                        className={`h-full first:rounded-l-full last:rounded-r-full ${stage.color} transition-all duration-500`}
                                        title={`${stage.label}: ${stage.count} (${stage.percentage}%)`}
                                    />
                                ),
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stages.map((stage) => (
                            <div
                                key={stage.label}
                                className={`rounded-xl border p-4 ${stage.borderColor} ${stage.bgColor}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                        {stage.label}
                                    </span>
                                    <span className={`text-xs font-bold ${stage.textColor}`}>
                                        {stage.percentage}%
                                    </span>
                                </div>

                                <p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                                    {stage.count}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="mt-6 py-6 text-center text-xs text-zinc-400">
                    No applications recorded on the platform yet.
                </p>
            )}
        </div>
    );
}
