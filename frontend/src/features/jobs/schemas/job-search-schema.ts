import { z } from "zod";

import {
    EMPLOYMENT_TYPES,
    EXPERIENCE_LEVELS,
} from "@/features/jobs/types/job";

const optionalNumber = z.preprocess(
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
    z.number().nonnegative().optional(),
);

export const jobSearchSchema = z.object({
    keyword: z
        .string()
        .trim()
        .optional(),

    location: z
        .string()
        .trim()
        .optional(),

    companyId: optionalNumber
        .pipe(
            z
                .number()
                .int()
                .positive()
                .optional(),
        ),

    employmentType: z
        .enum(EMPLOYMENT_TYPES)
        .optional(),

    experienceLevel: z
        .enum(EXPERIENCE_LEVELS)
        .optional(),

    minSalary: optionalNumber,

    maxSalary: optionalNumber,

    page: z
        .number()
        .int()
        .nonnegative()
        .default(0),

    size: z
        .number()
        .int()
        .positive()
        .max(50)
        .default(10),
}).refine(
    (data) =>
        data.minSalary === undefined ||
        data.maxSalary === undefined ||
        data.minSalary <= data.maxSalary,
    {
        message:
            "Minimum salary cannot be greater than maximum salary.",
        path: ["maxSalary"],
    },
);

export type JobSearchFormInput =
    z.input<typeof jobSearchSchema>;

export type JobSearchFormValues =
    z.output<typeof jobSearchSchema>;
