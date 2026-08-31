"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { UserRole } from "@/features/auth/api/user-api";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

interface AuthGuardProps {
    children: ReactNode;
    allowedRole?: UserRole | UserRole[];
}

export function AuthGuard({
                              children,
                              allowedRole,
                          }: AuthGuardProps) {
    const router = useRouter();

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const hasHydrated = useAuthStore(
        (state) => state.hasHydrated,
    );

    const setRole = useAuthStore(
        (state) => state.setRole,
    );

    const clearSession = useAuthStore(
        (state) => state.clearSession,
    );

    const currentUserQuery = useCurrentUser();

    const currentUser = currentUserQuery.data?.data;

    /*
     * Keep the role stored in Zustand synchronized
     * with the authenticated user returned by the backend.
     */
    useEffect(() => {
        if (currentUser?.role) {
            setRole(currentUser.role);
        }
    }, [currentUser?.role, setRole]);

    /*
     * Redirect unauthenticated users to /auth.
     */
    useEffect(() => {
        if (hasHydrated && !accessToken) {
            router.replace("/auth");
        }
    }, [
        hasHydrated,
        accessToken,
        router,
    ]);

    /*
     * If fetching the current user fails, clear the
     * session and send the user back to authentication.
     */
    useEffect(() => {
        if (
            hasHydrated &&
            accessToken &&
            currentUserQuery.isError
        ) {
            clearSession();
            router.replace("/auth");
        }
    }, [
        hasHydrated,
        accessToken,
        currentUserQuery.isError,
        clearSession,
        router,
    ]);

    /*
     * Wait for Zustand persistence hydration.
     */
    if (!hasHydrated) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-zinc-500">
                    Loading...
                </p>
            </main>
        );
    }

    /*
     * Navigation to /auth is handled by the effect above.
     */
    if (!accessToken) {
        return null;
    }

    /*
     * Wait until the backend returns the authenticated
     * user's information.
     */
    if (
        currentUserQuery.isPending ||
        !currentUser
    ) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-zinc-500">
                    Loading...
                </p>
            </main>
        );
    }

    return (
        <RoleGuardRedirect
            currentRole={currentUser.role}
            allowedRole={allowedRole}
            router={router}
        >
            {children}
        </RoleGuardRedirect>
    );
}

interface RoleGuardRedirectProps {
    currentRole: UserRole;
    allowedRole?: UserRole | UserRole[];
    router: ReturnType<typeof useRouter>;
    children: ReactNode;
}

function getRoleRedirectPath(role: UserRole): string {
    switch (role) {
        case "RECRUITER":
            return "/recruiter/dashboard";
        case "ADMIN":
        case "SUPER_ADMIN":
            return "/admin/dashboard";
        case "USER":
        default:
            return "/dashboard";
    }
}

function isRoleAllowed(
    currentRole: UserRole,
    allowedRole?: UserRole | UserRole[],
): boolean {
    if (!allowedRole) {
        return true;
    }
    if (Array.isArray(allowedRole)) {
        return allowedRole.includes(currentRole);
    }
    return currentRole === allowedRole;
}

function RoleGuardRedirect({
                               currentRole,
                               allowedRole,
                               router,
                               children,
                           }: RoleGuardRedirectProps) {
    const isAllowed = isRoleAllowed(currentRole, allowedRole);

    useEffect(() => {
        if (!isAllowed) {
            const redirectPath = getRoleRedirectPath(currentRole);
            router.replace(redirectPath);
        }
    }, [
        isAllowed,
        currentRole,
        router,
    ]);

    /*
     * Role mismatch:
     * navigation is being handled by useEffect.
     */
    if (!isAllowed) {
        return null;
    }

    return <>{children}</>;
}
