"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Auth08 } from "@/components/ui/auth-08";
import { OtpVerificationForm } from "@/features/auth/components/otp-verification-form";
import { PhoneLoginForm } from "@/features/auth/components/phone-login-form";
import { getCurrentUser } from "@/features/auth/api/user-api";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthPage() {
    const router = useRouter();

    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const setRole = useAuthStore((state) => state.setRole);

    const handleOtpSent = (phone: string) => {
        setPhoneNumber(phone);
    };

    const handleVerified = async () => {
        try {
            setIsRedirecting(true);

            const response = await getCurrentUser();
            const role = response.data.role;

            setRole(role);

            if (role === "ADMIN" || role === "SUPER_ADMIN") {
                router.replace("/admin/dashboard");
                return;
            }

            if (role === "RECRUITER") {
                router.replace("/recruiter/dashboard");
                return;
            }

            router.replace("/dashboard");
        } catch (error) {
            console.error("ROLE LOOKUP / REDIRECT ERROR:", error);
            setIsRedirecting(false);
        }
    };

    return (
        <Auth08
            title={phoneNumber ? "Verify One-Time Password" : "Sign In to Platform"}
            subtitle={
                phoneNumber
                    ? `Enter the 6-digit verification code sent to ${phoneNumber}.`
                    : "Enter your registered mobile number to receive a secure login code."
            }
        >
            {isRedirecting ? (
                <div className="py-8 text-center">
                    <p className="text-sm font-medium text-zinc-300">
                        Authenticating and directing to your dashboard...
                    </p>
                </div>
            ) : phoneNumber ? (
                <OtpVerificationForm
                    phoneNumber={phoneNumber}
                    onVerified={handleVerified}
                    onBack={() => setPhoneNumber(null)}
                />
            ) : (
                <PhoneLoginForm onOtpSent={handleOtpSent} />
            )}
        </Auth08>
    );
}
