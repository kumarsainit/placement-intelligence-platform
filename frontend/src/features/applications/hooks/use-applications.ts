import { useQuery } from "@tanstack/react-query";

import { getApplications } from "@/features/applications/api/application-api";

export const APPLICATIONS_QUERY_KEY = [
    "applications",
];

export function useApplications() {
    return useQuery({
        queryKey: APPLICATIONS_QUERY_KEY,
        queryFn: getApplications,
    });
}
