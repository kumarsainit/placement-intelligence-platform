"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
    GraduationCap,
    Building2,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    Lock,
    Loader2,
} from "lucide-react";
import { Auth08 } from "@/components/ui/auth-08";
import { CamPlaceLogo } from "@/components/shared/camplace-logo";
import { OtpVerificationForm } from "@/features/auth/components/otp-verification-form";
import { PhoneLoginForm } from "@/features/auth/components/phone-login-form";
import { getCurrentUser } from "@/features/auth/api/user-api";
import { useAuthStore } from "@/stores/auth-store";

type AuthRoleSelection = "student" | "recruiter" | "admin" | null;

function AuthContent() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get("role");

    const validatedInitialRole: AuthRoleSelection =
        roleParam === "student" || roleParam === "recruiter" || roleParam === "admin"
            ? roleParam
            : null;

    const [selectedRole, setSelectedRole] = useState<AuthRoleSelection>(validatedInitialRole);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const setRole = useAuthStore((state) => state.setRole);

    const handleOtpSent = (phone: string) => {
        setPhoneNumber(phone);
    };

    const handleVerified = async () => {
        try {
            setIsRedirecting(true);

            // Fetch the authoritative current user role from the backend
            const response = await getCurrentUser();
            const role = response.data.role;

            setRole(role);
            queryClient.setQueryData(["current-user"], response);
            queryClient.invalidateQueries({ queryKey: ["current-user"] });

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

    // Role Selection Screen
    if (!selectedRole) {
        return (
            <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12">
                {/* Background Ambient Glow */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem]" />
                </div>

                {/* Top Navigation */}
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
                    <Link href="/" className="transition hover:opacity-90">
                        <CamPlaceLogo size="md" variant="light" />
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Return to Home</span>
                    </Link>
                </div>

                {/* Role Choice Cards */}
                <div className="mx-auto my-auto w-full max-w-4xl py-12 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                        <Sparkles className="size-3.5 text-cyan-400" />
                        <span>Welcome to CamPlace</span>
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                        How would you like to use CamPlace?
                    </h1>

                    <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400 sm:text-base">
                        Select your journey below to sign in or get started with your placement workspace.
                    </p>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 text-left">
                        {/* Student Journey Card */}
                        <div
                            onClick={() => setSelectedRole("student")}
                            className="group relative cursor-pointer rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-900/90 p-8 shadow-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/60 hover:shadow-indigo-500/10 select-none"
                        >
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/40 transition-transform duration-200 group-hover:scale-105">
                                <GraduationCap className="size-7" />
                            </div>

                            <span className="mt-6 inline-block rounded-md border border-indigo-500/30 bg-indigo-950/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                                Candidates & Students
                            </span>

                            <h2 className="mt-3 text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                Join as a Student
                            </h2>

                            <p className="mt-2 text-xs leading-relaxed text-slate-300">
                                Discover curated jobs, internships, and opportunities matched to your verified skills and track applications end-to-end.
                            </p>

                            <ul className="mt-6 space-y-2 text-xs text-slate-400">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                                    <span>Personalized compatibility insights</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                                    <span>Verified profile, projects & resume</span>
                                </li>
                            </ul>

                            <button
                                type="button"
                                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md transition group-hover:bg-indigo-500"
                            >
                                <span>Continue as Student</span>
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>

                        {/* Recruiter Journey Card */}
                        <div
                            onClick={() => setSelectedRole("recruiter")}
                            className="group relative cursor-pointer rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 via-slate-900/80 to-slate-900/90 p-8 shadow-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/60 hover:shadow-cyan-500/10 select-none"
                        >
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-cyan-600/20 text-cyan-400 ring-1 ring-cyan-500/40 transition-transform duration-200 group-hover:scale-105">
                                <Building2 className="size-7" />
                            </div>

                            <span className="mt-6 inline-block rounded-md border border-cyan-500/30 bg-cyan-950/80 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                                Employers & Hiring Teams
                            </span>

                            <h2 className="mt-3 text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                                Join as a Recruiter
                            </h2>

                            <p className="mt-2 text-xs leading-relaxed text-slate-300">
                                Build your company profile, post openings, review applicants with compatibility breakdowns, and hire faster.
                            </p>

                            <ul className="mt-6 space-y-2 text-xs text-slate-400">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-cyan-400" />
                                    <span>Structured applicant review widgets</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-cyan-400" />
                                    <span>Direct access to candidate resumes</span>
                                </li>
                            </ul>

                            <button
                                type="button"
                                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-3 text-xs font-bold text-white shadow-md transition group-hover:bg-cyan-500"
                            >
                                <span>Continue as Recruiter</span>
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Discreet Admin Login */}
                    <div className="mt-12 text-center">
                        <button
                            type="button"
                            onClick={() => setSelectedRole("admin")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-300"
                        >
                            <Lock className="size-3" />
                            <span>Platform Administrator / Governance Login</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="mx-auto text-xs text-slate-600">
                    © {new Date().getFullYear()} CamPlace. Placement Intelligence Platform.
                </div>
            </div>
        );
    }

    // Role-specific Authentication Form
    const roleTitle =
        selectedRole === "student"
            ? "Student Authentication"
            : selectedRole === "recruiter"
            ? "Recruiter Authentication"
            : "Platform Admin Login";

    const roleSubtitle =
        phoneNumber
            ? `Enter the 6-digit verification code sent to ${phoneNumber}.`
            : selectedRole === "student"
            ? "Enter your mobile phone number to sign in or create your student workspace."
            : selectedRole === "recruiter"
            ? "Enter your mobile phone number to sign in or access your hiring pipeline."
            : "Authorized administrators: enter your registered mobile phone number.";

    const requestedRole =
        selectedRole === "recruiter"
            ? "RECRUITER"
            : selectedRole === "student"
            ? "USER"
            : undefined;

    return (
        <Auth08
            title={phoneNumber ? "Verify One-Time Password" : roleTitle}
            subtitle={roleSubtitle}
            showBackToRoles={!phoneNumber && !isRedirecting}
            onBackToRoles={() => setSelectedRole(null)}
        >
            {isRedirecting ? (
                <div className="py-8 text-center space-y-3">
                    <Loader2 className="mx-auto size-8 animate-spin text-indigo-500" />
                    <p className="text-sm font-semibold text-slate-200">
                        Authenticating and loading your workspace...
                    </p>
                </div>
            ) : phoneNumber ? (
                <OtpVerificationForm
                    phoneNumber={phoneNumber}
                    role={requestedRole}
                    onVerified={handleVerified}
                    onBack={() => setPhoneNumber(null)}
                />
            ) : (
                <PhoneLoginForm
                    roleLabel={
                        selectedRole === "student"
                            ? "Student"
                            : selectedRole === "recruiter"
                            ? "Recruiter"
                            : "Platform Administrator"
                    }
                    onOtpSent={handleOtpSent}
                />
            )}
        </Auth08>
    );
}

export default function AuthPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                    <Loader2 className="size-8 animate-spin text-indigo-500" />
                </div>
            }
        >
            <AuthContent />
        </Suspense>
    );
}
