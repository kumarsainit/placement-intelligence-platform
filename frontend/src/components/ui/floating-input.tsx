"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}

export const FloatingInput = React.forwardRef<
    HTMLInputElement,
    FloatingInputProps
>(
    (
        {
            className,
            label,
            error,
            helperText,
            startAdornment,
            endAdornment,
            id,
            disabled,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;

        return (
            <div className="w-full space-y-1.5">
                <div
                    className={cn(
                        "relative flex items-center rounded-2xl border bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-0 dark:bg-slate-900/90",
                        error
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
                            : "border-slate-300 focus-within:border-indigo-600 focus-within:ring-indigo-600/20 dark:border-slate-700 dark:focus-within:border-indigo-500",
                        disabled && "opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-950"
                    )}
                >
                    {startAdornment && (
                        <div className="flex shrink-0 items-center pl-3.5 pr-1 text-slate-500 dark:text-slate-400">
                            {startAdornment}
                        </div>
                    )}

                    <div className="relative flex-1">
                        <input
                            ref={ref}
                            id={inputId}
                            placeholder=" "
                            disabled={disabled}
                            className={cn(
                                "peer block w-full rounded-2xl border-0 bg-transparent px-4 pt-5 pb-2 text-sm font-medium text-slate-900 placeholder-transparent outline-none focus:ring-0 dark:text-white",
                                startAdornment ? "pl-2" : undefined,
                                endAdornment ? "pr-2" : undefined,
                                className
                            )}
                            {...props}
                        />
                        <label
                            htmlFor={inputId}
                            className={cn(
                                "absolute top-2 z-10 origin-[0] -translate-y-0.5 scale-75 text-xs font-semibold text-slate-500 duration-150 transform transition-all select-none dark:text-slate-400",
                                startAdornment ? "left-2" : "left-4",
                                "peer-placeholder-shown:top-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:scale-75 peer-focus:text-xs peer-focus:font-semibold",
                                error
                                    ? "text-red-500 peer-focus:text-red-500"
                                    : "peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400"
                            )}
                        >
                            {label}
                        </label>
                    </div>

                    {endAdornment && (
                        <div className="flex shrink-0 items-center pr-3.5 pl-1 text-slate-500 dark:text-slate-400">
                            {endAdornment}
                        </div>
                    )}
                </div>

                {error ? (
                    <p className="text-xs font-medium text-red-500 pl-1">{error}</p>
                ) : helperText ? (
                    <p className="text-xs text-slate-500 pl-1 dark:text-slate-400">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);

FloatingInput.displayName = "FloatingInput";
