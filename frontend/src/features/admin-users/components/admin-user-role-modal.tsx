"use client";

import React, { useState } from "react";
import type { AdminUser } from "@/features/admin-users/types/admin-user";
import type { UserRole } from "@/features/auth/api/user-api";

interface AdminUserRoleModalProps {
    user: AdminUser | null;
    currentUserRole?: UserRole | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (user: AdminUser, newRole: UserRole) => Promise<void>;
    isSubmitting?: boolean;
}

const allRoleOptions: { role: UserRole; title: string; description: string; superAdminOnly?: boolean }[] = [
    {
        role: "USER",
        title: "Student (USER)",
        description: "Access to student profile, education, resumes, job discovery, and application submission.",
    },
    {
        role: "RECRUITER",
        title: "Recruiter (RECRUITER)",
        description: "Access to company profile management, posting job listings, applicant review, and status progression.",
    },
    {
        role: "ADMIN",
        title: "Administrator (ADMIN)",
        description: "Access to institutional analytics, placement metrics, and standard user management.",
        superAdminOnly: true,
    },
    {
        role: "SUPER_ADMIN",
        title: "Super Administrator (SUPER_ADMIN)",
        description: "Root administrative access with full authority over roles, administrators, and platform configuration.",
        superAdminOnly: true,
    },
];

interface RoleFormContentProps {
    user: AdminUser;
    currentUserRole?: UserRole | null;
    onClose: () => void;
    onConfirm: (user: AdminUser, newRole: UserRole) => Promise<void>;
    isSubmitting: boolean;
}

function RoleFormContent({
    user,
    currentUserRole,
    onClose,
    onConfirm,
    isSubmitting,
}: RoleFormContentProps) {
    const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

    const isSuperAdmin = currentUserRole === "SUPER_ADMIN";
    const availableRoles = allRoleOptions.filter(
        (opt) => !opt.superAdminOnly || isSuperAdmin,
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        🛡️
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                            Modify User Role
                        </h3>
                        <p className="text-xs text-zinc-500">
                            {user.username} ({user.phoneNumber}) — Current Role: <span className="font-bold">{user.role}</span>
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-2.5">
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Select Target Role:
                    </p>

                    <div className="space-y-2">
                        {availableRoles.map((option) => (
                            <label
                                key={option.role}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                                    selectedRole === option.role
                                        ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                                        : "border-zinc-200 hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="user-role"
                                    value={option.role}
                                    checked={selectedRole === option.role}
                                    onChange={() => setSelectedRole(option.role)}
                                    className="mt-0.5 h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                                        {option.title}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                        {option.description}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={() => onConfirm(user, selectedRole)}
                        disabled={isSubmitting || selectedRole === user.role}
                        className="rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        {isSubmitting ? "Updating Role..." : "Update Role"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AdminUserRoleModal(props: AdminUserRoleModalProps) {
    if (!props.isOpen || !props.user) return null;

    return (
        <RoleFormContent
            user={props.user}
            currentUserRole={props.currentUserRole}
            onClose={props.onClose}
            onConfirm={props.onConfirm}
            isSubmitting={props.isSubmitting ?? false}
        />
    );
}
