"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ChevronDown,
    ChevronUp,
    Users,
    Briefcase,
    Download,
    TrendingUp,
    ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CandidateItem {
    id: number | string;
    studentId: number | string;
    studentName: string;
    studentEmail?: string;
    studentPhone?: string;
    appliedAt: string;
    status: string;
    matchScore?: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    resumeId?: number | string;
    resumeFileName?: string;
    coverLetter?: string | null;
    educationSummary?: string;
    skills?: string[];
}

export interface JobApplicantGroup {
    jobId: number | string;
    jobTitle: string;
    companyName: string;
    department?: string;
    location?: string;
    totalApplicants: number;
    underReviewCount?: number;
    shortlistedCount?: number;
    selectedCount?: number;
    candidates: CandidateItem[];
}

export interface TaskWidgetDisclosureProps {
    group: JobApplicantGroup;
    onStatusChange?: (
        applicationId: number | string,
        newStatus: string
    ) => Promise<void> | void;
    onDownloadResume?: (resumeId: number | string) => void;
}

export function TaskWidgetDisclosure({
    group,
    onStatusChange,
    onDownloadResume,
}: TaskWidgetDisclosureProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedCandidateId, setExpandedCandidateId] = useState<
        number | string | null
    >(null);
    const [updatingId, setUpdatingId] = useState<number | string | null>(null);

    const progressPercentage =
        group.totalApplicants > 0
            ? Math.round(
                  (((group.shortlistedCount ?? 0) + (group.selectedCount ?? 0)) /
                      group.totalApplicants) *
                      100
              )
            : 0;

    const handleStatusUpdate = async (
        candidateId: number | string,
        newStatus: string
    ) => {
        try {
            setUpdatingId(candidateId);
            await onStatusChange?.(candidateId, newStatus);
        } finally {
            setUpdatingId(null);
        }
    };

    const toggleCandidate = (id: number | string) => {
        setExpandedCandidateId((prev) => (prev === id ? null : id));
    };

    return (
        <div
            className={cn(
                "rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900/90",
                isExpanded
                    ? "border-indigo-300 shadow-md dark:border-indigo-800/80"
                    : "border-slate-200 shadow-2xs hover:border-slate-300 dark:border-slate-800"
            )}
        >
            {/* Group Header */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex cursor-pointer items-center justify-between gap-4 p-5 select-none"
            >
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <Briefcase className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                                {group.jobTitle}
                            </h3>
                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {group.companyName}
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {group.location ?? "Campus Placement"} • {group.totalApplicants}{" "}
                            {group.totalApplicants === 1 ? "applicant" : "total applicants"}
                        </p>
                    </div>
                </div>

                {/* Right Side Progress & Expand Toggle */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="w-24 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {group.shortlistedCount ?? 0} Shortlisted
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/recruiter/jobs/${group.jobId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <span>Job Details</span>
                            <ExternalLink className="size-3" />
                        </Link>
                        <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {isExpanded ? (
                                <ChevronUp className="size-4" />
                            ) : (
                                <ChevronDown className="size-4" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Applicants Drawer */}
            {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-950/30">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Candidate Review Queue ({group.candidates.length})
                        </span>
                        <Link
                            href={`/recruiter/jobs/${group.jobId}/applications`}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                            Open Full Pipeline View →
                        </Link>
                    </div>

                    {group.candidates.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                            <Users className="mx-auto size-6 text-slate-400 opacity-60" />
                            <p className="mt-2 text-xs font-medium text-slate-500">
                                No candidate applications received yet for this job opening.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {group.candidates.map((cand) => {
                                const isItemOpen = expandedCandidateId === cand.id;
                                const isUpdating = updatingId === cand.id;

                                return (
                                    <div
                                        key={cand.id}
                                        className={cn(
                                            "rounded-xl border bg-white transition-all dark:bg-slate-900",
                                            isItemOpen
                                                ? "border-indigo-300 shadow-sm dark:border-indigo-800"
                                                : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                                        )}
                                    >
                                        {/* Candidate Row Header */}
                                        <div
                                            onClick={() => toggleCandidate(cand.id)}
                                            className="flex cursor-pointer items-center justify-between gap-3 p-4 select-none"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs dark:bg-slate-800 dark:text-slate-300">
                                                    {cand.studentName.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                            {cand.studentName}
                                                        </h4>
                                                        {cand.matchScore !== undefined && (
                                                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
                                                                <TrendingUp className="size-2.5" />
                                                                {Math.round(cand.matchScore)}% Match
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                        Applied on {cand.appliedAt}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Badge & Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span
                                                    className={cn(
                                                        "rounded-full px-2.5 py-1 text-[11px] font-bold",
                                                        cand.status === "SELECTED"
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                            : cand.status === "SHORTLISTED"
                                                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                                            : cand.status === "REJECTED"
                                                            ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                                                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                                    )}
                                                >
                                                    {cand.status.replace("_", " ")}
                                                </span>

                                                <div className="size-6 flex items-center justify-center text-slate-400">
                                                    {isItemOpen ? (
                                                        <ChevronUp className="size-3.5" />
                                                    ) : (
                                                        <ChevronDown className="size-3.5" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Candidate Details */}
                                        {isItemOpen && (
                                            <div className="border-t border-slate-100 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    {/* Contact & Education Info */}
                                                    <div>
                                                        <span className="text-[11px] font-semibold text-slate-400 uppercase">
                                                            Candidate Profile
                                                        </span>
                                                        <div className="mt-1.5 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                                                            {cand.studentEmail && (
                                                                <p>
                                                                    <strong>Email:</strong> {cand.studentEmail}
                                                                </p>
                                                            )}
                                                            {cand.studentPhone && (
                                                                <p>
                                                                    <strong>Phone:</strong> {cand.studentPhone}
                                                                </p>
                                                            )}
                                                            {cand.educationSummary && (
                                                                <p>
                                                                    <strong>Education:</strong>{" "}
                                                                    {cand.educationSummary}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Skills Breakdown */}
                                                        {cand.skills && cand.skills.length > 0 && (
                                                            <div className="mt-3">
                                                                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                                                                    Skills
                                                                </span>
                                                                <div className="mt-1.5 flex flex-wrap gap-1">
                                                                    {cand.skills.map((s) => (
                                                                        <span
                                                                            key={s}
                                                                            className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                                                                        >
                                                                            {s}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Cover Letter & Resume */}
                                                    <div>
                                                        {cand.coverLetter && (
                                                            <div>
                                                                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                                                                    Cover Letter / Note
                                                                </span>
                                                                <p className="mt-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                                                    {cand.coverLetter}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {cand.resumeId && (
                                                            <div className="mt-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onDownloadResume?.(cand.resumeId!)
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                                                >
                                                                    <Download className="size-3.5 text-indigo-600" />
                                                                    <span>
                                                                        Download Resume (
                                                                        {cand.resumeFileName ?? "PDF"})
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Transition Action Bar */}
                                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
                                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                        Update Application Stage:
                                                    </span>

                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {[
                                                            { label: "Shortlist", status: "SHORTLISTED" },
                                                            { label: "Select", status: "SELECTED" },
                                                            { label: "Reject", status: "REJECTED" },
                                                        ].map((st) => (
                                                            <button
                                                                key={st.status}
                                                                type="button"
                                                                disabled={
                                                                    isUpdating || cand.status === st.status
                                                                }
                                                                onClick={() =>
                                                                    handleStatusUpdate(cand.id, st.status)
                                                                }
                                                                className={cn(
                                                                    "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all",
                                                                    cand.status === st.status
                                                                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
                                                                    isUpdating && "opacity-50"
                                                                )}
                                                            >
                                                                {st.label}
                                                            </button>
                                                        ))}

                                                        <Link
                                                            href={`/recruiter/applications/${cand.id}`}
                                                            className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                                                        >
                                                            Full Dossier →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
