import React from "react";

export interface DistributionItem {
    label: string;
    value: number;
    color: string;
    subLabel?: string;
}

interface AdminDistributionCardProps {
    title: string;
    description: string;
    items: DistributionItem[];
}

export function AdminDistributionCard({
    title,
    description,
    items,
}: AdminDistributionCardProps) {
    const total = items.reduce((acc, curr) => acc + curr.value, 0);
    const safeTotal = total > 0 ? total : 1;

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                {title}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {description}
            </p>

            {total > 0 ? (
                <div className="mt-5 space-y-4">
                    {/* Progress Bar */}
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        {items.map(
                            (item) =>
                                item.value > 0 && (
                                    <div
                                        key={item.label}
                                        style={{ width: `${(item.value / safeTotal) * 100}%` }}
                                        className={`h-full first:rounded-l-full last:rounded-r-full ${item.color}`}
                                        title={`${item.label}: ${item.value}`}
                                    />
                                ),
                        )}
                    </div>

                    {/* Breakdown list */}
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                        {items.map((item) => {
                            const pct = Math.round((item.value / safeTotal) * 100);
                            return (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between py-2 text-xs"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {item.label}
                                        </span>
                                        {item.subLabel && (
                                            <span className="text-zinc-400">
                                                ({item.subLabel})
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-zinc-900 dark:text-white">
                                            {item.value}
                                        </span>
                                        <span className="text-zinc-400">
                                            ({pct}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="mt-6 py-6 text-center text-xs text-zinc-400">
                    No data available to display.
                </p>
            )}
        </div>
    );
}
