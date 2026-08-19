import { z } from "zod";

import {
    APPLICATION_STATUSES,
} from "@/features/recruiter-applications/types/recruiter-application";

export const updateApplicationStatusSchema =
    z.object({
        status: z.enum(
            APPLICATION_STATUSES,
            {
                error:
                    "Please select an application status",
            },
        ),
    });

export type UpdateApplicationStatusFormInput =
    z.input<
        typeof updateApplicationStatusSchema
    >;

export type UpdateApplicationStatusFormValues =
    z.output<
        typeof updateApplicationStatusSchema
    >;
