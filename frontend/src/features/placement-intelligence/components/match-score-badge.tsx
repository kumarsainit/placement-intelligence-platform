import React from "react";
import type { MatchGrade } from "@/features/placement-intelligence/types/recommendation";

interface MatchScoreBadgeProps {
    score: number;
    grade?: MatchGrade;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
}

export function MatchScoreBadge({
    score,
    grade,
    size = "md",
    showLabel = true,
}: MatchScoreBadgeProps) {
    const computedGrade: MatchGrade =
        grade ??
        (score >= 80
            ? "EXCELLENT_MATCH"
            : score >= 60
            ? "STRONG_MATCH"
            : score >= 40
            ? "GOOD_MATCH"
            : "POTENTIAL_FIT");

    const getColors = () => {
        switch (computedGrade) {
            case "EXCELLENT_MATCH":
                return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
            case "STRONG_MATCH":
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
            case "GOOD_MATCH":
                return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
            case "POTENTIAL_FIT":
            default:
                return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case "sm":
                return "px-2 py-0.5 text-[11px]";
            case "lg":
                return "px-3.5 py-1.5 text-sm font-bold";
            case "md":
            default:
                return "px-2.5 py-1 text-xs font-semibold";
        }
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border ${getColors()} ${getSizeClasses()} tracking-tight`}
        >
            <span className="font-bold">{score}%</span>
            {showLabel && <span>Match</span>}
        </span>
    );
}
