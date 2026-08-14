"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { OtpVerificationForm } from "@/features/auth/components/otp-verification-form";
import { PhoneLoginForm } from "@/features/auth/components/phone-login-form";

export default function AuthPage() {
    const router = useRouter();

    const [phoneNumber, setPhoneNumber] = useState<string | null>(
        null,
    );

    const handleOtpSent = (phone: string) => {
        setPhoneNumber(phone);
    };

    const handleVerified = () => {
        router.push("/dashboard");
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

                {phoneNumber ? (
                    <OtpVerificationForm
                        phoneNumber={phoneNumber}
                        onVerified={handleVerified}
                        onBack={() => setPhoneNumber(null)}
                    />
                ) : (
                    <PhoneLoginForm onOtpSent={handleOtpSent} />
                )}
            </section>
        </main>
    );
}
