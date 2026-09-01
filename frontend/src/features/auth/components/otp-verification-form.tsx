"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useVerifyOtp } from "@/features/auth/hooks/use-verify-otp";
import { useSendOtp } from "@/features/auth/hooks/use-send-otp";
import {
    verifyOtpSchema,
    type VerifyOtpForm,
} from "@/features/auth/schemas/auth-schema";
import type { UserRole } from "@/features/auth/api/user-api";

interface OtpVerificationFormProps {
    phoneNumber: string;
    role?: UserRole;
    onVerified: () => void;
    onBack: () => void;
}

export function OtpVerificationForm({
    phoneNumber,
    role,
    onVerified,
    onBack,
}: OtpVerificationFormProps) {
    const verifyOtpMutation = useVerifyOtp();
    const sendOtpMutation = useSendOtp();

    const [countdown, setCountdown] = useState(300); // 5 minutes (300 seconds)
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

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
            await verifyOtpMutation.mutateAsync({
                phoneNumber: data.phoneNumber,
                otp: data.otp,
                role,
            });
            onVerified();
        } catch {
            // API error is exposed through verifyOtpMutation.error.
        }
    };

    const handleResend = async () => {
        try {
            await sendOtpMutation.mutateAsync({ phoneNumber });
            setCountdown(300);
            setResendMessage("A new verification code has been dispatched.");
            setTimeout(() => setResendMessage(null), 4000);
        } catch (err: unknown) {
            setResendMessage(
                err instanceof Error ? err.message : "Failed to resend code."
            );
        }
    };

    const formatMinutes = Math.floor(countdown / 60);
    const formatSeconds = (countdown % 60).toString().padStart(2, "0");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                <p className="text-xs text-slate-400">
                    6-digit verification code sent to
                </p>
                <p className="mt-1 text-base font-bold text-white tracking-wider">
                    +91 {phoneNumber}
                </p>
            </div>

            <div>
                <label
                    htmlFor="otp"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                    Enter 6-Digit Code
                </label>

                <div className="relative">
                    <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="••••••"
                        {...register("otp")}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-center text-2xl font-extrabold tracking-[0.5em] text-white shadow-inner outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                        disabled={verifyOtpMutation.isPending}
                    />
                </div>

                {errors.otp && (
                    <p className="mt-2 text-xs font-medium text-red-400">
                        {errors.otp.message}
                    </p>
                )}
            </div>

            {verifyOtpMutation.isError && (
                <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs font-medium text-red-300">
                    {verifyOtpMutation.error.message || "Invalid or expired OTP code."}
                </div>
            )}

            {resendMessage && (
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-3 text-xs font-medium text-indigo-300">
                    {resendMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {verifyOtpMutation.isPending ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Verifying Security Code...</span>
                    </>
                ) : (
                    <span>Verify & Continue</span>
                )}
            </button>

            {/* Countdown / Resend Strip */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>
                    {countdown > 0 ? (
                        <>Expires in <strong className="text-white font-mono">{formatMinutes}:{formatSeconds}</strong></>
                    ) : (
                        <span className="text-red-400">Code expired</span>
                    )}
                </span>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={countdown > 240 || sendOtpMutation.isPending}
                    className="font-semibold text-indigo-400 transition hover:text-indigo-300 disabled:opacity-40 disabled:pointer-events-none"
                >
                    {sendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                </button>
            </div>

            <div className="border-t border-slate-800/80 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={verifyOtpMutation.isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                    <ArrowLeft className="size-3.5" />
                    <span>Change Mobile Number</span>
                </button>
            </div>
        </form>
    );
}
