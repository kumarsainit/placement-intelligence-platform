import Link from "next/link";

export interface Hero5NavItem {
    label: string;
    href: string;
}

export interface Hero5Pillar {
    title: string;
    role: string;
    description: string;
    badge: string;
}

export interface Hero5Props {
    logoText?: string;
    navItems?: Hero5NavItem[];
    loginText?: string;
    loginHref?: string;
    titleLine1?: string;
    titleLine2Accent?: string;
    description?: string;
    primaryCtaText?: string;
    primaryCtaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    pillarsTitle?: string;
    pillars?: Hero5Pillar[];
}

export function Hero5({
    logoText = "Placement Intelligence",
    navItems = [
        { label: "Explore Jobs", href: "/jobs" },
        { label: "Sign In", href: "/auth" },
    ],
    loginText = "Sign In",
    loginHref = "/auth",
    titleLine1 = "Where Ambition Meets Opportunity.",
    titleLine2Accent = "Intelligence for Campus Hiring.",
    description = "A unified platform connecting ambitious students, hiring employers, and placement administrators. Discover career opportunities, manage recruitment pipelines, and unlock real-time placement intelligence.",
    primaryCtaText = "Get Started",
    primaryCtaHref = "/auth",
    secondaryCtaText = "Explore Open Jobs",
    secondaryCtaHref = "/jobs",
    pillarsTitle = "Engineered for Every Campus Hiring Stakeholder",
    pillars = [
        {
            role: "Students",
            badge: "Career Discovery",
            title: "Build & Apply",
            description:
                "Build placement-ready profiles, showcase verified education, skills, and projects, upload resumes, and track applications from submission to offer.",
        },
        {
            role: "Recruiters",
            badge: "Hiring Pipeline",
            title: "Post & Evaluate",
            description:
                "Manage company profiles, post job openings with specific criteria, evaluate candidate resumes securely, and advance applicant statuses through structured stages.",
        },
        {
            role: "Administrators",
            badge: "Institutional Intelligence",
            title: "Monitor & Analyze",
            description:
                "Gain platform-wide oversight with real-time analytics across student engagement, active recruiters, job postings, and end-to-end placement outcomes.",
        },
    ],
}: Hero5Props) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
            {/* Ambient background glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            >
                <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-zinc-800/40 via-zinc-700/20 to-transparent blur-3xl" />
                <div className="absolute top-1/2 -right-40 h-[400px] w-[600px] rounded-full bg-gradient-to-bl from-zinc-800/30 to-transparent blur-3xl" />
            </div>

            {/* Navigation Bar */}
            <header className="relative z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition hover:opacity-90"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-black text-white">
                            PI
                        </span>
                        <span>{logoText}</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="hidden text-sm font-medium text-zinc-400 transition hover:text-white sm:inline-block"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <Link
                            href={loginHref}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                        >
                            {loginText}
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Main Content */}
            <section className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3.5 py-1 text-xs font-medium text-zinc-300 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Placement Intelligence Platform
                    </div>

                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
                        <span className="block">{titleLine1}</span>
                        <span className="block bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-500 bg-clip-text text-transparent italic">
                            {titleLine2Accent}
                        </span>
                    </h1>

                    <p className="mt-6 text-base leading-relaxed text-zinc-400 sm:text-lg sm:leading-8">
                        {description}
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                        <Link
                            href={primaryCtaHref}
                            className="w-full rounded-xl bg-white px-7 py-3.5 text-center text-sm font-bold text-zinc-950 shadow-sm transition hover:bg-zinc-200 sm:w-auto"
                        >
                            {primaryCtaText}
                        </Link>

                        <Link
                            href={secondaryCtaHref}
                            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-7 py-3.5 text-center text-sm font-semibold text-zinc-200 backdrop-blur-sm transition hover:border-zinc-700 hover:bg-zinc-900 sm:w-auto"
                        >
                            <span>{secondaryCtaText}</span>
                            <span
                                aria-hidden="true"
                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                            >
                                →
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Platform Stakeholder Pillars */}
                <div className="mt-24 border-t border-zinc-800/80 pt-16">
                    <p className="text-center text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        {pillarsTitle}
                    </p>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {pillars.map((pillar) => (
                            <div
                                key={pillar.role}
                                className="group relative rounded-2xl border border-zinc-800/90 bg-zinc-900/50 p-6 backdrop-blur-sm transition hover:border-zinc-700 hover:bg-zinc-900/80"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-medium text-zinc-400">
                                        {pillar.badge}
                                    </span>
                                    <span className="text-xs font-semibold text-zinc-500 uppercase">
                                        {pillar.role}
                                    </span>
                                </div>

                                <h2 className="mt-4 text-lg font-bold text-white">
                                    {pillar.title}
                                </h2>

                                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                    {pillar.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
