"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSendOtp } from "@/features/auth/hooks/use-send-otp";
import {
    phoneNumberSchema,
    type PhoneNumberForm,
} from "@/features/auth/schemas/auth-schema";
import { FloatingInput } from "@/components/ui/floating-input";

interface PhoneLoginFormProps {
    roleLabel?: string;
    onOtpSent: (phoneNumber: string) => void;
}

export function PhoneLoginForm({
    roleLabel = "Student / Candidate",
    onOtpSent,
}: PhoneLoginFormProps) {
    const sendOtpMutation = useSendOtp();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PhoneNumberForm>({
        resolver: zodResolver(phoneNumberSchema),
        defaultValues: {
            phoneNumber: "",
        },
    });

    const onSubmit = async (data: PhoneNumberForm) => {
        try {
            await sendOtpMutation.mutateAsync(data);
            onOtpSent(data.phoneNumber);
        } catch {
            // API error is exposed through sendOtpMutation.error.
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-indigo-950/40 px-4 py-2.5 text-xs text-indigo-300">
                <span className="font-medium">Signing in as:</span>
                <span className="font-bold text-white uppercase">{roleLabel}</span>
            </div>

            <div>
                <FloatingInput
                    label="Mobile Phone Number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    startAdornment={<span className="text-xs font-bold text-slate-400">+91</span>}
                    error={errors.phoneNumber?.message}
                    helperText="Enter 10-digit registered mobile number without country code."
                    {...register("phoneNumber")}
                    disabled={sendOtpMutation.isPending}
                />
            </div>

            {sendOtpMutation.isError && (
                <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs font-medium text-red-300">
                    {sendOtpMutation.error.message || "Failed to send verification code. Please check your number."}
                </div>
            )}

            <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {sendOtpMutation.isPending ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Sending OTP...</span>
                    </>
                ) : (
                    <>
                        <span>Send Verification OTP</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </button>

            <p className="text-center text-[11px] text-slate-500">
                By continuing, you agree to CamPlace Terms of Service and Privacy Policy.
            </p>
        </form>
    );
}
