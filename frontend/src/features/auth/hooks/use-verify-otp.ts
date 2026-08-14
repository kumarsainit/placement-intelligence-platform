import { useMutation } from "@tanstack/react-query";

import { verifyOtp } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";
import type { VerifyOtpRequest } from "@/types/auth";

export function useVerifyOtp() {
    const setSession = useAuthStore((state) => state.setSession);

    return useMutation({
        mutationFn: (request: VerifyOtpRequest) => verifyOtp(request),

        onSuccess: (response) => {
            setSession({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                username: response.data.username,
                phoneNumber: response.data.phoneNumber,
            });
        },
    });
}
