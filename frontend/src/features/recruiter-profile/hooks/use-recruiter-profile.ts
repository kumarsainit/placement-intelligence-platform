import { useQuery } from "@tanstack/react-query";

import { getRecruiterProfile } from "@/features/recruiter-profile/api/recruiter-profile-api";

export const RECRUITER_PROFILE_QUERY_KEY = [
    "recruiter-profile",
];

export function useRecruiterProfile() {
    return useQuery({
        queryKey: RECRUITER_PROFILE_QUERY_KEY,
        queryFn: getRecruiterProfile,
    });
}
