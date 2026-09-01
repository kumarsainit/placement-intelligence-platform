"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const clearSession = useAuthStore((state) => state.clearSession);

    const logout = (redirectTo: string = "/auth") => {
        // 1. Clear Zustand session state and persisted storage
        clearSession();

        // 2. Wipe TanStack Query cache completely to prevent stale session bleeding
        queryClient.clear();

        // 3. Navigate cleanly to the destination
        router.replace(redirectTo);
    };

    return { logout };
}
