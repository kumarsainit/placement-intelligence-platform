import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/features/auth/api/user-api";
import { useAuthStore } from "@/stores/auth-store";

export function useCurrentUser() {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const hasHydrated = useAuthStore(
        (state) => state.hasHydrated,
    );

    return useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        enabled: hasHydrated && Boolean(accessToken),
        staleTime: 5 * 60 * 1000,
    });
}
