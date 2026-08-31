import React, { type ReactNode } from "react";

interface DashboardSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    action?: ReactNode;
}

export function DashboardSection({
    title,
    description,
    children,
    action,
}: DashboardSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    )}
                </div>
                {action && <div>{action}</div>}
            </div>

            {children}
        </section>
    );
}
