import { z } from "zod";

export const profileSchema = z.object({
    fullName: z
        .string()
        .max(100, "Full name must not exceed 100 characters")
        .optional(),

    college: z
        .string()
        .max(150, "College must not exceed 150 characters")
        .optional(),

    degree: z
        .string()
        .max(100, "Degree must not exceed 100 characters")
        .optional(),

    branch: z
        .string()
        .max(100, "Branch must not exceed 100 characters")
        .optional(),

    graduationYear: z
        .number()
        .int()
        .min(2000, "Graduation year must be at least 2000")
        .max(2100, "Graduation year must not exceed 2100")
        .optional(),

    cgpa: z
        .number()
        .min(0, "CGPA cannot be negative")
        .max(10, "CGPA cannot exceed 10")
        .optional(),

    bio: z
        .string()
        .max(500, "Bio must not exceed 500 characters")
        .optional(),

    githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),

    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),

    leetcodeUrl: z.string().url("Invalid LeetCode URL").optional().or(z.literal("")),

    codeforcesUrl: z.string().url("Invalid Codeforces URL").optional().or(z.literal("")),

    portfolioUrl: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
