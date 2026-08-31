import React from "react";
import { cn } from "@/lib/utils";

interface CamPlaceLogoProps {
    className?: string;
    iconClassName?: string;
    showText?: boolean;
    showTagline?: boolean;
    variant?: "default" | "light" | "dark" | "monochrome";
    size?: "sm" | "md" | "lg" | "xl";
}

export function CamPlaceLogoIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("size-8 shrink-0", className)}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="cp-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="cp-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
                <filter id="cp-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" floodColor="#0F172A" />
                </filter>
            </defs>

            {/* Rounded squircle background */}
            <rect
                x="1"
                y="1"
                width="34"
                height="34"
                rx="10"
                fill="#0F172A"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1.2"
                filter="url(#cp-shadow)"
            />

            {/* Stylized 'C' ribbon with gradient */}
            <path
                d="M 23 11 C 17 9 10 13 10 19 C 10 25 17 29 24 26"
                stroke="url(#cp-grad-primary)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dynamic forward arrow / 'P' stem intersecting */}
            <path
                d="M 18 10 L 18 26"
                stroke="url(#cp-grad-accent)"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Sparkle node representing Intelligence */}
            <circle cx="24" cy="12" r="2.2" fill="#38BDF8" />
        </svg>
    );
}

export function CamPlaceLogo({
    className,
    iconClassName,
    showText = true,
    showTagline = false,
    variant = "default",
    size = "md",
}: CamPlaceLogoProps) {
    const sizeClasses = {
        sm: {
            icon: "size-6",
            text: "text-base font-bold tracking-tight",
            tagline: "text-[9px]",
        },
        md: {
            icon: "size-8",
            text: "text-lg font-bold tracking-tight",
            tagline: "text-[10px]",
        },
        lg: {
            icon: "size-10",
            text: "text-xl font-extrabold tracking-tight",
            tagline: "text-xs",
        },
        xl: {
            icon: "size-12",
            text: "text-2xl font-extrabold tracking-tight",
            tagline: "text-xs",
        },
    };

    const textColors = {
        default: "text-zinc-900 dark:text-white",
        light: "text-white",
        dark: "text-zinc-950",
        monochrome: "text-current",
    };

    const taglineColors = {
        default: "text-zinc-500 dark:text-zinc-400",
        light: "text-zinc-300",
        dark: "text-zinc-600",
        monochrome: "text-current opacity-70",
    };

    return (
        <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
            <CamPlaceLogoIcon className={cn(sizeClasses[size].icon, iconClassName)} />

            {showText && (
                <div className="flex flex-col leading-none">
                    <span className={cn(sizeClasses[size].text, textColors[variant])}>
                        Cam<span className="text-indigo-600 dark:text-cyan-400">Place</span>
                    </span>
                    {showTagline && (
                        <span
                            className={cn(
                                "font-medium tracking-wide uppercase mt-0.5",
                                sizeClasses[size].tagline,
                                taglineColors[variant]
                            )}
                        >
                            Placement Intelligence
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
