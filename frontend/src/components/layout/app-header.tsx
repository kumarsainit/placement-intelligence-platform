"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

export function AppHeader() {
    const router = useRouter();

    const username = useAuthStore(
        (state) => state.username,
    );

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const clearSession = useAuthStore(
        (state) => state.clearSession,
    );

    const handleLogout = () => {
        clearSession();
        router.replace("/auth");
    };

    if (!accessToken) {
        return null;
    }

    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-6 sm:px-8">
                <Link
                    href="/dashboard"
                    className="shrink-0 text-lg font-bold tracking-tight"
                >
                    Placement Intelligence
                </Link>

                <div className="flex items-center gap-3">
                    {username && (
                        <span className="hidden text-sm text-zinc-600 sm:inline">
                            {username}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg border bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
