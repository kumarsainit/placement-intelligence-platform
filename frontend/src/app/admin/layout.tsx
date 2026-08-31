"use client";

import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/features/auth/components/auth-guard";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({
                                        children,
                                    }: AdminLayoutProps) {
    return (
        <AuthGuard allowedRole={["ADMIN", "SUPER_ADMIN"]}>
            <AppShell>{children}</AppShell>
        </AuthGuard>
    );
}
