import { useQuery } from "@tanstack/react-query";

import { getEducations } from "@/features/education/api/education-api";

export const EDUCATION_QUERY_KEY = ["education"];

export function useEducations() {
    return useQuery({
        queryKey: EDUCATION_QUERY_KEY,
        queryFn: getEducations,
    });
}
