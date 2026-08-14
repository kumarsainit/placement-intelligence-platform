"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const hasHydrated = useAuthStore(
        (state) => state.hasHydrated,
    );

    useEffect(() => {
        if (hasHydrated && !accessToken) {
            router.replace("/auth");
        }
    }, [hasHydrated, accessToken, router]);

    if (!hasHydrated) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-zinc-500">
                    Loading...
                </p>
            </main>
        );
    }

    if (!accessToken) {
        return null;
    }

    return <>{children}</>;
}
