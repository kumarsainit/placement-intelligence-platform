import { z } from "zod";

import {
    EMPLOYMENT_TYPES,
    EXPERIENCE_LEVELS, JobStatus,
} from "@/features/jobs/types/job";

export const recruiterJobFormSchema = z
    .object({
        companyId: z
            .number()
            .int()
            .positive("Please select a company"),

        title: z
            .string()
            .trim()
            .min(1, "Job title is required")
            .max(
                200,
                "Job title must not exceed 200 characters",
            ),

        description: z
            .string()
            .trim()
            .min(1, "Job description is required"),

        location: z
            .string()
            .trim()
            .max(
                200,
                "Location must not exceed 200 characters",
            )
            .optional(),

        employmentType: z.enum(
            EMPLOYMENT_TYPES,
        ),

        experienceLevel: z.enum(
            EXPERIENCE_LEVELS,
        ),

        salaryMin: z
            .number()
            .nonnegative(
                "Salary cannot be negative",
            )
            .optional(),

        salaryMax: z
            .number()
            .nonnegative(
                "Salary cannot be negative",
            )
            .optional(),

        openings: z
            .number()
            .int(
                "Number of openings must be a whole number",
            )
            .min(
                1,
                "At least one opening is required",
            ),

        applicationDeadline: z
            .string()
            .min(
                1,
                "Application deadline is required",
            ),

        status: z
            .enum([
                "DRAFT",
                "OPEN",
                "CLOSED",
            ])
            .optional(),
    })
    .refine(
        (data) =>
            data.salaryMin === undefined ||
            data.salaryMax === undefined ||
            data.salaryMin <= data.salaryMax,
        {
            message:
                "Minimum salary cannot be greater than maximum salary.",
            path: ["salaryMax"],
        },
    );

export type RecruiterJobFormInput =
    z.input<typeof recruiterJobFormSchema>;

export type RecruiterJobFormValues =
    z.output<typeof recruiterJobFormSchema>;

const optionalString = (max: number, message: string) =>
    z.preprocess(
        (value) => {
            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                return undefined;
            }

            return String(value).trim();
        },
        z
            .string()
            .max(max, message)
            .optional(),
    );

const salaryField = z.preprocess(
    (value) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return undefined;
        }

        const numberValue = Number(value);

        return Number.isNaN(numberValue)
            ? undefined
            : numberValue;
    },
    z
        .number()
        .nonnegative(
            "Salary cannot be negative",
        )
        .optional(),
);

const openingsField = z.preprocess(
    (value) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return undefined;
        }

        const numberValue = Number(value);

        return Number.isNaN(numberValue)
            ? undefined
            : numberValue;
    },
    z
        .number({
            error: "Number of openings is required",
        })
        .int(
            "Number of openings must be a whole number",
        )
        .min(
            1,
            "At least one opening is required",
        ),
);

const companyIdField = z.preprocess(
    (value) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return undefined;
        }

        const numberValue = Number(value);

        return Number.isNaN(numberValue)
            ? undefined
            : numberValue;
    },
    z
        .number({
            error: "Please select a company",
        })
        .int(
            "Please select a valid company",
        )
        .positive(
            "Please select a company",
        ),
);

const baseJobSchema = z.object({
    companyId: companyIdField,

    title: z
        .string()
        .trim()
        .min(
            1,
            "Job title is required",
        )
        .max(
            200,
            "Job title must not exceed 200 characters",
        ),

    description: z
        .string()
        .trim()
        .min(
            1,
            "Job description is required",
        ),

    location: optionalString(
        200,
        "Location must not exceed 200 characters",
    ),

    employmentType: z.enum(
        EMPLOYMENT_TYPES,
        {
            error: "Please select an employment type",
        },
    ),

    experienceLevel: z.enum(
        EXPERIENCE_LEVELS,
        {
            error: "Please select an experience level",
        },
    ),

    salaryMin: salaryField,

    salaryMax: salaryField,

    openings: openingsField,

    applicationDeadline: z
        .string()
        .min(
            1,
            "Application deadline is required",
        ),
});

export const createRecruiterJobSchema =
    baseJobSchema.refine(
        (data) =>
            data.salaryMin === undefined ||
            data.salaryMax === undefined ||
            data.salaryMin <= data.salaryMax,
        {
            message:
                "Minimum salary cannot be greater than maximum salary.",
            path: ["salaryMax"],
        },
    );

export const updateRecruiterJobSchema =
    baseJobSchema
        .extend({
            status: z.enum(
                [
                    "DRAFT",
                    "OPEN",
                    "CLOSED",
                ] as [
                    JobStatus,
                    JobStatus,
                    JobStatus,
                ],
                {
                    error:
                        "Please select a job status",
                },
            ),
        })
        .refine(
            (data) =>
                data.salaryMin === undefined ||
                data.salaryMax === undefined ||
                data.salaryMin <= data.salaryMax,
            {
                message:
                    "Minimum salary cannot be greater than maximum salary.",
                path: ["salaryMax"],
            },
        );

export type CreateRecruiterJobFormInput =
    z.input<typeof createRecruiterJobSchema>;

export type CreateRecruiterJobFormValues =
    z.output<typeof createRecruiterJobSchema>;

export type UpdateRecruiterJobFormInput =
    z.input<typeof updateRecruiterJobSchema>;

export type UpdateRecruiterJobFormValues =
    z.output<typeof updateRecruiterJobSchema>;
