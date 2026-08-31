"use client";

import React from "react";
import Link from "next/link";
import {
    GraduationCap,
    Briefcase,
    FileText,
    FileCode,
    Sparkles,
    CheckCircle2,
    Clock,
    TrendingUp,
    ArrowRight,
    Search,
    FolderGit2,
    Building2,
    ChevronRight,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useApplications } from "@/features/applications/hooks/use-applications";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { DashboardStatCard } from "@/features/dashboard/components/dashboard-stat-card";
import { useEducations } from "@/features/education/hooks/use-educations";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useResumes } from "@/features/resume/hooks/use-resumes";
import { useUserSkills } from "@/features/skills/hooks/use-user-skills";
import { useStudentInsights } from "@/features/placement-intelligence/hooks/use-student-insights";
import { useJobRecommendations } from "@/features/placement-intelligence/hooks/use-job-recommendations";
import { StudentInsightsCard } from "@/features/placement-intelligence/components/student-insights-card";
import { Career3, type CareerOpportunity } from "@/components/ui/career-3";
import { AppErrorState } from "@/components/ui/error-3";

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
    const insightsQuery = useStudentInsights();
    const recommendationsQuery = useJobRecommendations();

    const currentUser = currentUserQuery.data?.data;
    const profile = profileQuery.data?.data;
    const resumes = resumesQuery.data?.data ?? [];
    const educations = educationsQuery.data?.data ?? [];
    const skills = skillsQuery.data?.data ?? [];
    const projects = projectsQuery.data?.data ?? [];
    const applications = applicationsQuery.data?.data ?? [];
    const insights = insightsQuery.data?.data;
    const recommendations = recommendationsQuery.data?.data ?? [];

    const primaryResume = resumes.find((resume) => resume.isPrimary);

    const applicationCounts = {
        total: applications.length,
        applied: applications.filter((app) => app.status === "APPLIED").length,
        shortlisted: applications.filter((app) => app.status === "SHORTLISTED").length,
        selected: applications.filter((app) => app.status === "SELECTED").length,
        rejected: applications.filter((app) => app.status === "REJECTED").length,
    };

    const recentApplications = [...applications]
        .sort(
            (a, b) =>
                new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        )
        .slice(0, 4);

    const profileItems = [
        { label: "Profile Info", completed: Boolean(profile?.fullName || profile?.bio) },
        { label: "Primary Resume", completed: Boolean(primaryResume) },
        { label: "Education History", completed: educations.length > 0 },
        { label: "Technical Skills", completed: skills.length > 0 },
        { label: "Project Portfolio", completed: projects.length > 0 },
    ];

    const completedProfileItems = profileItems.filter((item) => item.completed).length;
    const profileCompletion = Math.round((completedProfileItems / profileItems.length) * 100);

    // Map recommendations to CareerOpportunity items for Career3
    const careerOpportunities: CareerOpportunity[] = recommendations.map((rec) => {
        const salaryText =
            rec.job.salaryMin && rec.job.salaryMax
                ? `₹${rec.job.salaryMin.toLocaleString()} - ₹${rec.job.salaryMax.toLocaleString()}`
                : undefined;

        return {
            id: rec.job.id,
            title: rec.job.title,
            companyName: rec.job.companyName ?? "Hiring Partner",
            location: rec.job.location ?? "Campus / Remote",
            employmentType: rec.job.employmentType.replace("_", " "),
            experienceLevel: rec.job.experienceLevel
                ? rec.job.experienceLevel.replace("_", " ")
                : "Entry Level",
            salaryRange: salaryText,
            deadline: rec.job.applicationDeadline
                ? formatDate(rec.job.applicationDeadline)
                : undefined,
            matchScore: rec.matchScore,
            skills: rec.matchedSkills ?? [],
            href: `/jobs/${rec.job.id}`,
        };
    });

    return (
        <div className="space-y-10">
            {/* Welcome & Profile Header */}
            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900/40 via-slate-900/90 to-slate-900 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-300">
                            <Sparkles className="size-3 text-cyan-400" />
                            <span>Student Placement Hub</span>
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            {currentUser?.username
                                ? `Welcome back, ${currentUser.username}!`
                                : "Welcome to your Student Dashboard!"}
                        </h1>

                        <p className="max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Discover personalized opportunities, manage your verified career credentials, and track your campus hiring applications in real time.
                        </p>
                    </div>

                    {/* Profile Completion Ring / Progress Card */}
                    <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
                        <div className="relative flex size-14 items-center justify-center rounded-full border-4 border-indigo-600/30 bg-slate-900">
                            <span className="text-sm font-extrabold text-white">
                                {profileCompletion}%
                            </span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-white">
                                Profile Strength
                            </span>
                            <p className="text-[11px] text-slate-400">
                                {completedProfileItems} of {profileItems.length} milestones complete
                            </p>
                            {profileCompletion < 100 && (
                                <Link
                                    href="/profile"
                                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
                                >
                                    <span>Complete Profile</span>
                                    <ArrowRight className="size-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Placement Intelligence Insights */}
            {insights && <StudentInsightsCard insights={insights} />}

            {/* Opportunities Showcase (Career3) */}
            <DashboardSection
                title="Recommended Opportunities"
                description="Personalized job matches ranked by the CamPlace recommendation engine based on your skills and academic profile."
            >
                {recommendationsQuery.isLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="mx-auto size-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                        <p className="mt-3 text-xs font-medium text-slate-500">
                            Calculating placement recommendations...
                        </p>
                    </div>
                ) : recommendationsQuery.isError ? (
                    <AppErrorState
                        title="Unable to load recommendations"
                        message="Could not fetch personalized job matches right now."
                        onRetry={() => recommendationsQuery.refetch()}
                    />
                ) : careerOpportunities.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                        <Briefcase className="mx-auto size-8 text-slate-400 opacity-60" />
                        <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                            No recommendations available yet
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                            Add more verified technical skills, education records, and projects to boost your match score.
                        </p>
                        <div className="mt-5 flex justify-center gap-3">
                            <Link
                                href="/skills"
                                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                            >
                                Add Skills
                            </Link>
                            <Link
                                href="/jobs"
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Browse All Jobs
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Career3
                        heading="Curated Matches for You"
                        subheading="Opportunities tailored to your discipline and technical skills."
                        opportunities={careerOpportunities}
                        exploreLabel={`Explore all ${careerOpportunities.length} matches`}
                        exploreHref="/jobs"
                    />
                )}
            </DashboardSection>

            {/* Application Pipeline Metrics */}
            <DashboardSection
                title="Application Status Snapshot"
                description="Live progress across all submitted job applications."
                action={
                    <Link
                        href="/applications"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                        View All Applications ({applicationCounts.total}) →
                    </Link>
                }
            >
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                    <DashboardStatCard
                        label="Total Applied"
                        value={applicationCounts.total}
                        icon={FileText}
                        accentColor="indigo"
                        description="All submissions"
                    />
                    <DashboardStatCard
                        label="Pending Review"
                        value={applicationCounts.applied}
                        icon={Clock}
                        accentColor="amber"
                        description="Under initial screening"
                    />
                    <DashboardStatCard
                        label="Shortlisted"
                        value={applicationCounts.shortlisted}
                        icon={TrendingUp}
                        accentColor="purple"
                        description="Advanced candidates"
                    />
                    <DashboardStatCard
                        label="Selected"
                        value={applicationCounts.selected}
                        icon={CheckCircle2}
                        accentColor="emerald"
                        description="Offers extended"
                    />
                </div>
            </DashboardSection>

            {/* Placement Profile Credentials */}
            <DashboardSection
                title="Profile & Verified Credentials"
                description="Keep your academic credentials and resume updated for recruiters."
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/resume"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                <FileCode className="size-5" />
                            </div>
                            <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                Primary Resume
                            </h4>
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                {primaryResume ? primaryResume.fileName : "No resume uploaded yet."}
                            </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                            <span>Manage Resume</span>
                            <ChevronRight className="size-3" />
                        </span>
                    </Link>

                    <Link
                        href="/education"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                                <GraduationCap className="size-5" />
                            </div>
                            <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                Education
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                                {educations.length} {educations.length === 1 ? "record" : "records"} on file
                            </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                            <span>Manage Education</span>
                            <ChevronRight className="size-3" />
                        </span>
                    </Link>

                    <Link
                        href="/skills"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                <Sparkles className="size-5" />
                            </div>
                            <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                Technical Skills
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                                {skills.length} {skills.length === 1 ? "skill" : "skills"} verified
                            </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                            <span>Manage Skills</span>
                            <ChevronRight className="size-3" />
                        </span>
                    </Link>

                    <Link
                        href="/projects"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                <FolderGit2 className="size-5" />
                            </div>
                            <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                Project Portfolio
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                                {projects.length} {projects.length === 1 ? "project" : "projects"} documented
                            </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                            <span>Manage Projects</span>
                            <ChevronRight className="size-3" />
                        </span>
                    </Link>
                </div>
            </DashboardSection>

            {/* Recent Applications Activity */}
            <DashboardSection
                title="Recent Application Activity"
                description="Latest status updates on your candidate submissions."
            >
                {recentApplications.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                        <FileText className="mx-auto size-6 text-slate-400 opacity-60" />
                        <p className="mt-2 text-xs font-medium text-slate-500">
                            No applications submitted yet.
                        </p>
                        <Link
                            href="/jobs"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                        >
                            <Search className="size-3.5" />
                            <span>Discover Open Roles</span>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:divide-slate-800">
                        {recentApplications.map((app) => (
                            <Link
                                key={app.id}
                                href={`/applications/${app.id}`}
                                className="flex items-center justify-between p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        <Building2 className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                            {app.jobTitle}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Applied on {formatDate(app.appliedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={
                                            app.status === "SELECTED"
                                                ? "rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800"
                                                : app.status === "SHORTLISTED"
                                                ? "rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-bold text-purple-800"
                                                : app.status === "REJECTED"
                                                ? "rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-800"
                                                : "rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-800"
                                        }
                                    >
                                        {app.status.replace("_", " ")}
                                    </span>
                                    <ChevronRight className="size-4 text-slate-400" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </DashboardSection>
        </div>
    );
}
