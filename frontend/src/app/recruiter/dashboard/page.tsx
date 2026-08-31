"use client";

import Link from "next/link";

import { AppErrorState } from "@/components/ui/error-3";
import { useRecruiterDashboard } from "@/features/recruiter-dashboard/hooks/use-recruiter-dashboard";

export default function RecruiterDashboardPage() {
    const dashboard = useRecruiterDashboard();

    if (dashboard.isLoading) {
        return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                        <p className="mt-4 text-sm font-medium text-zinc-500">
                            Loading recruiter dashboard...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (dashboard.isError) {
        return (
            <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    <AppErrorState
                        title="Unable to load recruiter dashboard"
                        message={
                            dashboard.error?.message ??
                            "Something went wrong while loading your recruiter dashboard. Please try again."
                        }
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 p-6 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8">
                    <p className="text-sm font-medium text-zinc-500">
                        Recruiter Portal
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Recruiter Dashboard
                    </h1>

                    <p className="mt-2 text-zinc-600">
                        Welcome back
                        {dashboard.profile?.username
                            ? `, ${dashboard.profile.username}`
                            : ""}
                        .
                    </p>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <p className="text-sm text-zinc-500">
                            Companies
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {dashboard.companies.length}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <p className="text-sm text-zinc-500">
                            Total Jobs
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {dashboard.jobs.length}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <p className="text-sm text-zinc-500">
                            Open Jobs
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {dashboard.jobs.filter(
                                (job) => job.status === "OPEN",
                            ).length}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <p className="text-sm text-zinc-500">
                            Applications
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {dashboard.applications.length}
                        </p>
                    </div>
                </section>

                <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Recruiter Profile
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Your recruiter information
                            </p>
                        </div>
                    </div>

                    {dashboard.profile ? (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-zinc-500">
                                    Name
                                </p>

                                <p className="mt-1 font-medium">
                                    {dashboard.profile.username}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-zinc-500">
                                    Company
                                </p>

                                <p className="mt-1 font-medium">
                                    {dashboard.profile.companyName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-zinc-500">
                                    Designation
                                </p>

                                <p className="mt-1 font-medium">
                                    {dashboard.profile.designation ??
                                        "Not specified"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-zinc-500">
                                    Department
                                </p>

                                <p className="mt-1 font-medium">
                                    {dashboard.profile.department ??
                                        "Not specified"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-5 text-sm text-zinc-500">
                            Recruiter profile is not available.
                        </p>
                    )}
                </section>

                <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Recent Jobs
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Your current recruiter job postings
                        </p>
                    </div>

                    {dashboard.jobs.length === 0 ? (
                        <p className="mt-5 text-sm text-zinc-500">
                            No jobs have been created yet.
                        </p>
                    ) : (
                        <div className="mt-5 divide-y">
                            {dashboard.jobs
                                .slice(0, 5)
                                .map((job) => (
                                    <div
                                        key={job.id}
                                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <h3 className="font-medium">
                                                {job.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-zinc-500">
                                                {job.companyName}
                                                {job.location
                                                    ? ` · ${job.location}`
                                                    : ""}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">
                                                {job.status}
                                            </span>

                                            <span className="text-sm text-zinc-500">
                                                {dashboard
                                                    .applicationCountsByJob[
                                                    job.id
                                                    ] ?? 0}{" "}
                                                applications
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </section>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold">
                        Quick Actions
                    </h2>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <Link
                            href="/recruiter/companies/new"
                            className="rounded-xl border bg-white p-5 shadow-sm hover:bg-zinc-50"
                        >
                            <p className="font-semibold">
                                Create Company
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                Add a company for job postings.
                            </p>
                        </Link>

                        <Link
                            href="/recruiter/jobs/new"
                            className="rounded-xl border bg-white p-5 shadow-sm hover:bg-zinc-50"
                        >
                            <p className="font-semibold">
                                Create Job
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                Create a new job posting.
                            </p>
                        </Link>

                        <Link
                            href="/recruiter/jobs"
                            className="rounded-xl border bg-white p-5 shadow-sm hover:bg-zinc-50"
                        >
                            <p className="font-semibold">
                                Manage Jobs
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                View jobs and applications.
                            </p>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
