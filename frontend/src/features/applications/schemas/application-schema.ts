import { z } from "zod";

export const applicationSchema = z.object({
    resumeId: z
        .number({
            error: "Please select a resume",
        })
        .int("Please select a valid resume")
        .positive("Please select a resume"),

    coverLetter: z
        .string()
        .max(
            5000,
            "Cover letter must not exceed 5000 characters",
        )
        .optional(),
});

export type ApplicationFormValues =
    z.infer<typeof applicationSchema>;
