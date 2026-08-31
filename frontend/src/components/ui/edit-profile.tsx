"use client";

import React, { useState } from "react";
import {
    X,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Check,
    Loader2,
    Sparkles,
} from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { cn } from "@/lib/utils";

export interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    headline?: string;
    bio?: string;
    gender?: string;
    dateOfBirth?: string;
    companyName?: string;
    designation?: string;
    department?: string;
}

export interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Partial<ProfileFormData>;
    title?: string;
    subtitle?: string;
    role?: "STUDENT" | "RECRUITER";
    onSave: (data: ProfileFormData) => Promise<void> | void;
}

export function EditProfileModal({
    isOpen,
    onClose,
    initialData,
    title = "Edit Profile",
    subtitle = "Update your verified personal and professional information on CamPlace.",
    role = "STUDENT",
    onSave,
}: EditProfileModalProps) {
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: initialData.firstName ?? "",
        lastName: initialData.lastName ?? "",
        email: initialData.email ?? "",
        phoneNumber: initialData.phoneNumber ?? "",
        headline: initialData.headline ?? "",
        bio: initialData.bio ?? "",
        gender: initialData.gender ?? "",
        dateOfBirth: initialData.dateOfBirth ?? "",
        companyName: initialData.companyName ?? "",
        designation: initialData.designation ?? "",
        department: initialData.department ?? "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsSaving(true);
        try {
            await onSave(formData);
            setSavedSuccess(true);
            setTimeout(() => {
                setSavedSuccess(false);
                onClose();
            }, 1000);
        } catch (err: unknown) {
            setErrorMessage(
                err instanceof Error ? err.message : "Failed to update profile."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const initials = `${formData.firstName?.[0] ?? ""}${formData.lastName?.[0] ?? ""}`.toUpperCase() || "CP";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Box */}
            <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {title}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                    {errorMessage && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                            {errorMessage}
                        </div>
                    )}

                    {/* Avatar Preview */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 font-extrabold text-white text-lg shadow-sm">
                            {initials}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {formData.firstName || formData.lastName
                                    ? `${formData.firstName} ${formData.lastName}`
                                    : "User Profile"}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {role === "RECRUITER"
                                    ? formData.designation || "Recruiter Account"
                                    : formData.headline || "Student Candidate"}
                            </p>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FloatingInput
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <FloatingInput
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FloatingInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            startAdornment={<Mail className="size-4" />}
                            required
                        />
                        <FloatingInput
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            startAdornment={<Phone className="size-4" />}
                        />
                    </div>

                    {role === "STUDENT" ? (
                        <>
                            <FloatingInput
                                label="Career Headline (e.g. Computer Science Undergrad @ NIT)"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                startAdornment={<Sparkles className="size-4" />}
                            />

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    About / Bio
                                </label>
                                <textarea
                                    name="bio"
                                    rows={3}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Write a brief summary of your career interests, skills, and background..."
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FloatingInput
                                    label="Designation / Role (e.g. Talent Acquisition Lead)"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    startAdornment={<Briefcase className="size-4" />}
                                />
                                <FloatingInput
                                    label="Department (e.g. Engineering Hiring)"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    startAdornment={<Building2 className="size-4" />}
                                />
                            </div>
                        </>
                    )}

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving || savedSuccess}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700 active:scale-[0.98]",
                                savedSuccess && "bg-emerald-600 hover:bg-emerald-600"
                            )}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Saving Changes...</span>
                                </>
                            ) : savedSuccess ? (
                                <>
                                    <Check className="size-4" />
                                    <span>Saved!</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
