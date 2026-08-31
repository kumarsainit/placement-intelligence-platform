"use client";

import React from "react";
import Link from "next/link";
import { CamPlaceLogo } from "@/components/shared/camplace-logo";

export interface FooterLink {
    label: string;
    href: string;
}

export interface Footer25Props {
    brandName?: string;
    description?: string;
    links?: FooterLink[];
}

export function Footer25({
    brandName = "CamPlace",
    description = "CamPlace connects ambitious students, verified hiring employers, and smart career matching intelligence into one unified platform.",
    links = [
        { label: "Opportunities", href: "/jobs" },
        { label: "For Students", href: "/auth?role=student" },
        { label: "For Recruiters", href: "/auth?role=recruiter" },
        { label: "Sign In", href: "/auth" },
    ],
}: Footer25Props) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-md">
                        <CamPlaceLogo size="md" showTagline={true} />

                        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    </div>

                    <nav className="flex flex-wrap items-center gap-6 text-xs font-semibold" aria-label="Footer Navigation">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="transition-colors hover:text-indigo-600 dark:hover:text-cyan-400"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-900 sm:flex sm:items-center sm:justify-between">
                    <p>© {currentYear} {brandName}. All rights reserved.</p>
                    <p className="mt-2 sm:mt-0 font-medium">
                        Connecting talent with career opportunities.
                    </p>
                </div>
            </div>
        </footer>
    );
}
