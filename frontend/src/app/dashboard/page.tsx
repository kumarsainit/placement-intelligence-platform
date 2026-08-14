"use client";

import { useRouter } from "next/navigation";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
    const router = useRouter();

    const clearSession = useAuthStore(
        (state) => state.clearSession,
    );

    const {
        data,
        isLoading,
        isError,
    } = useCurrentUser();

    const handleLogout = () => {
        clearSession();
        router.replace("/auth");
    };

    return (
        <AuthGuard>
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-5xl">
                    <header className="flex items-center justify-between border-b pb-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Placement Intelligence
                            </h1>

                            {isLoading && (
                                <p className="mt-2 text-zinc-600">
                                    Loading your profile...
                                </p>
                            )}

                            {isError && (
                                <p className="mt-2 text-red-600">
                                    Unable to load your profile.
                                </p>
                            )}

                            {data?.data && (
                                <p className="mt-2 text-zinc-600">
                                    Welcome, {data.data.username}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-100"
                        >
                            Logout
                        </button>
                    </header>

                    <section className="mt-8">
                        <h2 className="text-xl font-semibold">
                            Dashboard
                        </h2>

                        <p className="mt-2 text-zinc-600">
                            Your placement intelligence workspace.
                        </p>
                    </section>
                </div>
            </main>
        </AuthGuard>
    );
}
