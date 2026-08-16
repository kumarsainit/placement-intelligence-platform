"use client";

import { useRef, useState } from "react";

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
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [isPrimary, setIsPrimary] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFile =
            event.target.files?.[0] ?? null;

        setError(null);

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (
            selectedFile.type !== "application/pdf" ||
            !selectedFile.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {
            setFile(null);
            setError("Only PDF resumes are allowed.");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setFile(null);
            setError(
                "Resume file size must not exceed 5 MB.",
            );
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!file) {
            setError("Please select a PDF resume.");
            return;
        }

        setError(null);
        onSubmit(file, isPrimary);
    };

    const handleReset = () => {
        setFile(null);
        setIsPrimary(false);
        setError(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <label
                    htmlFor="resume-file"
                    className="block text-sm font-medium"
                >
                    Resume
                </label>

                <input
                    ref={inputRef}
                    id="resume-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="mt-2 block w-full rounded-lg border px-3 py-2 text-sm"
                />

                <p className="mt-2 text-xs text-zinc-500">
                    PDF only, maximum 5 MB.
                </p>
            </div>

            {file && (
                <div className="mt-4 rounded-lg bg-zinc-50 p-3">
                    <p className="text-sm font-medium">
                        Selected file
                    </p>

                    <p className="mt-1 break-all text-sm text-zinc-600">
                        {file.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>
            )}

            <label className="mt-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(event) =>
                        setIsPrimary(event.target.checked)
                    }
                    disabled={isSubmitting}
                    className="h-4 w-4"
                />

                <span className="text-sm">
                    Set as primary resume
                </span>
            </label>

            {error && (
                <p className="mt-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="mt-5 flex justify-end gap-3">
                {file && (
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Clear
                    </button>
                )}

                <button
                    type="submit"
                    disabled={!file || isSubmitting}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Uploading..."
                        : "Upload Resume"}
                </button>
            </div>
        </form>
    );
}
