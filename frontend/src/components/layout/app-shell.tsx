"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppNavigation } from "@/components/layout/app-navigation";
import { AppFooter } from "@/components/layout/app-footer";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <AppHeader />
            <AppNavigation />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>

            <AppFooter />
        </div>
    );
}
