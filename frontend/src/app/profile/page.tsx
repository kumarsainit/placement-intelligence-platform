"use client";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ProfileForm } from "@/features/profile/components/profile-form";

export default function ProfilePage() {
    return (
        <AuthGuard>
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold">
                            Student Profile
                        </h1>

                        <p className="mt-2 text-zinc-600">
                            Manage your personal, academic and professional
                            information.
                        </p>
                    </header>

                    <ProfileForm />
                </div>
            </main>
        </AuthGuard>
    );
}
