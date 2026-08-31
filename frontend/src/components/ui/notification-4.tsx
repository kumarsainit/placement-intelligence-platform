import React from "react";
import { cn } from "@/lib/utils";

export interface NotificationSource {
    name: string;
    initials: string;
    avatar?: string;
}

export interface NotificationEvent {
    id: string;
    source: NotificationSource;
    title: string;
    subtitle: string;
    timestamp: string;
    unread?: boolean;
}

export interface NotificationGroup {
    id: string;
    label: string;
    items: NotificationEvent[];
}

export interface Notification4Props {
    title?: string;
    countLabel?: string;
    groups?: NotificationGroup[];
    onDismiss?: () => void;
    className?: string;
}

export function Notification4({
    title = "Notifications",
    countLabel,
    groups = [],
    onDismiss,
    className,
}: Notification4Props) {
    const unreadCount = groups.reduce(
        (total, group) =>
            total + group.items.filter((item) => item.unread).length,
        0,
    );

    return (
        <section
            className={cn(
                "flex items-center justify-center p-4",
                className,
            )}
        >
            <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between px-2 pb-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
                            {title}
                        </h2>
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700 tabular-nums dark:bg-zinc-800 dark:text-zinc-300">
                            {countLabel ?? `${unreadCount}`}
                        </span>
                    </div>

                    {onDismiss && (
                        <button
                            type="button"
                            onClick={onDismiss}
                            aria-label="Close notifications"
                            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {groups.length === 0 ? (
                        <p className="py-8 text-center text-xs text-zinc-500">
                            No new notifications
                        </p>
                    ) : (
                        groups.map((group) => (
                            <div
                                key={group.id}
                                className="overflow-hidden rounded-2xl bg-white p-3 shadow-xs dark:bg-zinc-950"
                            >
                                <p className="px-2 pt-1 text-xs font-medium text-zinc-500">
                                    {group.label}
                                </p>

                                <div className="mt-2 space-y-1.5">
                                    {group.items.map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                {event.source.initials}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-semibold text-zinc-900 dark:text-white">
                                                    {event.title}
                                                </p>
                                                <p className="truncate text-[11px] text-zinc-500">
                                                    {event.subtitle}
                                                </p>
                                            </div>

                                            <span className="text-[10px] text-zinc-400">
                                                {event.timestamp}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
