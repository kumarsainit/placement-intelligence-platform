import { z } from "zod";

export const educationSchema = z
    .object({
        educationLevel: z.string().min(
            1,
            "Education level is required",
        ),

        degree: z
            .string()
            .max(
                150,
                "Degree must not exceed 150 characters",
            )
            .optional(),

        institution: z
            .string()
            .min(1, "Institution is required")
            .max(
                200,
                "Institution must not exceed 200 characters",
            ),

        fieldOfStudy: z
            .string()
            .max(
                150,
                "Field of study must not exceed 150 characters",
            )
            .optional(),

        startYear: z
            .number()
            .int()
            .min(1900)
            .max(2100)
            .optional(),

        endYear: z
            .number()
            .int()
            .min(1900)
            .max(2100)
            .optional(),

        cgpa: z
            .number()
            .min(0, "CGPA cannot be negative")
            .max(10, "CGPA cannot exceed 10")
            .optional(),

        percentage: z
            .number()
            .min(
                0,
                "Percentage cannot be negative",
            )
            .max(
                100,
                "Percentage cannot exceed 100",
            )
            .optional(),

        currentlyPursuing: z.boolean(),
    })
    .superRefine((data, ctx) => {
        if (
            data.startYear !== undefined &&
            data.endYear !== undefined &&
            data.endYear < data.startYear
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endYear"],
                message:
                    "End year cannot be before start year",
            });
        }

        if (
            data.currentlyPursuing &&
            data.endYear !== undefined
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endYear"],
                message:
                    "Currently pursuing education cannot have an end year",
            });
        }

        if (
            data.cgpa !== undefined &&
            data.percentage !== undefined
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["percentage"],
                message:
                    "Provide either CGPA or percentage, not both",
            });
        }
    });

export type EducationFormValues =
    z.infer<typeof educationSchema>;
