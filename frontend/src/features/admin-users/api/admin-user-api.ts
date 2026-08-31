import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
    AdminUser,
    UpdateUserRoleInput,
    UpdateUserStatusInput,
} from "@/features/admin-users/types/admin-user";

const ADMIN_USERS_ENDPOINT = "/v1/admin/users";

export async function getAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
    return apiClient<AdminUser[]>(ADMIN_USERS_ENDPOINT, {
        method: "GET",
    });
}

export async function getAdminUserById(
    userId: number,
): Promise<ApiResponse<AdminUser>> {
    return apiClient<AdminUser>(`${ADMIN_USERS_ENDPOINT}/${userId}`, {
        method: "GET",
    });
}

export async function updateAdminUserStatus(
    userId: number,
    input: UpdateUserStatusInput,
): Promise<ApiResponse<AdminUser>> {
    return apiClient<AdminUser>(`${ADMIN_USERS_ENDPOINT}/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}

export async function updateAdminUserRole(
    userId: number,
    input: UpdateUserRoleInput,
): Promise<ApiResponse<AdminUser>> {
    return apiClient<AdminUser>(`${ADMIN_USERS_ENDPOINT}/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}
