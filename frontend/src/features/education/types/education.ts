export const EDUCATION_LEVELS = [
    "TENTH",
    "TWELFTH",
    "DIPLOMA",
    "BACHELOR",
    "MASTER",
    "PHD",
    "OTHER",
] as const;

export type EducationLevel =
    (typeof EDUCATION_LEVELS)[number];

export interface UserEducation {
    id: number;
    educationLevel: EducationLevel;
    degree: string | null;
    institution: string;
    fieldOfStudy: string | null;
    startYear: number | null;
    endYear: number | null;
    cgpa: number | null;
    percentage: number | null;
    currentlyPursuing: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AddUserEducationRequest {
    educationLevel: EducationLevel;
    degree?: string;
    institution: string;
    fieldOfStudy?: string;
    startYear?: number;
    endYear?: number;
    cgpa?: number;
    percentage?: number;
    currentlyPursuing?: boolean;
}
