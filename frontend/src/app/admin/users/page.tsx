"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppErrorState } from "@/components/ui/error-3";
import { useAdminUsers } from "@/features/admin-users/hooks/use-admin-users";
import { useUpdateUserStatus } from "@/features/admin-users/hooks/use-update-user-status";
import { useUpdateUserRole } from "@/features/admin-users/hooks/use-update-user-role";
import { AdminUserTable } from "@/features/admin-users/components/admin-user-table";
import { AdminUserStatusModal } from "@/features/admin-users/components/admin-user-status-modal";
import { AdminUserRoleModal } from "@/features/admin-users/components/admin-user-role-modal";
import { useAuthStore } from "@/stores/auth-store";
import type { AdminUser } from "@/features/admin-users/types/admin-user";
import type { UserRole } from "@/features/auth/api/user-api";

export default function AdminUsersPage() {
    const { data: usersResponse, isLoading, isError, error, refetch } = useAdminUsers();
    const updateStatusMutation = useUpdateUserStatus();
    const updateRoleMutation = useUpdateUserRole();

    const currentUserRole = useAuthStore((state) => state.role);

    const [statusTargetUser, setStatusTargetUser] = useState<AdminUser | null>(null);
    const [roleTargetUser, setRoleTargetUser] = useState<AdminUser | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);

    const users = usersResponse?.data ?? [];

    const handleStatusConfirm = async (user: AdminUser, newStatus: boolean) => {
        try {
            setActionError(null);
            setActionSuccess(null);
            await updateStatusMutation.mutateAsync({
                userId: user.id,
                input: { isActive: newStatus },
            });
            setStatusTargetUser(null);
            setActionSuccess(
                `Successfully ${newStatus ? "activated" : "deactivated"} account for ${user.username}.`,
            );
        } catch (err: unknown) {
            setActionError(
                err instanceof Error ? err.message : "Failed to update user account status.",
            );
        }
    };

    const handleRoleConfirm = async (user: AdminUser, newRole: UserRole) => {
        try {
            setActionError(null);
            setActionSuccess(null);
            await updateRoleMutation.mutateAsync({
                userId: user.id,
                input: { role: newRole },
            });
            setRoleTargetUser(null);
            setActionSuccess(
                `Successfully updated role for ${user.username} to ${newRole}.`,
            );
        } catch (err: unknown) {
            setActionError(
                err instanceof Error ? err.message : "Failed to update user role.",
            );
        }
    };

    if (isLoading) {
        return (
            <main className="mx-auto max-w-6xl p-6 sm:p-8">
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-white" />
                    <p className="mt-4 text-sm font-medium text-zinc-500">
                        Loading platform users directory...
                    </p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="mx-auto max-w-6xl p-6 sm:p-8">
                <AppErrorState
                    title="Unable to load platform users"
                    message={
                        error instanceof Error
                            ? error.message
                            : "An error occurred while loading the user directory. Please try again."
                    }
                    onRetry={() => refetch()}
                />
            </main>
        );
    }

    const totalStudents = users.filter((u) => u.role === "USER").length;
    const totalRecruiters = users.filter((u) => u.role === "RECRUITER").length;
    const totalAdmins = users.filter((u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length;
    const totalActive = users.filter((u) => u.isActive).length;

    return (
        <main className="mx-auto max-w-6xl p-6 sm:p-8">
            <div className="space-y-8">
                {/* Header Row */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Platform User Management
                        </div>

                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                            User Directory & Governance
                        </h1>

                        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                            Review registered accounts, update role permissions, and govern active account statuses.
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Total Users</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                            {users.length}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">{totalActive} active accounts</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Students</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                            {totalStudents}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">Registered candidates</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Recruiters</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                            {totalRecruiters}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">Hiring organization agents</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-xs font-medium text-zinc-500">Administrators</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                            {totalAdmins}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">Admin & Super Admin</p>
                    </div>
                </div>

                {/* Main Users Table */}
                <AdminUserTable
                    users={users}
                    currentUserRole={currentUserRole}
                    onToggleStatus={(user) => {
                        setActionError(null);
                        setActionSuccess(null);
                        setStatusTargetUser(user);
                    }}
                    onChangeRole={(user) => {
                        setActionError(null);
                        setActionSuccess(null);
                        setRoleTargetUser(user);
                    }}
                    isUpdatingStatus={updateStatusMutation.isPending}
                    isUpdatingRole={updateRoleMutation.isPending}
                />

                {/* Modals */}
                <AdminUserStatusModal
                    user={statusTargetUser}
                    isOpen={statusTargetUser !== null}
                    onClose={() => setStatusTargetUser(null)}
                    onConfirm={handleStatusConfirm}
                    isSubmitting={updateStatusMutation.isPending}
                />

                <AdminUserRoleModal
                    user={roleTargetUser}
                    currentUserRole={currentUserRole}
                    isOpen={roleTargetUser !== null}
                    onClose={() => setRoleTargetUser(null)}
                    onConfirm={handleRoleConfirm}
                    isSubmitting={updateRoleMutation.isPending}
                />
            </div>
        </main>
    );
}
