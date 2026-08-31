"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    User,
    GraduationCap,
    FolderGit2,
    FileCode,
    Sparkles,
    Building2,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const studentNavigationItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Opportunities", href: "/jobs", icon: Briefcase },
    { label: "Applications", href: "/applications", icon: FileText },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Education", href: "/education", icon: GraduationCap },
    { label: "Projects", href: "/projects", icon: FolderGit2 },
    { label: "Resume", href: "/resume", icon: FileCode },
    { label: "Skills", href: "/skills", icon: Sparkles },
];

const recruiterNavigationItems = [
    { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
    { label: "Jobs", href: "/recruiter/jobs", icon: Briefcase },
    { label: "Companies", href: "/recruiter/companies", icon: Building2 },
    { label: "Profile", href: "/recruiter/profile", icon: User },
];

const adminNavigationItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Companies", href: "/admin/companies", icon: Building2 },
    { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
];

export function AppNavigation() {
    const pathname = usePathname();

    const isRecruiterRoute =
        pathname === "/recruiter" || pathname.startsWith("/recruiter/");

    const isAdminRoute =
        pathname === "/admin" || pathname.startsWith("/admin/");

    const navigationItems = isAdminRoute
        ? adminNavigationItems
        : isRecruiterRoute
        ? recruiterNavigationItems
        : studentNavigationItems;

    return (
        <nav
            aria-label="Secondary navigation"
            className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-950/80"
        >
            <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 scrollbar-none sm:px-6 lg:px-8">
                {navigationItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                            item.href !== "/recruiter/dashboard" &&
                            item.href !== "/admin/dashboard" &&
                            pathname.startsWith(`${item.href}/`));

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700 shadow-2xs dark:bg-indigo-950/50 dark:text-cyan-300"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "size-4",
                                    isActive
                                        ? "text-indigo-600 dark:text-cyan-400"
                                        : "opacity-60"
                                )}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
