import { z } from "zod";

export const recruiterProfileSchema = z.object({
    companyId: z.preprocess(
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
            .int("Please select a valid company")
            .positive("Please select a company"),
    ),

    designation: z
        .string()
        .trim()
        .max(
            150,
            "Designation must not exceed 150 characters",
        )
        .optional(),

    department: z
        .string()
        .trim()
        .max(
            100,
            "Department must not exceed 100 characters",
        )
        .optional(),

    employeeId: z
        .string()
        .trim()
        .max(
            100,
            "Employee ID must not exceed 100 characters",
        )
        .optional(),
});

export type RecruiterProfileFormInput =
    z.input<typeof recruiterProfileSchema>;

export type RecruiterProfileFormValues =
    z.output<typeof recruiterProfileSchema>;
