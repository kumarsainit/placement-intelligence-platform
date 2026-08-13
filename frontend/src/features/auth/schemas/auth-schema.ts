import { z } from "zod";

export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
});

export const verifyOtpSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type PhoneNumberForm = z.infer<typeof phoneNumberSchema>;
export type VerifyOtpForm = z.infer<typeof verifyOtpSchema>;
