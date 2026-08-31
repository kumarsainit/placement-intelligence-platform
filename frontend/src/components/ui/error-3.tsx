import Link from "next/link";

export interface AppErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    backHref?: string;
    backLabel?: string;
}

export function AppErrorState({
    title = "Unable to load content",
    message = "An unexpected error occurred while fetching information. Please try again.",
    onRetry,
    backHref,
    backLabel = "Go Back",
}: AppErrorStateProps) {
    return (
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 sm:p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-red-950/30">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300">
                <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>

            <h3 className="mt-4 text-lg font-bold text-red-900 dark:text-red-200">
                {title}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-red-700 dark:text-red-400">
                {message}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                        Try Again / Retry
                    </button>
                )}

                {backHref && (
                    <Link
                        href={backHref}
                        className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                        {backLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}
