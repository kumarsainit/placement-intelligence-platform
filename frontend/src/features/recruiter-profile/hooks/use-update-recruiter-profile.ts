import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    updateRecruiterProfile,
} from "@/features/recruiter-profile/api/recruiter-profile-api";

import {
    RECRUITER_PROFILE_QUERY_KEY,
} from "@/features/recruiter-profile/hooks/use-recruiter-profile";

import type {
    UpdateRecruiterProfileRequest,
} from "@/features/recruiter-profile/types/recruiter-profile";

export function useUpdateRecruiterProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: UpdateRecruiterProfileRequest,
        ) => updateRecruiterProfile(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: RECRUITER_PROFILE_QUERY_KEY,
            });

            queryClient.invalidateQueries({
                queryKey: ["recruiter-dashboard"],
            });
        },
    });
}
