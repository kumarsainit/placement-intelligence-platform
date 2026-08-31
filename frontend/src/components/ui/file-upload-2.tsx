"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface FileUpload2Props {
    onFileSelect: (file: File) => void;
    onClear?: () => void;
    selectedFile?: File | null;
    isUploading?: boolean;
    disabled?: boolean;
    maxSizeMB?: number;
    accept?: string;
    label?: string;
    description?: string;
    error?: string | null;
    className?: string;
}

export function FileUpload2({
    onFileSelect,
    onClear,
    selectedFile,
    isUploading = false,
    disabled = false,
    maxSizeMB = 5,
    accept = ".pdf,application/pdf",
    label = "Upload Document",
    description,
    error,
    className,
}: FileUpload2Props) {
    const defaultDescription = description ?? `PDF format only, maximum ${maxSizeMB} MB`;
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && !isUploading) {
            setIsDragging(true);
        }
    }, [disabled, isUploading]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (disabled || isUploading) return;

            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) {
                onFileSelect(droppedFile);
            }
        },
        [disabled, isUploading, onFileSelect],
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className={cn("w-full space-y-4", className)}>
            <div
                role="button"
                tabIndex={0}
                aria-label="Upload file dropzone"
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                    }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                    if (!disabled && !isUploading) {
                        fileInputRef.current?.click();
                    }
                }}
                className={cn(
                    "relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition",
                    isDragging
                        ? "border-zinc-950 bg-zinc-100 dark:border-white dark:bg-zinc-800"
                        : "border-zinc-300 bg-zinc-50/50 hover:bg-zinc-100/70 dark:border-zinc-700 dark:bg-zinc-900/50",
                    (disabled || isUploading) && "cursor-not-allowed opacity-60",
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileInput}
                    disabled={disabled || isUploading}
                    className="hidden"
                />

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    <svg
                        className="h-7 w-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>

                <p className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
                    {label}
                </p>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Click to select file or drag & drop here
                </p>

                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    {defaultDescription}
                </p>
            </div>

            {selectedFile && (
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-red-600 dark:bg-zinc-800 dark:text-red-400">
                            📄
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                    </div>

                    {onClear && !isUploading && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                            Remove
                        </button>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
