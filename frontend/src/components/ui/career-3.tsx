export interface CareerHeaderProps {
    eyebrow?: string;
    heading: string;
    subheading?: string;
}

export function CareerHeader({
    eyebrow = "Career Opportunities",
    heading = "Find Your Next Opportunity",
    subheading = "Search and discover jobs matching your skills, education, and career goals.",
}: CareerHeaderProps) {
    return (
        <div className="flex flex-col items-start gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-3.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {eyebrow}
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                {heading}
            </h1>

            {subheading && (
                <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
                    {subheading}
                </p>
            )}
        </div>
    );
}
