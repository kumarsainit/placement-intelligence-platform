import { useMutation } from "@tanstack/react-query";

import { sendOtp } from "@/features/auth/api/auth-api";
import type { SendOtpRequest } from "@/types/auth";

export function useSendOtp() {
    return useMutation({
        mutationFn: (request: SendOtpRequest) => sendOtp(request),
    });
}
