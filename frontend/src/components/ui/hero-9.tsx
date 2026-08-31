"use client";

import React from "react";
import Link from "next/link";
import {
    ArrowRight,
    Sparkles,
    GraduationCap,
    Building2,
    Shield,
    CheckCircle2,
    Zap,
} from "lucide-react";

export interface Hero9Props {
    badge?: string;
    title?: string;
    description?: string;
    studentCtaText?: string;
    studentCtaHref?: string;
    recruiterCtaText?: string;
    recruiterCtaHref?: string;
}

export function Hero9({
    badge = "Placement Intelligence Platform",
    title = "Smarter Campus Placements. Seamless Career Discovery.",
    description = "CamPlace unites ambitious students, verified recruiting enterprises, and automated compatibility analytics into a unified career acceleration ecosystem.",
    studentCtaText = "Join as a Student",
    studentCtaHref = "/auth?role=student",
    recruiterCtaText = "Join as a Recruiter",
    recruiterCtaHref = "/auth?role=recruiter",
}: Hero9Props) {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-28 lg:py-32">
            {/* Multi-layer Background Ambient Gradients */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
                {/* Indigo core light */}
                <div className="absolute top-1/4 left-1/2 h-[550px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
                {/* Cyan secondary light */}
                <div className="absolute top-1/3 left-1/4 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[120px]" />
                {/* Purple subtle highlight */}
                <div className="absolute top-1/2 right-1/4 h-[350px] w-[450px] rounded-full bg-purple-600/15 blur-[120px]" />

                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-inner backdrop-blur-md transition hover:border-indigo-500/50">
                    <Sparkles className="size-3.5 text-cyan-400" />
                    <span>{badge}</span>
                </div>

                {/* Main Hero Headline */}
                <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl lg:leading-[1.1]">
                    {title}
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-lg sm:leading-relaxed">
                    {description}
                </p>

                {/* Role Choice Call-To-Actions */}
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                    {/* Student CTA */}
                    <Link
                        href={studentCtaHref}
                        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-[0.98] sm:w-auto"
                    >
                        <GraduationCap className="size-4.5 text-indigo-200" />
                        <span>{studentCtaText}</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    {/* Recruiter CTA */}
                    <Link
                        href={recruiterCtaHref}
                        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-700 bg-slate-900/90 px-7 py-3.5 text-sm font-bold text-slate-100 shadow-md backdrop-blur-md transition-all duration-200 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white active:scale-[0.98] sm:w-auto"
                    >
                        <Building2 className="size-4.5 text-cyan-400" />
                        <span>{recruiterCtaText}</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Trust Metrics Pill Bar */}
                <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 px-6 py-3 text-xs font-semibold text-slate-300 backdrop-blur-md sm:gap-8 sm:px-8">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span>Verified Student Profiles</span>
                    </div>
                    <div className="hidden h-4 w-px bg-slate-800 sm:block" />
                    <div className="flex items-center gap-2">
                        <Zap className="size-4 text-cyan-400" />
                        <span>AI Compatibility Engine</span>
                    </div>
                    <div className="hidden h-4 w-px bg-slate-800 sm:block" />
                    <div className="flex items-center gap-2">
                        <Shield className="size-4 text-purple-400" />
                        <span>Strict RBAC Security</span>
                    </div>
                </div>

                {/* How CamPlace Works Pipeline */}
                <div className="mt-24 text-left">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-400">
                            <span>How CamPlace Works</span>
                        </div>
                        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            The 4-Step Placement Intelligence Pipeline
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                step: "01",
                                title: "Create & Verify Profile",
                                desc: "Students document academic credentials, projects, and technical skills with verified status.",
                            },
                            {
                                step: "02",
                                title: "Employer Postings",
                                desc: "Recruiters publish company openings with exact eligibility, department, and skill criteria.",
                            },
                            {
                                step: "03",
                                title: "Intelligent Matching",
                                desc: "Placement algorithms calculate weighted compatibility scores and highlight missing skill gaps.",
                            },
                            {
                                step: "04",
                                title: "Candidate Selection",
                                desc: "Recruiters inspect structured disclosure dossiers and advance candidates to selection.",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xs transition hover:border-slate-700"
                            >
                                <span className="text-xs font-black text-indigo-400">
                                    STEP {item.step}
                                </span>
                                <h3 className="mt-2 text-base font-bold text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dual Stakeholder Showcase */}
                <div className="mt-20 grid gap-6 text-left sm:grid-cols-2">
                    {/* For Students Card */}
                    <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-900/90 p-8">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400">
                            <GraduationCap className="size-6" />
                        </div>
                        <h3 className="mt-5 text-xl font-bold text-white">
                            For Students & Candidates
                        </h3>
                        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                            Never miss an eligible campus opening. Get AI recommendations, understand match requirements, track application status live, and store resumes securely.
                        </p>
                        <Link
                            href="/auth?role=student"
                            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                        >
                            <span>Explore Student Features</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>

                    {/* For Recruiters Card */}
                    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/30 via-slate-900/80 to-slate-900/90 p-8">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-600/20 text-cyan-400">
                            <Building2 className="size-6" />
                        </div>
                        <h3 className="mt-5 text-xl font-bold text-white">
                            For Recruiters & Hiring Teams
                        </h3>
                        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                            Shortlist qualified candidates with speed. Access candidate resumes directly, view skill matches, and update application stages from a single dashboard.
                        </p>
                        <Link
                            href="/auth?role=recruiter"
                            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                        >
                            <span>Explore Recruiter Features</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero9;
