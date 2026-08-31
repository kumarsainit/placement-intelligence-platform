import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
    JobRecommendation,
    StudentPlacementInsights,
} from "@/features/placement-intelligence/types/recommendation";

const RECOMMENDATIONS_BASE_PATH = "/v1/recommendations";

export async function getJobRecommendations(): Promise<
    ApiResponse<JobRecommendation[]>
> {
    return apiClient<JobRecommendation[]>(
        `${RECOMMENDATIONS_BASE_PATH}/jobs`,
        {
            method: "GET",
        },
    );
}

export async function getJobMatchDetails(
    jobId: number,
): Promise<ApiResponse<JobRecommendation>> {
    return apiClient<JobRecommendation>(
        `${RECOMMENDATIONS_BASE_PATH}/jobs/${jobId}`,
        {
            method: "GET",
        },
    );
}

export async function getStudentInsights(): Promise<
    ApiResponse<StudentPlacementInsights>
> {
    return apiClient<StudentPlacementInsights>(
        `${RECOMMENDATIONS_BASE_PATH}/insights`,
        {
            method: "GET",
        },
    );
}
