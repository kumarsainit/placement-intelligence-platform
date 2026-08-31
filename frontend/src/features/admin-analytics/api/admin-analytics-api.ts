import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";
import type { AdminAnalytics } from "@/features/admin-analytics/types/admin-analytics";

const ADMIN_ANALYTICS_ENDPOINT = "/v1/admin/analytics/overview";

export async function getAdminAnalytics(): Promise<
    ApiResponse<AdminAnalytics>
> {
    return apiClient<AdminAnalytics>(
        ADMIN_ANALYTICS_ENDPOINT,
        {
            method: "GET",
        },
    );
}
