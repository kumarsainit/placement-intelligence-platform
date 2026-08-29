import { create } from "zustand";

import { persist } from "zustand/middleware";

import type { UserRole } from "@/features/auth/api/user-api";

interface AuthSession {
    accessToken: string;
    refreshToken: string;
    username: string;
    phoneNumber: string;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    username: string | null;
    phoneNumber: string | null;
    role: UserRole | null;
    hasHydrated: boolean;
    setSession: (session: AuthSession) => void;
    setRole: (role: UserRole) => void;
    clearSession: () => void;
    setHasHydrated: (hasHydrated: boolean) => void;
}

const initialState = {
    accessToken: null,
    refreshToken: null,
    username: null,
    phoneNumber: null,
    role: null,
    hasHydrated: false,
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            ...initialState,

            setSession: (session) =>
                set({
                    accessToken: session.accessToken,
                    refreshToken: session.refreshToken,
                    username: session.username,
                    phoneNumber: session.phoneNumber,
                    role: null,
                }),

            setRole: (role) =>
                set({
                    role,
                }),

            clearSession: () =>
                set({
                    accessToken: null,
                    refreshToken: null,
                    username: null,
                    phoneNumber: null,
                    role: null,
                }),

            setHasHydrated: (hasHydrated) =>
                set({ hasHydrated }),
        }),

        {
            name: "placement-intelligence-auth",

            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                username: state.username,
                phoneNumber: state.phoneNumber,
                role: state.role,
            }),

            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    ),
);
