"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Building2,
    Briefcase,
    Users,
    TrendingUp,
    PlusCircle,
    ArrowRight,
} from "lucide-react";
import { useRecruiterDashboard } from "@/features/recruiter-dashboard/hooks/use-recruiter-dashboard";
import { DashboardStatCard } from "@/features/dashboard/components/dashboard-stat-card";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import {
    TaskWidgetDisclosure,
    type JobApplicantGroup,
} from "@/components/ui/task-widget-disclosure";
import { AppErrorState } from "@/components/ui/error-3";
import {
    updateApplicationStatus,
    getRecruiterApplicationResumeFile,
} from "@/features/recruiter-applications/api/recruiter-application-api";
import type { ApplicationStatus } from "@/features/recruiter-applications/types/recruiter-application";
import { useQueryClient } from "@tanstack/react-query";

export default function RecruiterDashboardPage() {
    const queryClient = useQueryClient();
    const dashboard = useRecruiterDashboard();

    const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

    const handleStatusChange = async (
        applicationId: number | string,
        newStatus: string
    ) => {
        try {
            await updateApplicationStatus(Number(applicationId), {
                status: newStatus as ApplicationStatus,
            });
            setStatusFeedback(`Application status updated to ${newStatus}`);
            queryClient.invalidateQueries({ queryKey: ["recruiter-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["recruiter-applications"] });
            setTimeout(() => setStatusFeedback(null), 3500);
        } catch (err: unknown) {
            console.error("Status update error:", err);
        }
    };

    const handleDownloadResume = async (applicationId: number | string) => {
        try {
            const blob = await getRecruiterApplicationResumeFile(Number(applicationId));
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `applicant_resume_${applicationId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: unknown) {
            console.error("Resume download error:", err);
        }
    };

    if (dashboard.isLoading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto size-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="mt-4 text-xs font-semibold text-slate-500">
                    Loading recruiter dashboard...
                </p>
            </div>
        );
    }

    if (dashboard.isError) {
        return (
            <AppErrorState
                title="Unable to load recruiter dashboard"
                message={
                    dashboard.error?.message ??
                    "An unexpected error occurred while loading your recruiter dashboard. Please try again."
                }
                onRetry={() => window.location.reload()}
            />
        );
    }

    const openJobsCount = dashboard.jobs.filter((j) => j.status === "OPEN").length;
    const shortlistedCount = dashboard.applications.filter(
        (a) => a.status === "SHORTLISTED" || a.status === "SELECTED"
    ).length;

    // Build applicant groups for each job
    const jobApplicantGroups: JobApplicantGroup[] = dashboard.jobs.map((job) => {
        const jobApps = dashboard.applications.filter((a) => a.jobId === job.id);
        return {
            jobId: job.id,
            jobTitle: job.title,
            companyName: job.companyName ?? "Hiring Partner",
            location: job.location,
            totalApplicants: jobApps.length,
            shortlistedCount: jobApps.filter(
                (a) => a.status === "SHORTLISTED" || a.status === "SELECTED"
            ).length,
            candidates: jobApps.map((a) => ({
                id: a.id,
                studentId: a.applicantId,
                studentName: a.applicantUsername ?? `Candidate #${a.applicantId}`,
                appliedAt: new Date(a.appliedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                status: a.status,
                coverLetter: a.coverLetter,
                resumeId: a.resumeId ?? a.id,
                resumeFileName: a.resumeFileName ?? "Candidate_Resume.pdf",
            })),
        };
    });

    return (
        <div className="space-y-10">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-slate-900 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/60 px-3 py-0.5 text-xs font-semibold text-cyan-300">
                            <Building2 className="size-3" />
                            <span>Employer Hiring Portal</span>
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            {dashboard.profile?.username
                                ? `Welcome, ${dashboard.profile.username}`
                                : "Recruiter Dashboard"}
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                            Manage hiring companies, publish job openings, and evaluate applicants through structured candidate review disclosures.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                        <Link
                            href="/recruiter/jobs/new"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-500 active:scale-[0.98]"
                        >
                            <PlusCircle className="size-4" />
                            <span>Post New Job</span>
                        </Link>
                    </div>
                </div>
            </div>

            {statusFeedback && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    ✓ {statusFeedback}
                </div>
            )}

            {/* KPI Metrics */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <DashboardStatCard
                    label="Associated Companies"
                    value={dashboard.companies.length}
                    icon={Building2}
                    accentColor="indigo"
                    description="Registered employers"
                />
                <DashboardStatCard
                    label="Active Job Postings"
                    value={openJobsCount}
                    icon={Briefcase}
                    accentColor="cyan"
                    description={`${dashboard.jobs.length} total postings`}
                />
                <DashboardStatCard
                    label="Total Applications"
                    value={dashboard.applications.length}
                    icon={Users}
                    accentColor="purple"
                    description="All candidate submissions"
                />
                <DashboardStatCard
                    label="Shortlisted / Selected"
                    value={shortlistedCount}
                    icon={TrendingUp}
                    accentColor="emerald"
                    description="Advanced pipeline"
                />
            </div>

            {/* Candidate Review Pipeline (TaskWidgetDisclosure) */}
            <DashboardSection
                title="Candidate Review Pipeline"
                description="Structured applicant disclosure widget. Click on any job opening to expand candidate cards and review resumes."
                action={
                    <Link
                        href="/recruiter/jobs"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                        View All {dashboard.jobs.length} Jobs →
                    </Link>
                }
            >
                {jobApplicantGroups.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                        <Briefcase className="mx-auto size-8 text-slate-400 opacity-60" />
                        <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                            No active job postings
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                            Post your first job opening to start receiving candidate applications.
                        </p>
                        <Link
                            href="/recruiter/jobs/new"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                        >
                            <PlusCircle className="size-3.5" />
                            <span>Create Job Posting</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobApplicantGroups.map((group) => (
                            <TaskWidgetDisclosure
                                key={group.jobId}
                                group={group}
                                onStatusChange={handleStatusChange}
                                onDownloadResume={handleDownloadResume}
                            />
                        ))}
                    </div>
                )}
            </DashboardSection>

            {/* Recruiter Quick Actions */}
            <DashboardSection
                title="Management Shortcuts"
                description="Fast navigation for company setup, job publishing, and applicant tracking."
            >
                <div className="grid gap-4 sm:grid-cols-3">
                    <Link
                        href="/recruiter/companies/new"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                <Building2 className="size-5" />
                            </div>
                            <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                Register Company
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                                Add a company entity to publish campus jobs.
                            </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                            <span>Add Company</span>
                            <ArrowRight className="size-3" />
                        </span>
                    </Link>

                    <Link
                        href="/recruiter/jobs/new"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                                <PlusCircle className="size-5" />
                            </div>
                            <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                Post Job Opening
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                                Publish criteria, salary, and requirements.
                            </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                            <span>Post Job</span>
                            <ArrowRight className="size-3" />
                        </span>
                    </Link>

                    <Link
                        href="/recruiter/jobs"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                <Briefcase className="size-5" />
                            </div>
                            <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                Manage Openings
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                                View all postings and candidate applications.
                            </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                            <span>Manage Jobs</span>
                            <ArrowRight className="size-3" />
                        </span>
                    </Link>
                </div>
            </DashboardSection>
        </div>
    );
}
