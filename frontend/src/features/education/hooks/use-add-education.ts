import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { addEducation } from "@/features/education/api/education-api";
import {
    EDUCATION_QUERY_KEY,
} from "@/features/education/hooks/use-educations";

import type {
    AddUserEducationRequest,
} from "@/features/education/types/education";

export function useAddEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: AddUserEducationRequest,
        ) => addEducation(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: EDUCATION_QUERY_KEY,
            });
        },
    });
}
