"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { CamPlaceLogo } from "@/components/shared/camplace-logo";

export interface Auth08Props {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    onBackToRoles?: () => void;
    showBackToRoles?: boolean;
}

export function Auth08({
    children,
    title = "Sign In to CamPlace",
    subtitle = "Access your placement dashboard, job listings, and career workflows.",
    onBackToRoles,
    showBackToRoles = false,
}: Auth08Props) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white lg:flex-row">
            {/* Left Decorative & Brand Panel */}
            <div className="relative flex min-h-[30vh] w-full flex-col justify-between overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 sm:p-10 lg:min-h-screen lg:w-1/2 lg:border-r lg:border-b-0 lg:p-16">
                {/* Ambient glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                >
                    <div className="absolute -top-20 -left-20 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[100px]" />
                    <div className="absolute -bottom-20 -right-20 h-[450px] w-[450px] rounded-full bg-cyan-600/15 blur-[100px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem]" />
                </div>

                {/* Top Logo / Navigation */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 transition hover:opacity-90"
                    >
                        <CamPlaceLogo size="md" variant="light" showTagline={false} />
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:border-slate-700 hover:text-white"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Home</span>
                    </Link>
                </div>

                {/* Left Center Content */}
                <div className="relative z-10 my-auto py-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                        <Lock className="size-3 text-cyan-400" />
                        <span>Secure OTP & JWT Authentication</span>
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                        Accelerate Your Campus Hiring & Career.
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
                        A unified career intelligence ecosystem for students, recruiters, and placement officers with intelligent matching and tracking.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2.5">
                        <span className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300">
                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                            <span>Verified Student Profiles</span>
                        </span>
                        <span className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300">
                            <CheckCircle2 className="size-3.5 text-cyan-400" />
                            <span>Direct Recruiter Review</span>
                        </span>
                        <span className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300">
                            <CheckCircle2 className="size-3.5 text-indigo-400" />
                            <span>Compatibility Insights</span>
                        </span>
                    </div>
                </div>

                {/* Left Footer info */}
                <div className="relative z-10 text-xs font-medium text-slate-500">
                    © {new Date().getFullYear()} CamPlace. Placement Intelligence Platform.
                </div>
            </div>

            {/* Right Authentication Form Panel */}
            <div className="flex w-full flex-1 flex-col items-center justify-center bg-slate-950 p-6 sm:p-12 lg:w-1/2">
                <div className="w-full max-w-md space-y-6">
                    {showBackToRoles && onBackToRoles && (
                        <button
                            type="button"
                            onClick={onBackToRoles}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-white"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Change Role Selection</span>
                        </button>
                    )}

                    <div className="text-left">
                        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            {subtitle}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md sm:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
