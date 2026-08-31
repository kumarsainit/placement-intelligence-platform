"use client";

import React, { useState } from "react";
import type { AdminUser } from "@/features/admin-users/types/admin-user";
import type { UserRole } from "@/features/auth/api/user-api";

interface AdminUserTableProps {
    users: AdminUser[];
    currentUsername?: string | null;
    currentUserRole?: UserRole | null;
    onToggleStatus: (user: AdminUser) => void;
    onChangeRole: (user: AdminUser) => void;
    isUpdatingStatus?: boolean;
    isUpdatingRole?: boolean;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getRoleBadge(role: UserRole) {
    switch (role) {
        case "SUPER_ADMIN":
            return "bg-zinc-900 text-white border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900";
        case "ADMIN":
            return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300";
        case "RECRUITER":
            return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300";
        case "USER":
        default:
            return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300";
    }
}

export function AdminUserTable({
    users,
    currentUsername,
    currentUserRole,
    onToggleStatus,
    onChangeRole,
    isUpdatingStatus = false,
    isUpdatingRole = false,
}: AdminUserTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(user.id).includes(searchTerm);

        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by username, phone number, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="role-filter" className="text-xs font-semibold text-zinc-500">
                        Role:
                    </label>
                    <select
                        id="role-filter"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                        <option value="ALL">All Roles ({users.length})</option>
                        <option value="USER">Students</option>
                        <option value="RECRUITER">Recruiters</option>
                        <option value="ADMIN">Admins</option>
                        <option value="SUPER_ADMIN">Super Admins</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-zinc-200 bg-zinc-50/80 font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-950/50">
                            <tr>
                                <th className="px-5 py-3.5">User</th>
                                <th className="px-5 py-3.5">Phone Number</th>
                                <th className="px-5 py-3.5">Role</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Created Date</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-xs text-zinc-400"
                                    >
                                        No platform users match your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const isSelf = user.username === currentUsername;
                                    const isTargetAdminOrSuper =
                                        user.role === "ADMIN" || user.role === "SUPER_ADMIN";
                                    const isCallerAdmin = currentUserRole === "ADMIN";

                                    // Admin cannot modify other admins or themselves
                                    const canModifyRole =
                                        !isSelf && (!isCallerAdmin || !isTargetAdminOrSuper);
                                    const canModifyStatus =
                                        !isSelf && (!isCallerAdmin || !isTargetAdminOrSuper);

                                    return (
                                        <tr
                                            key={user.id}
                                            className="transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                        {user.username.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-semibold text-zinc-900 dark:text-white">
                                                                {user.username}
                                                            </span>
                                                            {isSelf && (
                                                                <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-zinc-400">
                                                            ID: #{user.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 font-mono text-zinc-700 dark:text-zinc-300">
                                                {user.phoneNumber}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-block rounded-md border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${getRoleBadge(
                                                        user.role,
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                                        user.isActive
                                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                            : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            user.isActive
                                                                ? "bg-emerald-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    />
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-zinc-500">
                                                {formatDate(user.createdAt)}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onChangeRole(user)}
                                                        disabled={
                                                            !canModifyRole ||
                                                            isUpdatingRole ||
                                                            isUpdatingStatus
                                                        }
                                                        className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                                    >
                                                        Change Role
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onToggleStatus(user)}
                                                        disabled={
                                                            !canModifyStatus ||
                                                            isUpdatingStatus ||
                                                            isUpdatingRole
                                                        }
                                                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                                            user.isActive
                                                                ? "border border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                                                                : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                                        }`}
                                                    >
                                                        {user.isActive ? "Deactivate" : "Activate"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
