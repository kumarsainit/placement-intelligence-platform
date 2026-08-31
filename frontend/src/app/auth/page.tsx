"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { OtpVerificationForm } from "@/features/auth/components/otp-verification-form";

import { PhoneLoginForm } from "@/features/auth/components/phone-login-form";

import { getCurrentUser } from "@/features/auth/api/user-api";

import { useAuthStore } from "@/stores/auth-store";

export default function AuthPage() {
    const router = useRouter();

    const [phoneNumber, setPhoneNumber] =
        useState<string | null>(null);

    const [isRedirecting, setIsRedirecting] =
        useState(false);

    const setRole = useAuthStore(
        (state) => state.setRole,
    );

    const handleOtpSent = (phone: string) => {
        setPhoneNumber(phone);
    };

    const handleVerified = async () => {
        try {
            setIsRedirecting(true);

            const response = await getCurrentUser();
            const role = response.data.role;

            setRole(role);

            if (role === "RECRUITER") {
                router.replace("/recruiter/dashboard");
                return;
            }

            router.replace("/dashboard");
        } catch (error) {
            console.error(
                "ROLE LOOKUP / REDIRECT ERROR:",
                error,
            );

            setIsRedirecting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <section className="w-full max-w-md rounded-xl border p-8 shadow-sm">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">
                        Placement Intelligence
                    </h1>

                    <p className="mt-2 text-sm text-zinc-600">
                        {phoneNumber
                            ? "Verify your phone number"
                            : "Sign in with your phone number"}
                    </p>
                </div>

                {isRedirecting ? (
                    <div className="py-8 text-center">
                        <p className="text-sm text-zinc-600">
                            Signing you in...
                        </p>
                    </div>
                ) : phoneNumber ? (
                    <OtpVerificationForm
                        phoneNumber={phoneNumber}
                        onVerified={handleVerified}
                        onBack={() =>
                            setPhoneNumber(null)
                        }
                    />
                ) : (
                    <PhoneLoginForm
                        onOtpSent={handleOtpSent}
                    />
                )}
            </section>
        </main>
    );
}
