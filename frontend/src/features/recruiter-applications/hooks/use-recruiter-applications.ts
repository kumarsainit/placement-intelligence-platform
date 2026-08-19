import { useQuery } from "@tanstack/react-query";

import {
    getRecruiterJobApplications,
} from "@/features/recruiter-applications/api/recruiter-application-api";

export const RECRUITER_APPLICATIONS_QUERY_KEY = [
    "recruiter-applications",
];

export function useRecruiterApplications(
    jobId: number,
) {
    return useQuery({
        queryKey: [
            ...RECRUITER_APPLICATIONS_QUERY_KEY,
            "job",
            jobId,
        ],
        queryFn: () =>
            getRecruiterJobApplications(
                jobId,
            ),
        enabled:
            Number.isInteger(jobId) &&
            jobId > 0,
    });
}
