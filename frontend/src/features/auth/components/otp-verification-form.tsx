"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useVerifyOtp } from "@/features/auth/hooks/use-verify-otp";
import {
    verifyOtpSchema,
    type VerifyOtpForm,
} from "@/features/auth/schemas/auth-schema";

interface OtpVerificationFormProps {
    phoneNumber: string;
    onVerified: () => void;
    onBack: () => void;
}

export function OtpVerificationForm({
                                        phoneNumber,
                                        onVerified,
                                        onBack,
                                    }: OtpVerificationFormProps) {
    const verifyOtpMutation = useVerifyOtp();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyOtpForm>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            phoneNumber,
            otp: "",
        },
    });

    const onSubmit = async (data: VerifyOtpForm) => {
        try {
            await verifyOtpMutation.mutateAsync(data);
            onVerified();
        } catch {
            // API error is exposed through verifyOtpMutation.error.
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <p className="text-sm text-zinc-600">
                    OTP sent to +91 {phoneNumber}
                </p>
            </div>

            <div>
                <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium"
                >
                    Enter OTP
                </label>

                <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    {...register("otp")}
                    className="w-full rounded-md border px-3 py-2 text-center tracking-[0.4em] outline-none focus:ring-2"
                    disabled={verifyOtpMutation.isPending}
                />

                {errors.otp && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.otp.message}
                    </p>
                )}
            </div>

            {verifyOtpMutation.isError && (
                <p className="text-sm text-red-600">
                    {verifyOtpMutation.error.message}
                </p>
            )}

            <button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="w-full rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {verifyOtpMutation.isPending
                    ? "Verifying..."
                    : "Verify OTP"}
            </button>

            <button
                type="button"
                onClick={onBack}
                disabled={verifyOtpMutation.isPending}
                className="w-full rounded-md border px-4 py-2"
            >
                Change Phone Number
            </button>
        </form>
    );
}
