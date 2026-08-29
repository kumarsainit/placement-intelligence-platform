"use client";

import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/features/auth/components/auth-guard";

interface StudentLayoutProps {
    children: ReactNode;
}

export default function StudentLayout({
                                          children,
                                      }: StudentLayoutProps) {
    return (
        <AuthGuard allowedRole="USER">
            <AppShell>{children}</AppShell>
        </AuthGuard>
    );
}
