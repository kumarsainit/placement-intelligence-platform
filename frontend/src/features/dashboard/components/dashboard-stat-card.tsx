import React from "react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
    label: string;
    value: number | string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
    accentColor?: "indigo" | "cyan" | "emerald" | "purple" | "amber" | "slate";
}

export function DashboardStatCard({
    label,
    value,
    description,
    icon: Icon,
    accentColor = "slate",
}: DashboardStatCardProps) {
    const accentStyles = {
        indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400",
        cyan: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400",
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
        purple: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
        amber: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
        slate: "text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
    };

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {label}
                </span>

                {Icon && (
                    <div
                        className={cn(
                            "flex size-9 items-center justify-center rounded-xl",
                            accentStyles[accentColor]
                        )}
                    >
                        <Icon className="size-4.5" />
                    </div>
                )}
            </div>

            <div className="mt-3">
                <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {value}
                </p>

                {description && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
