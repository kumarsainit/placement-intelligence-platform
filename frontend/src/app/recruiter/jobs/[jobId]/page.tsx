"use client";

import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function RecruiterJobDetailsPage() {
    return (
        <AuthGuard>
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-5xl">
                    <h1 className="text-3xl font-bold">
                        Recruiter Job
                    </h1>
                </div>
            </main>
        </AuthGuard>
    );
}
