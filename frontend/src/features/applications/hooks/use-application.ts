import { useQuery } from "@tanstack/react-query";

import { getApplication } from "@/features/applications/api/application-api";

export const APPLICATION_QUERY_KEY = [
    "application",
];

export function useApplication(
    applicationId: number,
) {
    return useQuery({
        queryKey: [
            ...APPLICATION_QUERY_KEY,
            applicationId,
        ],
        queryFn: () =>
            getApplication(applicationId),
        enabled:
            Number.isInteger(applicationId) &&
            applicationId > 0,
    });
}
