import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  phoneNumber: string | null;

  setSession: (session: {
    accessToken: string;
    refreshToken: string;
    username: string;
    phoneNumber: string;
  }) => void;

  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  username: null,
  phoneNumber: null,

  setSession: (session) => set(session),

  clearSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      username: null,
      phoneNumber: null,
    }),
}));
