import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/features/admin-users/api/admin-user-api";

export const ADMIN_USERS_QUERY_KEY = ["admin-users"] as const;

export function useAdminUsers() {
    return useQuery({
        queryKey: ADMIN_USERS_QUERY_KEY,
        queryFn: getAdminUsers,
        staleTime: 30 * 1000,
    });
}
