import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    deleteEducation,
} from "@/features/education/api/education-api";

import {
    EDUCATION_QUERY_KEY,
} from "@/features/education/hooks/use-educations";

export function useDeleteEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            deleteEducation(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: EDUCATION_QUERY_KEY,
            });
        },
    });
}
