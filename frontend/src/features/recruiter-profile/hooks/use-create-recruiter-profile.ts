import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createRecruiterProfile,
} from "@/features/recruiter-profile/api/recruiter-profile-api";

import {
    RECRUITER_PROFILE_QUERY_KEY,
} from "@/features/recruiter-profile/hooks/use-recruiter-profile";

import type {
    CreateRecruiterProfileRequest,
} from "@/features/recruiter-profile/types/recruiter-profile";

export function useCreateRecruiterProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: CreateRecruiterProfileRequest,
        ) => createRecruiterProfile(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: RECRUITER_PROFILE_QUERY_KEY,
            });
        },
    });
}
