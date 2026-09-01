"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Building2, ShieldCheck, GraduationCap } from "lucide-react";
import { CamPlaceLogo } from "@/components/shared/camplace-logo";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/features/auth/hooks/use-logout";

export function AppHeader() {
    const pathname = usePathname();
    const { logout } = useLogout();

    const username = useAuthStore((state) => state.username);
    const role = useAuthStore((state) => state.role);
    const accessToken = useAuthStore((state) => state.accessToken);

    const isRecruiterRoute =
        pathname === "/recruiter" || pathname.startsWith("/recruiter/");

    const isAdminRoute =
        pathname === "/admin" || pathname.startsWith("/admin/");

    const homeHref = isAdminRoute
        ? "/admin/dashboard"
        : isRecruiterRoute
        ? "/recruiter/dashboard"
        : "/dashboard";

    if (!accessToken) {
        return null;
    }

    const roleBadge =
        role === "SUPER_ADMIN" ? (
            <span className="flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300">
                <ShieldCheck className="size-3" />
                <span>Super Admin</span>
            </span>
        ) : role === "ADMIN" ? (
            <span className="flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300">
                <ShieldCheck className="size-3" />
                <span>Admin</span>
            </span>
        ) : role === "RECRUITER" ? (
            <span className="flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300">
                <Building2 className="size-3" />
                <span>Recruiter</span>
            </span>
        ) : (
            <span className="flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                <GraduationCap className="size-3" />
                <span>Student</span>
            </span>
        );

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Link
                        href={homeHref}
                        className="flex items-center gap-2 transition hover:opacity-90"
                    >
                        <CamPlaceLogo size="md" showTagline={false} />
                    </Link>
                    <div className="hidden sm:block">{roleBadge}</div>
                </div>

                <div className="flex items-center gap-3">
                    {username && (
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            <div className="size-2 rounded-full bg-emerald-500" />
                            <span className="max-w-[120px] truncate sm:max-w-[200px]">{username}</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => logout("/auth")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <LogOut className="size-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Log out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
