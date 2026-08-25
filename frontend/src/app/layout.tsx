import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import type { ReactNode } from "react";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col">
        <AppProviders>
            {children}
        </AppProviders>
        </body>
        </html>
    );
}
