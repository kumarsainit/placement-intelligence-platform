interface JobPaginationProps {
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    onPageChange: (page: number) => void;
}

export function JobPagination({
                                  currentPage,
                                  totalPages,
                                  hasPreviousPage,
                                  hasNextPage,
                                  onPageChange,
                              }: JobPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Job pagination"
            className="flex items-center justify-center gap-2"
        >
            <button
                type="button"
                disabled={!hasPreviousPage}
                onClick={() =>
                    onPageChange(currentPage - 1)
                }
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Previous
            </button>

            {Array.from(
                { length: totalPages },
                (_, index) => index,
            ).map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    aria-current={
                        page === currentPage
                            ? "page"
                            : undefined
                    }
                    className={
                        page === currentPage
                            ? "rounded-lg bg-black px-3 py-2 text-sm font-medium text-white"
                            : "rounded-lg border px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                    }
                >
                    {page + 1}
                </button>
            ))}

            <button
                type="button"
                disabled={!hasNextPage}
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next
            </button>
        </nav>
    );
}
