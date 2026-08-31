import Link from "next/link";
import type { ReactNode } from "react";

export interface Auth08Props {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export function Auth08({
    children,
    title = "Placement Intelligence",
    subtitle = "Sign in to access your placement dashboard, job listings, and application tracking.",
}: Auth08Props) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-white selection:bg-zinc-800 selection:text-white lg:flex-row">
            {/* Left Decorative & Info Panel */}
            <div className="relative flex min-h-[35vh] w-full flex-col justify-between overflow-hidden border-b border-zinc-800/80 bg-zinc-900/60 p-8 sm:p-12 lg:min-h-screen lg:w-1/2 lg:border-r lg:border-b-0 lg:p-16">
                {/* Ambient glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                >
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-zinc-700/20 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-zinc-800/30 blur-3xl" />
                </div>

                {/* Top Logo / Navigation */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition hover:opacity-90"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-black text-white">
                            PI
                        </span>
                        <span>Placement Intelligence</span>
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-white"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {/* Left Center Content */}
                <div className="relative z-10 my-auto py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-xs font-medium text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Secure OTP Authentication
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.15]">
                        Accelerate Your Placement Journey.
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
                        A unified campus ecosystem for students, recruiters, and placement directors with intelligent workflows.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2.5">
                        <span className="rounded-md border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300">
                            ✓ Verified Student Profiles
                        </span>
                        <span className="rounded-md border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300">
                            ✓ Direct Recruiter Review
                        </span>
                        <span className="rounded-md border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300">
                            ✓ Real-time Analytics
                        </span>
                    </div>
                </div>

                {/* Left Footer info */}
                <div className="relative z-10 text-xs text-zinc-500">
                    © {new Date().getFullYear()} Placement Intelligence. All rights reserved.
                </div>
            </div>

            {/* Right Authentication Form Panel */}
            <div className="flex w-full flex-1 flex-col items-center justify-center bg-zinc-950 p-6 sm:p-12 lg:w-1/2">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400">
                            {subtitle}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
