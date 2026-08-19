import { useQuery } from "@tanstack/react-query";

import {
    getRecruiterApplication,
} from "@/features/recruiter-applications/api/recruiter-application-api";

export const RECRUITER_APPLICATION_QUERY_KEY = [
    "recruiter-application",
];

export function useRecruiterApplication(
    applicationId: number,
) {
    return useQuery({
        queryKey: [
            ...RECRUITER_APPLICATION_QUERY_KEY,
            applicationId,
        ],
        queryFn: () =>
            getRecruiterApplication(
                applicationId,
            ),
        enabled:
            Number.isInteger(
                applicationId,
            ) &&
            applicationId > 0,
    });
}
