import { z } from "zod";

export const projectSchema = z
    .object({
        title: z
            .string()
            .min(1, "Project title is required")
            .max(
                200,
                "Project title must not exceed 200 characters",
            ),

        description: z
            .string()
            .min(
                1,
                "Project description is required",
            ),

        technologies: z
            .string()
            .min(
                1,
                "Technologies are required",
            )
            .max(
                500,
                "Technologies must not exceed 500 characters",
            ),

        projectUrl: z
            .string()
            .max(
                500,
                "Project URL must not exceed 500 characters",
            )
            .optional(),

        githubUrl: z
            .string()
            .max(
                500,
                "GitHub URL must not exceed 500 characters",
            )
            .optional(),

        startDate: z.string().optional(),

        endDate: z.string().optional(),

        currentlyWorking: z.boolean(),
    })
    .superRefine((data, ctx) => {
        if (
            data.startDate &&
            data.endDate &&
            data.endDate < data.startDate
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message:
                    "End date cannot be before start date",
            });
        }

        if (
            data.currentlyWorking &&
            data.endDate
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message:
                    "End date must be empty when currently working",
            });
        }
    });

export type ProjectFormValues =
    z.infer<typeof projectSchema>;
