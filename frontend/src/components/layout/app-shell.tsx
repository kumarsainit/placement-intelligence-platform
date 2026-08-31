"use client";

import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppNavigation } from "@/components/layout/app-navigation";
import { AppFooter } from "@/components/layout/app-footer";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({
                             children,
                         }: AppShellProps) {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <AppHeader />
            <AppNavigation />

            <main className="flex-1">
                {children}
            </main>

            <AppFooter />
        </div>
    );
}
