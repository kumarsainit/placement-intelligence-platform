"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useSendOtp } from "@/features/auth/hooks/use-send-otp";
import {
    phoneNumberSchema,
    type PhoneNumberForm,
} from "@/features/auth/schemas/auth-schema";

interface PhoneLoginFormProps {
    onOtpSent: (phoneNumber: string) => void;
}

export function PhoneLoginForm({
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label
                    htmlFor="phoneNumber"
                    className="mb-2 block text-sm font-medium"
                >
                    Phone Number
                </label>

                <div className="flex">
          <span className="inline-flex items-center rounded-l-md border border-r-0 px-3 text-sm">
            +91
          </span>

                    <input
                        id="phoneNumber"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        placeholder="Enter your phone number"
                        {...register("phoneNumber")}
                        className="w-full rounded-r-md border px-3 py-2 outline-none focus:ring-2"
                        disabled={sendOtpMutation.isPending}
                    />
                </div>

                {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.phoneNumber.message}
                    </p>
                )}
            </div>

            {sendOtpMutation.isError && (
                <p className="text-sm text-red-600">
                    {sendOtpMutation.error.message}
                </p>
            )}

            <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </button>
        </form>
    );
}
