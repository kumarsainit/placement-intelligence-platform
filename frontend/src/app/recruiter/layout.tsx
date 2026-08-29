"use client";

import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/features/auth/components/auth-guard";

interface RecruiterLayoutProps {
    children: ReactNode;
}

export default function RecruiterLayout({
                                            children,
                                        }: RecruiterLayoutProps) {
    return (
        <AuthGuard allowedRole="RECRUITER">
            <AppShell>{children}</AppShell>
        </AuthGuard>
    );
}
