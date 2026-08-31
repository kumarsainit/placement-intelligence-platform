"use client";

import { usePathname } from "next/navigation";
import { Footer25, type FooterLink } from "@/components/ui/footer-25";

const studentFooterLinks: FooterLink[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Find Jobs", href: "/jobs" },
    { label: "My Applications", href: "/applications" },
    { label: "Profile", href: "/profile" },
    { label: "Resume", href: "/resume" },
];

const recruiterFooterLinks: FooterLink[] = [
    { label: "Recruiter Dashboard", href: "/recruiter/dashboard" },
    { label: "Manage Jobs", href: "/recruiter/jobs" },
    { label: "Companies", href: "/recruiter/companies" },
    { label: "Recruiter Profile", href: "/recruiter/profile" },
];

const adminFooterLinks: FooterLink[] = [
    { label: "Admin Dashboard", href: "/admin/dashboard" },
];

export function AppFooter() {
    const pathname = usePathname();

    const isRecruiterRoute =
        pathname === "/recruiter" || pathname.startsWith("/recruiter/");

    const isAdminRoute =
        pathname === "/admin" || pathname.startsWith("/admin/");

    const links = isAdminRoute
        ? adminFooterLinks
        : isRecruiterRoute
            ? recruiterFooterLinks
            : studentFooterLinks;

    return <Footer25 links={links} />;
}
