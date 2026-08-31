"use client";

import Link from "next/link";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useApplications } from "@/features/applications/hooks/use-applications";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { DashboardStatCard } from "@/features/dashboard/components/dashboard-stat-card";
import { useEducations } from "@/features/education/hooks/use-educations";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useResumes } from "@/features/resume/hooks/use-resumes";
import { useUserSkills } from "@/features/skills/hooks/use-user-skills";

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function DashboardPage() {
    const currentUserQuery = useCurrentUser();
    const profileQuery = useProfile();
    const resumesQuery = useResumes();
    const educationsQuery = useEducations();
    const skillsQuery = useUserSkills();
    const projectsQuery = useProjects();
    const applicationsQuery = useApplications();

    const currentUser = currentUserQuery.data?.data;
    const profile = profileQuery.data?.data;
    const resumes = resumesQuery.data?.data ?? [];
    const educations = educationsQuery.data?.data ?? [];
    const skills = skillsQuery.data?.data ?? [];
    const projects = projectsQuery.data?.data ?? [];
    const applications =
        applicationsQuery.data?.data ?? [];

    const primaryResume = resumes.find(
        (resume) => resume.isPrimary,
    );

    const applicationCounts = {
        total: applications.length,

        applied: applications.filter(
            (application) =>
                application.status === "APPLIED",
        ).length,

        shortlisted: applications.filter(
            (application) =>
                application.status === "SHORTLISTED",
        ).length,

        selected: applications.filter(
            (application) =>
                application.status === "SELECTED",
        ).length,

        rejected: applications.filter(
            (application) =>
                application.status === "REJECTED",
        ).length,
    };

    const recentApplications = [...applications]
        .sort(
            (a, b) =>
                new Date(b.appliedAt).getTime() -
                new Date(a.appliedAt).getTime(),
        )
        .slice(0, 5);

    const profileItems = [
        {
            label: "Profile",
            completed: Boolean(profile),
        },
        {
            label: "Resume",
            completed: Boolean(primaryResume),
        },
        {
            label: "Education",
            completed: educations.length > 0,
        },
        {
            label: "Skills",
            completed: skills.length > 0,
        },
        {
            label: "Projects",
            completed: projects.length > 0,
        },
    ];

    const completedProfileItems =
        profileItems.filter(
            (item) => item.completed,
        ).length;

    const profileCompletion = Math.round(
        (completedProfileItems /
            profileItems.length) *
        100,
    );

    return (
                <div className="mx-auto max-w-6xl p-6 sm:p-8">
                    <div className="space-y-10">
                        <div>
                            <p className="text-sm font-medium text-zinc-500">
                                Placement Intelligence
                            </p>

                            <h1 className="mt-1 text-3xl font-bold">
                                Student Dashboard
                            </h1>

                            {currentUserQuery.isLoading && (
                                <p className="mt-2 text-sm text-zinc-500">
                                    Loading your profile...
                                </p>
                            )}

                            {currentUserQuery.isError && (
                                <p className="mt-2 text-sm text-red-600">
                                    Unable to load your account
                                    information.
                                </p>
                            )}

                            {currentUser && (
                                <p className="mt-2 text-zinc-600">
                                    Welcome,{" "}
                                    <span className="font-medium">
                                        {currentUser.username}
                                    </span>
                                </p>
                            )}
                        </div>

                        <DashboardSection
                            title="Profile Overview"
                            description="Keep your placement profile complete and up to date."
                        >
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <DashboardStatCard
                                    label="Profile Completion"
                                    value={`${profileCompletion}%`}
                                    description={`${completedProfileItems} of ${profileItems.length} sections completed`}
                                />

                                <DashboardStatCard
                                    label="Education"
                                    value={educations.length}
                                    description="Education records"
                                />

                                <DashboardStatCard
                                    label="Skills"
                                    value={skills.length}
                                    description="Skills added"
                                />

                                <DashboardStatCard
                                    label="Projects"
                                    value={projects.length}
                                    description="Projects added"
                                />
                            </div>
                        </DashboardSection>

                        <DashboardSection
                            title="Placement Profile"
                            description="Manage the information recruiters will see."
                        >
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Link
                                    href="/profile"
                                    className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-zinc-400 hover:shadow"
                                >
                                    <p className="font-semibold">
                                        Profile
                                    </p>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        {profile
                                            ? "Your profile is configured."
                                            : "Complete your profile."}
                                    </p>

                                    <span className="mt-4 inline-block text-sm font-medium">
                                        Manage Profile →
                                    </span>
                                </Link>

                                <Link
                                    href="/resume"
                                    className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-zinc-400 hover:shadow"
                                >
                                    <p className="font-semibold">
                                        Resume
                                    </p>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        {primaryResume
                                            ? primaryResume.fileName
                                            : "No primary resume selected."}
                                    </p>

                                    <span className="mt-4 inline-block text-sm font-medium">
                                        Manage Resume →
                                    </span>
                                </Link>

                                <Link
                                    href="/education"
                                    className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-zinc-400 hover:shadow"
                                >
                                    <p className="font-semibold">
                                        Education
                                    </p>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        {educations.length}{" "}
                                        record
                                        {educations.length === 1
                                            ? ""
                                            : "s"}{" "}
                                        added.
                                    </p>

                                    <span className="mt-4 inline-block text-sm font-medium">
                                        Manage Education →
                                    </span>
                                </Link>

                                <Link
                                    href="/skills"
                                    className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-zinc-400 hover:shadow"
                                >
                                    <p className="font-semibold">
                                        Skills
                                    </p>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        {skills.length} skill
                                        {skills.length === 1
                                            ? ""
                                            : "s"}{" "}
                                        added.
                                    </p>

                                    <span className="mt-4 inline-block text-sm font-medium">
                                        Manage Skills →
                                    </span>
                                </Link>

                                <Link
                                    href="/projects"
                                    className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-zinc-400 hover:shadow"
                                >
                                    <p className="font-semibold">
                                        Projects
                                    </p>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        {projects.length} project
                                        {projects.length === 1
                                            ? ""
                                            : "s"}{" "}
                                        added.
                                    </p>

                                    <span className="mt-4 inline-block text-sm font-medium">
                                        Manage Projects →
                                    </span>
                                </Link>

                                <Link
                                    href="/jobs"
                                    className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-zinc-400 hover:shadow"
                                >
                                    <p className="font-semibold">
                                        Job Search
                                    </p>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        Discover jobs matching
                                        your profile.
                                    </p>

                                    <span className="mt-4 inline-block text-sm font-medium">
                                        Search Jobs →
                                    </span>
                                </Link>
                            </div>
                        </DashboardSection>

                        <DashboardSection
                            title="Application Summary"
                            description="Track the progress of your job applications."
                        >
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                <DashboardStatCard
                                    label="Total"
                                    value={
                                        applicationCounts.total
                                    }
                                />

                                <DashboardStatCard
                                    label="Applied"
                                    value={
                                        applicationCounts.applied
                                    }
                                />

                                <DashboardStatCard
                                    label="Shortlisted"
                                    value={
                                        applicationCounts.shortlisted
                                    }
                                />

                                <DashboardStatCard
                                    label="Selected"
                                    value={
                                        applicationCounts.selected
                                    }
                                />

                                <DashboardStatCard
                                    label="Rejected"
                                    value={
                                        applicationCounts.rejected
                                    }
                                />
                            </div>
                        </DashboardSection>

                        <DashboardSection
                            title="Recent Applications"
                            description="Your five most recent job applications."
                        >
                            {recentApplications.length === 0 ? (
                                <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                                    <p className="font-medium">
                                        No applications yet
                                    </p>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        Start exploring jobs and
                                        submit your first
                                        application.
                                    </p>

                                    <Link
                                        href="/jobs"
                                        className="mt-5 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                                    >
                                        Search Jobs
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                                    <div className="divide-y">
                                        {recentApplications.map(
                                            (application) => (
                                                <Link
                                                    key={
                                                        application.id
                                                    }
                                                    href={`/applications/${application.id}`}
                                                    className="block p-5 transition hover:bg-zinc-50"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="font-semibold">
                                                                {
                                                                    application.jobTitle
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-sm text-zinc-500">
                                                                Applied on{" "}
                                                                {formatDate(
                                                                    application.appliedAt,
                                                                )}
                                                            </p>
                                                        </div>

                                                        <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">
                                                            {
                                                                application.status
                                                            }
                                                        </span>
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>

                                    <div className="border-t p-4">
                                        <Link
                                            href="/applications"
                                            className="text-sm font-medium hover:underline"
                                        >
                                            View all applications →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </DashboardSection>

                        <DashboardSection
                            title="Quick Actions"
                            description="Jump directly to the most important placement workflows."
                        >
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/jobs"
                                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                                >
                                    Search Jobs
                                </Link>

                                <Link
                                    href="/applications"
                                    className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
                                >
                                    My Applications
                                </Link>

                                <Link
                                    href="/resume"
                                    className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
                                >
                                    Manage Resume
                                </Link>

                                <Link
                                    href="/profile"
                                    className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        </DashboardSection>
                    </div>
                </div>
    );
}
