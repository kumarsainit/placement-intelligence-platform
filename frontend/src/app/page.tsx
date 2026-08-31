import { Hero5 } from "@/components/ui/hero-5";
import { Footer25 } from "@/components/ui/footer-25";

export default function Home() {
    return (
        <main className="min-h-screen bg-zinc-950">
            <Hero5 />
            <Footer25
                links={[
                    { label: "Explore Jobs", href: "/jobs" },
                    { label: "Sign In", href: "/auth" },
                ]}
            />
        </main>
    );
}
