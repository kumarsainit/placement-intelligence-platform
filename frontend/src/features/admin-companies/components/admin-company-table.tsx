"use client";

import React, { useState } from "react";
import type { Company } from "@/features/company/types/company";

interface AdminCompanyTableProps {
    companies: Company[];
    onToggleStatus: (company: Company) => void;
    isUpdatingStatus?: boolean;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function AdminCompanyTable({
    companies,
    onToggleStatus,
    isUpdatingStatus = false,
}: AdminCompanyTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const filteredCompanies = companies.filter((comp) => {
        const matchesSearch =
            comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (comp.industry && comp.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (comp.location && comp.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
            String(comp.id).includes(searchTerm);

        const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter === "ACTIVE" && comp.isActive) ||
            (statusFilter === "INACTIVE" && !comp.isActive);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by company name, industry, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="company-status-filter" className="text-xs font-semibold text-zinc-500">
                        Status:
                    </label>
                    <select
                        id="company-status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                        <option value="ALL">All ({companies.length})</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Companies Table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-zinc-200 bg-zinc-50/80 font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-950/50">
                            <tr>
                                <th className="px-5 py-3.5">Company</th>
                                <th className="px-5 py-3.5">Industry</th>
                                <th className="px-5 py-3.5">Location</th>
                                <th className="px-5 py-3.5">Website</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Created Date</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                            {filteredCompanies.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-10 text-center text-xs text-zinc-400"
                                    >
                                        No registered companies match your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredCompanies.map((company) => (
                                    <tr
                                        key={company.id}
                                        className="transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                    {company.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-zinc-900 dark:text-white">
                                                        {company.name}
                                                    </span>
                                                    <p className="text-[11px] text-zinc-400">
                                                        ID: #{company.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-zinc-700 dark:text-zinc-300">
                                            {company.industry || "—"}
                                        </td>

                                        <td className="px-5 py-4 text-zinc-700 dark:text-zinc-300">
                                            {company.location || "—"}
                                        </td>

                                        <td className="px-5 py-4">
                                            {company.website ? (
                                                <a
                                                    href={
                                                        company.website.startsWith("http")
                                                            ? company.website
                                                            : `https://${company.website}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    {company.website}
                                                </a>
                                            ) : (
                                                <span className="text-zinc-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                                    company.isActive
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                        : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        company.isActive
                                                            ? "bg-emerald-500"
                                                            : "bg-red-500"
                                                    }`}
                                                />
                                                {company.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-zinc-500">
                                            {formatDate(company.createdAt)}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => onToggleStatus(company)}
                                                disabled={isUpdatingStatus}
                                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                                    company.isActive
                                                        ? "border border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                                                        : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                                }`}
                                            >
                                                {company.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
