import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { uploadResume } from "@/features/resume/api/resume-api";
import { RESUMES_QUERY_KEY } from "@/features/resume/hooks/use-resumes";

export interface UploadResumeVariables {
    file: File;
    isPrimary?: boolean;
}

export function useUploadResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            file,
            isPrimary = false,
        }: UploadResumeVariables) =>
            uploadResume(file, isPrimary),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: RESUMES_QUERY_KEY,
            });
        },
    });
}
