import React from "react";
import { Navigation5 } from "@/components/ui/navigation-5";
import { Hero9 } from "@/components/ui/hero-9";
import { Footer25 } from "@/components/ui/footer-25";

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-950">
            <Navigation5 />
            <Hero9 />
            <Footer25
                links={[
                    { label: "Find Opportunities", href: "/jobs" },
                    { label: "For Students", href: "/auth?role=student" },
                    { label: "For Recruiters", href: "/auth?role=recruiter" },
                    { label: "Sign In", href: "/auth" },
                ]}
            />
        </main>
    );
}
