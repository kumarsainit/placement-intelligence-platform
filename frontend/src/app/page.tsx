import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-zinc-50">
            <section className="border-b bg-white">
                <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
                    <Link
                        href="/"
                        className="text-lg font-bold tracking-tight"
                    >
                        Placement Intelligence
                    </Link>

                    <Link
                        href="/auth"
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-100"
                    >
                        Sign In
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                        Placement Intelligence Platform
                    </p>

                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl">
                        Build your profile.
                        <br />
                        Discover opportunities.
                        <br />
                        Get placed.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
                        A unified platform for students to build
                        placement-ready profiles, discover relevant
                        jobs, and track their applications from
                        submission to selection.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/auth"
                            className="rounded-lg bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800"
                        >
                            Get Started
                        </Link>

                        <Link
                            href="/jobs"
                            className="rounded-lg border bg-white px-5 py-3 text-center text-sm font-semibold transition hover:bg-zinc-100"
                        >
                            Explore Jobs
                        </Link>
                    </div>
                </div>
            </section>

            <section className="border-y bg-white">
                <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:px-8 md:grid-cols-3">
                    <div className="rounded-xl border p-6">
                        <p className="text-lg font-semibold">
                            Build Your Profile
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Manage your education, skills,
                            projects, resume, and profile
                            information in one place.
                        </p>
                    </div>

                    <div className="rounded-xl border p-6">
                        <p className="text-lg font-semibold">
                            Discover Jobs
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Search and explore opportunities
                            based on your skills, experience,
                            location, and preferences.
                        </p>
                    </div>

                    <div className="rounded-xl border p-6">
                        <p className="text-lg font-semibold">
                            Track Applications
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Monitor your applications and see
                            whether they are applied, shortlisted,
                            selected, or rejected.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
                <div className="rounded-2xl border bg-white p-8 shadow-sm sm:p-10">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                            For Recruiters
                        </p>

                        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                            Manage your hiring workflow in one place.
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base">
                            Create companies and job openings,
                            manage applications, and track
                            candidate progress through the
                            recruitment process.
                        </p>
                    </div>

                    <div className="mt-6">
                        <Link
                            href="/auth"
                            className="inline-block rounded-lg border px-5 py-3 text-sm font-semibold hover:bg-zinc-100"
                        >
                            Recruiter Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="border-t bg-white">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p>
                        © 2026 Placement Intelligence.
                    </p>

                    <p>
                        Connecting talent with opportunity.
                    </p>
                </div>
            </footer>
        </main>
    );
}
