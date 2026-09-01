import type { UserRole } from "@/features/auth/api/user-api";

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface SendOtpResponse {
  phoneNumber: string;
  message: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
  role?: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  phoneNumber: string;
  message: string;
}
