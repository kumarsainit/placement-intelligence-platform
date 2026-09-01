"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    LayoutDashboard,
    LogOut,
    GraduationCap,
    Building2,
    ShieldCheck,
} from "lucide-react";
import { CamPlaceLogo } from "@/components/shared/camplace-logo";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { cn } from "@/lib/utils";

export interface NavigationItem {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export function Navigation5() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { logout } = useLogout();

    const accessToken = useAuthStore((state) => state.accessToken);
    const username = useAuthStore((state) => state.username);
    const role = useAuthStore((state) => state.role);

    // Public / Guest Links
    const publicLinks: NavigationItem[] = [
        { label: "Find Opportunities", href: "/jobs" },
        { label: "For Students", href: "/auth?role=student" },
        { label: "For Recruiters", href: "/auth?role=recruiter" },
    ];

    // Authenticated Role Links
    const studentLinks: NavigationItem[] = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Opportunities", href: "/jobs" },
        { label: "Applications", href: "/applications" },
        { label: "Profile", href: "/profile" },
        { label: "Resume", href: "/resume" },
    ];

    const recruiterLinks: NavigationItem[] = [
        { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
        { label: "Jobs", href: "/recruiter/jobs" },
        { label: "Companies", href: "/recruiter/companies" },
        { label: "Profile", href: "/recruiter/profile" },
    ];

    const adminLinks: NavigationItem[] = [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Users", href: "/admin/users" },
        { label: "Companies", href: "/admin/companies" },
        { label: "Jobs", href: "/admin/jobs" },
    ];

    const navLinks = !accessToken
        ? publicLinks
        : role === "ADMIN" || role === "SUPER_ADMIN"
        ? adminLinks
        : role === "RECRUITER"
        ? recruiterLinks
        : studentLinks;

    const roleBadge =
        role === "SUPER_ADMIN" ? (
            <span className="flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-950/60 px-2.5 py-0.5 text-[11px] font-bold text-purple-300">
                <ShieldCheck className="size-3" />
                <span>Super Admin</span>
            </span>
        ) : role === "ADMIN" ? (
            <span className="flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-950/60 px-2.5 py-0.5 text-[11px] font-bold text-purple-300">
                <ShieldCheck className="size-3" />
                <span>Admin</span>
            </span>
        ) : role === "RECRUITER" ? (
            <span className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
                <Building2 className="size-3" />
                <span>Recruiter</span>
            </span>
        ) : accessToken ? (
            <span className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300">
                <GraduationCap className="size-3" />
                <span>Student</span>
            </span>
        ) : null;

    return (
        <nav
            aria-label="Main Navigation"
            className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <div className="flex items-center gap-3">
                    <Link
                        href={
                            !accessToken
                                ? "/"
                                : role === "ADMIN" || role === "SUPER_ADMIN"
                                ? "/admin/dashboard"
                                : role === "RECRUITER"
                                ? "/recruiter/dashboard"
                                : "/dashboard"
                        }
                        className="flex items-center gap-2.5 transition hover:opacity-90"
                    >
                        <CamPlaceLogo size="md" variant="light" showTagline={false} />
                    </Link>

                    {roleBadge && <div className="hidden md:block">{roleBadge}</div>}
                </div>

                {/* Desktop Nav Items (Floating Pill Style) */}
                <div className="hidden md:flex md:items-center md:gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 p-1 backdrop-blur-md">
                    {navLinks.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/" &&
                                item.href !== "/dashboard" &&
                                item.href !== "/recruiter/dashboard" &&
                                item.href !== "/admin/dashboard" &&
                                pathname.startsWith(`${item.href}/`));

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-xs"
                                        : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Action Bar */}
                <div className="hidden md:flex md:items-center md:gap-3">
                    {accessToken ? (
                        <div className="flex items-center gap-3">
                            {username && (
                                <span className="text-xs font-semibold text-slate-300 max-w-[140px] truncate">
                                    {username}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => logout("/auth")}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                                <LogOut className="size-3.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/auth"
                                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:text-white"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth?role=student"
                                className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-500"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Sheet / Drawer Menu */}
            {mobileMenuOpen && (
                <div className="border-b border-slate-800 bg-slate-950 p-4 md:hidden">
                    <div className="space-y-1">
                        {navLinks.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "block rounded-xl px-3.5 py-2 text-sm font-semibold transition",
                                    pathname === item.href
                                        ? "bg-indigo-600 text-white"
                                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4 border-t border-slate-800 pt-4">
                        {accessToken ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout("/auth");
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                            >
                                <LogOut className="size-4" />
                                <span>Sign Out ({username ?? "Active User"})</span>
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/auth"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-xl border border-slate-800 py-2 text-center text-xs font-semibold text-slate-300"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth?role=student"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-xl bg-indigo-600 py-2 text-center text-xs font-bold text-white"
                                >
                                    Get Started as Student
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navigation5;
