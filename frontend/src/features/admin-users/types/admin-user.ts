import type { UserRole } from "@/features/auth/api/user-api";

export interface AdminUser {
    id: number;
    username: string;
    phoneNumber: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserStatusInput {
    isActive: boolean;
}

export interface UpdateUserRoleInput {
    role: UserRole;
}
