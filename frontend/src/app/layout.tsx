import type { Metadata } from "next";

import type { ReactNode } from "react";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "CamPlace | Placement Intelligence Platform",
        template: "%s | CamPlace",
    },
    description:
        "CamPlace is a unified placement platform connecting students, recruiters, and placement intelligence with smart job matching, applicant tracking, and career workflows.",
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
