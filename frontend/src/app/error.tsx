"use client";

import React, { useEffect } from "react";
import { Error3 } from "@/components/ui/error-3";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error Boundary caught:", error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <Error3
                statusCode="500"
                title="Something Went Wrong"
                message="An unexpected system error occurred while processing your request in CamPlace."
                actionLabel="Return to Dashboard"
                actionHref="/dashboard"
                onRetry={() => reset()}
            />
        </main>
    );
}
