import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    PROFILE_QUERY_KEY,
} from "@/features/profile/hooks/use-profile";

import { updateProfile } from "@/features/profile/api/profile-api";

import type {
    UpdateProfileRequest,
} from "@/features/profile/types/profile";

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: UpdateProfileRequest,
        ) => updateProfile(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: PROFILE_QUERY_KEY,
            });
        },
    });
}
