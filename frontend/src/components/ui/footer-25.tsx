import Link from "next/link";

export interface FooterLink {
    label: string;
    href: string;
}

export interface Footer25Props {
    brandName?: string;
    description?: string;
    links?: FooterLink[];
}

export function Footer25({
    brandName = "Placement Intelligence",
    description = "A unified platform connecting students, recruiters, and placement officers with intelligent career management tools.",
    links = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Jobs", href: "/jobs" },
        { label: "Applications", href: "/applications" },
        { label: "Profile", href: "/profile" },
    ],
}: Footer25Props) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-xs font-black text-white dark:bg-zinc-100 dark:text-zinc-900">
                                PI
                            </span>
                            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                                {brandName}
                            </span>
                        </div>

                        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-zinc-500">
                            {description}
                        </p>
                    </div>

                    <nav className="flex flex-wrap items-center gap-5 text-xs font-medium">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="transition hover:text-zinc-900 dark:hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="mt-8 border-t border-zinc-100 pt-6 text-xs text-zinc-400 dark:border-zinc-900 sm:flex sm:items-center sm:justify-between">
                    <p>© {currentYear} {brandName}. All rights reserved.</p>
                    <p className="mt-2 sm:mt-0">Connecting talent with opportunity.</p>
                </div>
            </div>
        </footer>
    );
}
