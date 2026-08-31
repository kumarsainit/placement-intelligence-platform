import React from "react";
import { Error3 } from "@/components/ui/error-3";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <Error3
                statusCode="404"
                title="Page Not Found"
                message="The requested page could not be located in CamPlace. It might have been relocated or removed."
                actionLabel="Return to Dashboard"
                actionHref="/dashboard"
            />
        </main>
    );
}
