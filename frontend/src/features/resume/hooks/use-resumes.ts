import { useQuery } from "@tanstack/react-query";

import { getResumes } from "@/features/resume/api/resume-api";

export const RESUMES_QUERY_KEY = ["resumes"];

export function useResumes() {
    return useQuery({
        queryKey: RESUMES_QUERY_KEY,
        queryFn: getResumes,
    });
}
