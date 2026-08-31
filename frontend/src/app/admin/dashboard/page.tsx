"use client";

import Link from "next/link";
import { AppErrorState } from "@/components/ui/error-3";
import { useAdminAnalytics } from "@/features/admin-analytics/hooks/use-admin-analytics";
import { AdminPipelineBreakdown } from "@/features/admin-analytics/components/admin-pipeline-breakdown";
import { AdminDistributionCard } from "@/features/admin-analytics/components/admin-distribution-card";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { DashboardStatCard } from "@/features/dashboard/components/dashboard-stat-card";

export default function AdminDashboardPage() {
    const {
        data: analyticsResponse,
        isLoading,
        isError,
        refetch,
    } = useAdminAnalytics();

    const analytics = analyticsResponse?.data;

    if (isLoading) {
        return (
            <main className="mx-auto max-w-6xl p-6 sm:p-8">
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-white" />
                    <p className="mt-4 text-sm font-medium text-zinc-500">
                        Loading placement intelligence analytics...
                    </p>
                </div>
            </main>
        );
    }

    if (isError || !analytics) {
        return (
            <main className="mx-auto max-w-6xl p-6 sm:p-8">
                <AppErrorState
                    title="Unable to load placement analytics"
                    message="An error occurred while fetching administrative analytics. Please try again."
                    onRetry={() => refetch()}
                />
            </main>
        );
    }

    const userDistribution = [
        {
            label: "Students",
            value: analytics.totalStudents,
            color: "bg-blue-500",
            subLabel: "Candidates",
        },
        {
            label: "Recruiters",
            value: analytics.totalRecruiters,
            color: "bg-indigo-500",
            subLabel: "Hiring Partners",
        },
        {
            label: "Admins",
            value: analytics.totalAdmins,
            color: "bg-purple-500",
            subLabel: "Officers",
        },
        {
            label: "Super Admins",
            value: analytics.totalSuperAdmins,
            color: "bg-zinc-800",
            subLabel: "Root",
        },
    ];

    const jobDistribution = [
        {
            label: "Open",
            value: analytics.totalOpenJobs,
            color: "bg-emerald-500",
            subLabel: "Active",
        },
        {
            label: "Draft",
            value: analytics.totalDraftJobs,
            color: "bg-amber-500",
            subLabel: "Unpublished",
        },
        {
            label: "Closed",
            value: analytics.totalClosedJobs,
            color: "bg-zinc-400",
            subLabel: "Concluded",
        },
    ];

    return (
        <main className="mx-auto max-w-6xl p-6 sm:p-8">
            <div className="space-y-10">
                {/* Header with platform scope */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Administrative Management Console
                        </div>

                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                            Placement Intelligence Overview
                        </h1>

                        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                            Real-time platform metrics, stakeholder activity, recruitment pipeline, and placement analytics.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        <Link
                            href="/admin/users"
                            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            Manage Users
                        </Link>
                        <Link
                            href="/admin/companies"
                            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            Manage Companies
                        </Link>
                        <Link
                            href="/admin/jobs"
                            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            Manage Jobs
                        </Link>
                    </div>
                </header>

                {/* Platform Overview High-Level Summary Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DashboardStatCard
                        label="Active Platform Accounts"
                        value={analytics.totalActiveUsers}
                        description="Active student, recruiter & admin accounts"
                    />

                    <DashboardStatCard
                        label="Partner Companies"
                        value={analytics.totalActiveCompanies}
                        description="Active verified hiring employers"
                    />

                    <DashboardStatCard
                        label="Total Job Postings"
                        value={analytics.totalJobs}
                        description={`${analytics.totalOpenJobs} currently open for applications`}
                    />

                    <DashboardStatCard
                        label="Total Applications"
                        value={analytics.totalApplications}
                        description={`${analytics.offeredApplications} offers / selections granted`}
                    />
                </div>

                {/* Application Pipeline Deep Dive */}
                <DashboardSection
                    title="Placement & Application Pipeline"
                    description="Real-time conversion metrics of student job applications through recruitment stages."
                >
                    <AdminPipelineBreakdown analytics={analytics} />
                </DashboardSection>

                {/* Distributions Grid: User Ecosystem & Job Status */}
                <div className="grid gap-6 md:grid-cols-2">
                    <AdminDistributionCard
                        title="Stakeholder Distribution"
                        description="Registered user accounts categorized by platform role."
                        items={userDistribution}
                    />

                    <AdminDistributionCard
                        title="Job Posting Distribution"
                        description="Recruitment listings breakdown by lifecycle status."
                        items={jobDistribution}
                    />
                </div>

                {/* User Ecosystem Section */}
                <DashboardSection
                    title="User Management & Ecosystem"
                    description="Breakdown of registered accounts across student, recruiter, and administrator roles."
                >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <DashboardStatCard
                            label="Total Students"
                            value={analytics.totalStudents}
                            description="Registered student candidates"
                        />

                        <DashboardStatCard
                            label="Total Recruiters"
                            value={analytics.totalRecruiters}
                            description="Company recruiter accounts"
                        />

                        <DashboardStatCard
                            label="Total Admins"
                            value={analytics.totalAdmins}
                            description="Placement officers & admins"
                        />

                        <DashboardStatCard
                            label="Total Super Admins"
                            value={analytics.totalSuperAdmins}
                            description="Platform root administrators"
                        />

                        <DashboardStatCard
                            label="Total Active Users"
                            value={analytics.totalActiveUsers}
                            description="Active status accounts"
                        />
                    </div>
                </DashboardSection>

                {/* Employer & Recruitment Section */}
                <DashboardSection
                    title="Employer & Opportunity Metrics"
                    description="Partner companies and job opportunities across the campus ecosystem."
                >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DashboardStatCard
                            label="Active Companies"
                            value={analytics.totalActiveCompanies}
                            description="Active partner employers"
                        />

                        <DashboardStatCard
                            label="Open Jobs"
                            value={analytics.totalOpenJobs}
                            description="Actively accepting applications"
                        />

                        <DashboardStatCard
                            label="Draft Jobs"
                            value={analytics.totalDraftJobs}
                            description="Unpublished recruiter drafts"
                        />

                        <DashboardStatCard
                            label="Closed Jobs"
                            value={analytics.totalClosedJobs}
                            description="Expired or closed postings"
                        />
                    </div>
                </DashboardSection>
            </div>
        </main>
    );
}
