import { z } from "zod";

export const skillSchema = z.object({
    skillId: z.preprocess(
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
                error: "Please select a skill",
            })
            .int("Please select a valid skill")
            .positive("Please select a skill"),
    ),

    proficiency: z
        .string()
        .max(
            30,
            "Proficiency must not exceed 30 characters",
        )
        .optional(),

    yearsOfExperience: z.preprocess(
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
            .min(
                0,
                "Years of experience cannot be negative",
            )
            .max(
                99.99,
                "Years of experience is invalid",
            )
            .optional(),
    ),
});

export type SkillFormInput =
    z.input<typeof skillSchema>;

export type SkillFormValues =
    z.output<typeof skillSchema>;
