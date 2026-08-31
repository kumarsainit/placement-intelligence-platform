"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const studentNavigationItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Jobs",
        href: "/jobs",
    },
    {
        label: "Applications",
        href: "/applications",
    },
    {
        label: "Profile",
        href: "/profile",
    },
    {
        label: "Education",
        href: "/education",
    },
    {
        label: "Projects",
        href: "/projects",
    },
    {
        label: "Resume",
        href: "/resume",
    },
    {
        label: "Skills",
        href: "/skills",
    },
];

const recruiterNavigationItems = [
    {
        label: "Dashboard",
        href: "/recruiter/dashboard",
    },
    {
        label: "Jobs",
        href: "/recruiter/jobs",
    },
    {
        label: "Companies",
        href: "/recruiter/companies",
    },
    {
        label: "Profile",
        href: "/recruiter/profile",
    },
];

const adminNavigationItems = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
    },
    {
        label: "Users",
        href: "/admin/users",
    },
    {
        label: "Companies",
        href: "/admin/companies",
    },
    {
        label: "Jobs",
        href: "/admin/jobs",
    },
];

export function AppNavigation() {
    const pathname = usePathname();

    const isRecruiterRoute =
        pathname === "/recruiter" ||
        pathname.startsWith("/recruiter/");

    const isAdminRoute =
        pathname === "/admin" ||
        pathname.startsWith("/admin/");

    const navigationItems = isAdminRoute
        ? adminNavigationItems
        : isRecruiterRoute
            ? recruiterNavigationItems
            : studentNavigationItems;

    return (
        <nav
            aria-label="Primary navigation"
            className="border-b bg-white"
        >
            <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-6 sm:px-8">
                {navigationItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(
                            `${item.href}/`,
                        );

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                                isActive
                                    ? "border-black text-black"
                                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
