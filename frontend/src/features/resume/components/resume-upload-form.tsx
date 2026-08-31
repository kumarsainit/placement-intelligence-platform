"use client";

import { useState } from "react";
import { FileUpload2 } from "@/components/ui/file-upload-2";

interface ResumeUploadFormProps {
    isSubmitting?: boolean;
    onSubmit: (
        file: File,
        isPrimary: boolean,
    ) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ResumeUploadForm({
    isSubmitting = false,
    onSubmit,
}: ResumeUploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isPrimary, setIsPrimary] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (selectedFile: File) => {
        setError(null);

        if (
            selectedFile.type !== "application/pdf" &&
            !selectedFile.name.toLowerCase().endsWith(".pdf")
        ) {
            setFile(null);
            setError("Only PDF resumes are allowed.");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setFile(null);
            setError("Resume file size must not exceed 5 MB.");
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            setError("Please select a PDF resume before submitting.");
            return;
        }

        setError(null);
        onSubmit(file, isPrimary);
    };

    const handleClear = () => {
        setFile(null);
        setIsPrimary(false);
        setError(null);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
            <FileUpload2
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                selectedFile={file}
                isUploading={isSubmitting}
                disabled={isSubmitting}
                maxSizeMB={5}
                accept=".pdf,application/pdf"
                label="Upload Placement Resume"
                description="PDF format only, maximum 5 MB"
                error={error}
            />

            <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                        type="checkbox"
                        checked={isPrimary}
                        onChange={(event) => setIsPrimary(event.target.checked)}
                        disabled={isSubmitting}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Set as primary resume
                    </span>
                </label>

                <div className="flex gap-3">
                    {file && (
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={isSubmitting}
                            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            Clear
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={!file || isSubmitting}
                        className="rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                        {isSubmitting ? "Uploading..." : "Upload Resume"}
                    </button>
                </div>
            </div>
        </form>
    );
}
