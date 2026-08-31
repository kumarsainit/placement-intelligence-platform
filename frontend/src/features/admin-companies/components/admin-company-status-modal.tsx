"use client";

import React from "react";
import type { Company } from "@/features/company/types/company";

interface AdminCompanyStatusModalProps {
    company: Company | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (company: Company, newStatus: boolean) => Promise<void>;
    isSubmitting?: boolean;
}

export function AdminCompanyStatusModal({
    company,
    isOpen,
    onClose,
    onConfirm,
    isSubmitting = false,
}: AdminCompanyStatusModalProps) {
    if (!isOpen || !company) return null;

    const willDeactivate = company.isActive;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            willDeactivate
                                ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                        }`}
                    >
                        {willDeactivate ? "🏢" : "✓"}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                            {willDeactivate ? "Deactivate Company" : "Activate Company"}
                        </h3>
                        <p className="text-xs text-zinc-500">{company.name}</p>
                    </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {willDeactivate
                        ? `Are you sure you want to deactivate ${company.name}? Inactive companies will not appear in student job searches or public partner catalogs.`
                        : `Are you sure you want to activate ${company.name}? The company will be active and available for recruiter job postings and student placement drives.`}
                </p>

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
                        onClick={() => onConfirm(company, !company.isActive)}
                        disabled={isSubmitting}
                        className={`rounded-xl px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50 ${
                            willDeactivate
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                    >
                        {isSubmitting
                            ? "Updating..."
                            : willDeactivate
                            ? "Confirm Deactivation"
                            : "Confirm Activation"}
                    </button>
                </div>
            </div>
        </div>
    );
}
