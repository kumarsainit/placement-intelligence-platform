import { z } from "zod";

export const recruiterCompanySchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(
                1,
                "Company name is required",
            )
            .max(
                200,
                "Company name must not exceed 200 characters",
            ),

        website: z
            .string()
            .trim()
            .max(
                500,
                "Website must not exceed 500 characters",
            )
            .optional(),

        industry: z
            .string()
            .trim()
            .max(
                150,
                "Industry must not exceed 150 characters",
            )
            .optional(),

        description: z
            .string()
            .trim()
            .optional(),

        location: z
            .string()
            .trim()
            .max(
                200,
                "Location must not exceed 200 characters",
            )
            .optional(),
    });

export type RecruiterCompanyFormValues =
    z.infer<typeof recruiterCompanySchema>;
