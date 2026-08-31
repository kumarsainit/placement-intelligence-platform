import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  LoginResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
} from "@/types/auth";

export async function sendOtp(
  request: SendOtpRequest,
): Promise<ApiResponse<SendOtpResponse>> {
  return apiClient<SendOtpResponse>("/v1/auth/send-otp", {
    method: "POST",
    body: request,
  });
}

export async function verifyOtp(
  request: VerifyOtpRequest,
): Promise<ApiResponse<LoginResponse>> {
  return apiClient<LoginResponse>("/v1/auth/verify-otp", {
    method: "POST",
    body: request,
  });
}

export async function refreshAuthToken(
  refreshToken: string,
): Promise<ApiResponse<LoginResponse>> {
  return apiClient<LoginResponse>("/v1/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    skipAuth: true,
  });
}
