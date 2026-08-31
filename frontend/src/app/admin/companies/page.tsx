"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppErrorState } from "@/components/ui/error-3";
import { useAdminCompanies } from "@/features/admin-companies/hooks/use-admin-companies";
import { useUpdateCompanyStatus } from "@/features/admin-companies/hooks/use-update-company-status";
import { AdminCompanyTable } from "@/features/admin-companies/components/admin-company-table";
import { AdminCompanyStatusModal } from "@/features/admin-companies/components/admin-company-status-modal";
import type { Company } from "@/features/company/types/company";

export default function AdminCompaniesPage() {
    const { data: companiesResponse, isLoading, isError, error, refetch } = useAdminCompanies();
    const updateStatusMutation = useUpdateCompanyStatus();

    const [statusTargetCompany, setStatusTargetCompany] = useState<Company | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);

    const companies = companiesResponse?.data ?? [];

    const handleStatusConfirm = async (company: Company, newStatus: boolean) => {
        try {
            setActionError(null);
            setActionSuccess(null);
            await updateStatusMutation.mutateAsync({
                companyId: company.id,
                input: { isActive: newStatus },
            });
            setStatusTargetCompany(null);
            setActionSuccess(
                `Successfully ${newStatus ? "activated" : "deactivated"} ${company.name}.`,
            );
        } catch (err: unknown) {
            setActionError(
                err instanceof Error ? err.message : "Failed to update company status.",
            );
        }
    };

    if (isLoading) {
        return (
            <main className="mx-auto max-w-6xl p-6 sm:p-8">
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-white" />
                    <p className="mt-4 text-sm font-medium text-zinc-500">
                        Loading corporate partner directory...
                    </p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="mx-auto max-w-6xl p-6 sm:p-8">
                <AppErrorState
                    title="Unable to load corporate directory"
                    message={
                        error instanceof Error
                            ? error.message
                            : "An error occurred while loading companies. Please try again."
                    }
                    onRetry={() => refetch()}
                />
            </main>
        );
    }

    const totalActive = companies.filter((c) => c.isActive).length;
    const totalInactive = companies.filter((c) => !c.isActive).length;

    return (
        <main className="mx-auto max-w-6xl p-6 sm:p-8">
            <div className="space-y-8">
                {/* Header Row */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Corporate Partner Governance
                        </div>

                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                            Company Directory
                        </h1>

                        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                            Oversee registered employers, verify organization credentials, and manage active partner status.
                        </p>
                    </div>

                    <div className="flex gap-2.5">
                        <Link
                            href="/admin/dashboard"
                            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            ← Analytics Dashboard
                        </Link>
                    </div>
                </header>

                {/* Feedback Alerts */}
                {actionSuccess && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <span>✓ {actionSuccess}</span>
                        <button
                            type="button"
                            onClick={() => setActionSuccess(null)}
                            className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {actionError && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                        <span>⚠️ {actionError}</span>
                        <button
                            type="button"
                            onClick={() => setActionError(null)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Summary Metrics */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Total Companies</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                            {companies.length}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">Registered hiring organizations</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Active Partners</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {totalActive}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">Permitted to post job listings</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Inactive Companies</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-500 dark:text-zinc-400">
                            {totalInactive}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">Deactivated / Under review</p>
                    </div>
                </div>

                {/* Main Companies Table */}
                <AdminCompanyTable
                    companies={companies}
                    onToggleStatus={(company) => {
                        setActionError(null);
                        setActionSuccess(null);
                        setStatusTargetCompany(company);
                    }}
                    isUpdatingStatus={updateStatusMutation.isPending}
                />

                {/* Status Confirmation Modal */}
                <AdminCompanyStatusModal
                    company={statusTargetCompany}
                    isOpen={statusTargetCompany !== null}
                    onClose={() => setStatusTargetCompany(null)}
                    onConfirm={handleStatusConfirm}
                    isSubmitting={updateStatusMutation.isPending}
                />
            </div>
        </main>
    );
}
