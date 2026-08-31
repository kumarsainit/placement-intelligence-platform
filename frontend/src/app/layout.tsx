import type { Metadata } from "next";

import type { ReactNode } from "react";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "Placement Intelligence",
        template: "%s | Placement Intelligence",
    },
    description:
        "A unified placement platform for students and recruiters.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (
        <html
            lang="en"
            className="h-full antialiased"
        >
        <body className="min-h-full flex flex-col">
        <AppProviders>
            {children}
        </AppProviders>
        </body>
        </html>
    );
}
