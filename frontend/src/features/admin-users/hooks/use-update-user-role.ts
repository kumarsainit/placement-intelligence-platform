import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminUserRole } from "@/features/admin-users/api/admin-user-api";
import { ADMIN_USERS_QUERY_KEY } from "@/features/admin-users/hooks/use-admin-users";
import { ADMIN_ANALYTICS_QUERY_KEY } from "@/features/admin-analytics/hooks/use-admin-analytics";
import type { UpdateUserRoleInput } from "@/features/admin-users/types/admin-user";

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            input,
        }: {
            userId: number;
            input: UpdateUserRoleInput;
        }) => updateAdminUserRole(userId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ADMIN_ANALYTICS_QUERY_KEY });
        },
    });
}
