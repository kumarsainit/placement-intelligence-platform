import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    updateEducation,
} from "@/features/education/api/education-api";

import {
    EDUCATION_QUERY_KEY,
} from "@/features/education/hooks/use-educations";

import type {
    AddUserEducationRequest,
} from "@/features/education/types/education";

interface UpdateEducationInput {
    id: number;
    request: AddUserEducationRequest;
}

export function useUpdateEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            request,
        }: UpdateEducationInput) =>
            updateEducation(id, request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: EDUCATION_QUERY_KEY,
            });
            queryClient.invalidateQueries({
                queryKey: ["recommendations"],
            });
        },
    });
}
