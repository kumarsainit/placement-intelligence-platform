"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    MapPin,
    ArrowRight,
    Briefcase,
    Sparkles,
    Building2,
    DollarSign,
    Clock,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CareerOpportunity {
    id: string | number;
    title: string;
    companyName: string;
    companyLogo?: string;
    location: string;
    employmentType: string;
    experienceLevel?: string;
    salaryRange?: string;
    department?: string;
    deadline?: string;
    matchScore?: number;
    skills?: string[];
    hasApplied?: boolean;
    href: string;
}

export interface Career3Props {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    categories?: string[];
    opportunities: CareerOpportunity[];
    emptyMessage?: string;
    exploreLabel?: string;
    exploreHref?: string;
}

export function Career3({
    eyebrow = "Recommended Opportunities",
    heading = "Jobs & Internships Matched For You",
    subheading = "Personalized opportunities ranked by the CamPlace recommendation engine based on your profile and skills.",
    categories = ["All", "Top Matches", "Full-time", "Internships", "Remote"],
    opportunities = [],
    emptyMessage = "No opportunities found in this category right now.",
    exploreLabel = "Browse all career opportunities",
    exploreHref = "/jobs",
}: Career3Props) {
    const [activeTab, setActiveTab] = useState(categories[0] ?? "All");

    const filteredOpportunities = opportunities.filter((item) => {
        if (activeTab === "All") return true;
        if (activeTab === "Top Matches") return (item.matchScore ?? 0) >= 70;
        if (activeTab === "Full-time")
            return (
                item.employmentType?.toUpperCase().includes("FULL") ||
                item.department?.toUpperCase().includes("FULL")
            );
        if (activeTab === "Internships")
            return (
                item.employmentType?.toUpperCase().includes("INTERN") ||
                item.department?.toUpperCase().includes("INTERN")
            );
        if (activeTab === "Remote")
            return item.location?.toLowerCase().includes("remote");
        return item.department === activeTab;
    });

    return (
        <section className="w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    {eyebrow && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/70 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                            <Sparkles className="size-3 text-indigo-500" />
                            <span>{eyebrow}</span>
                        </div>
                    )}
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                        {heading}
                    </h2>
                    {subheading && (
                        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                            {subheading}
                        </p>
                    )}
                </div>

                {exploreHref && (
                    <Link
                        href={exploreHref}
                        className="group inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        <span>{exploreLabel}</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 flex overflow-x-auto pb-2 scrollbar-none">
                <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900">
                    {categories.map((cat) => {
                        const isActive = activeTab === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveTab(cat)}
                                className={cn(
                                    "rounded-xl px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150",
                                    isActive
                                        ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-cyan-400"
                                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                )}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Opportunities Grid */}
            <div className="mt-6">
                {filteredOpportunities.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/30">
                        <Briefcase className="mx-auto size-8 text-slate-400 opacity-60" />
                        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                            {emptyMessage}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredOpportunities.map((job) => {
                            const isHighMatch = (job.matchScore ?? 0) >= 80;
                            const isMediumMatch =
                                (job.matchScore ?? 0) >= 50 && (job.matchScore ?? 0) < 80;

                            return (
                                <div
                                    key={job.id}
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-indigo-800/80"
                                >
                                    <div>
                                        {/* Top Meta Bar */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {job.employmentType}
                                            </span>

                                            {job.matchScore !== undefined && (
                                                <div
                                                    className={cn(
                                                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                                                        isHighMatch
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                                                            : isMediumMatch
                                                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900"
                                                            : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                                                    )}
                                                >
                                                    <TrendingUp className="size-3" />
                                                    <span>{Math.round(job.matchScore)}% Match</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Company & Role */}
                                        <div className="mt-4 flex items-start gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                <Building2 className="size-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 truncate">
                                                    {job.title}
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                                    {job.companyName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Location & Salary Chips */}
                                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                                            <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 dark:bg-slate-800/60">
                                                <MapPin className="size-3 text-slate-400" />
                                                <span className="truncate max-w-[120px]">{job.location}</span>
                                            </span>
                                            {job.salaryRange && (
                                                <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 font-semibold text-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                                                    <DollarSign className="size-3 text-emerald-500" />
                                                    <span>{job.salaryRange}</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Skill Tags */}
                                        {job.skills && job.skills.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {job.skills.slice(0, 3).map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="rounded-md bg-indigo-50/60 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skills.length > 3 && (
                                                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800">
                                                        +{job.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer & Actions */}
                                    <div className="mt-5 border-t border-slate-100 pt-3.5 dark:border-slate-800/80">
                                        <div className="flex items-center justify-between gap-2">
                                            {job.deadline ? (
                                                <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                    <Clock className="size-3" />
                                                    <span>Closes {job.deadline}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-slate-400">Active</span>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={job.href}
                                                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                                >
                                                    Details
                                                </Link>
                                                {job.hasApplied ? (
                                                    <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                        Applied
                                                    </span>
                                                ) : (
                                                    <Link
                                                        href={job.href}
                                                        className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                                    >
                                                        Apply
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export function CareerHeader({
    eyebrow = "Career Marketplace",
    heading = "Discover Opportunities",
    subheading = "Explore vetted job openings and internships.",
}: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
}) {
    return (
        <div className="space-y-2">
            {eyebrow && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                    <Sparkles className="size-3 text-indigo-500" />
                    <span>{eyebrow}</span>
                </div>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {heading}
            </h1>
            {subheading && (
                <p className="max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {subheading}
                </p>
            )}
        </div>
    );
}

export default Career3;
