"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw, Home, Compass } from "lucide-react";
import { CamPlaceLogo } from "@/components/shared/camplace-logo";
import { cn } from "@/lib/utils";

export interface AppErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    backHref?: string;
    backLabel?: string;
    className?: string;
}

export function AppErrorState({
    title = "Unable to load content",
    message = "An unexpected error occurred while fetching information. Please try again.",
    onRetry,
    backHref,
    backLabel = "Go Back",
    className,
}: AppErrorStateProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-red-200 bg-red-50/60 p-6 sm:p-8 text-center shadow-xs dark:border-red-900/50 dark:bg-red-950/20",
                className
            )}
        >
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                <AlertTriangle className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-red-200">
                {title}
            </h3>

            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-600 dark:text-red-400/90">
                {message}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-red-700 active:scale-[0.98]"
                    >
                        <RefreshCw className="size-3.5" />
                        <span>Try Again</span>
                    </button>
                )}

                {backHref && (
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>{backLabel}</span>
                    </Link>
                )}
            </div>
        </div>
    );
}

export interface Error3Props {
    statusCode?: string | number;
    title?: string;
    message?: string;
    actionLabel?: string;
    actionHref?: string;
    onRetry?: () => void;
}

export function Error3({
    statusCode = "404",
    title = "Page Not Found",
    message = "The page you are looking for has been moved, removed, or never existed in CamPlace.",
    actionLabel = "Return Home",
    actionHref = "/",
    onRetry,
}: Error3Props) {
    return (
        <div className="relative flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-16 text-center">
            {/* Ambient blur */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="mx-auto max-w-md">
                <CamPlaceLogo size="lg" className="justify-center mb-6" />

                <span className="text-6xl font-black tracking-tighter text-indigo-600 sm:text-8xl dark:text-indigo-400">
                    {statusCode}
                </span>

                <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {title}
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {message}
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href={actionHref}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700 sm:w-auto"
                    >
                        <Home className="size-4" />
                        <span>{actionLabel}</span>
                    </Link>

                    {onRetry ? (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                            <RefreshCw className="size-3.5" />
                            <span>Retry</span>
                        </button>
                    ) : (
                        <Link
                            href="/jobs"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                            <Compass className="size-4" />
                            <span>Explore Opportunities</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Error3;
