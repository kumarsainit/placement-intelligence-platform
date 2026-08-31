import {
    useQuery,
} from "@tanstack/react-query";

import {
    getAllRecruiterApplications,
} from "@/features/recruiter-applications/api/recruiter-application-api";
import {
    useRecruiterCompanies,
} from "@/features/recruiter-company/hooks/use-recruiter-companies";
import {
    useRecruiterJobs,
} from "@/features/recruiter-jobs/hooks/use-recruiter-jobs";
import {
    useRecruiterProfile,
} from "@/features/recruiter-profile/hooks/use-recruiter-profile";


export function useRecruiterDashboard() {
    const profileQuery =
        useRecruiterProfile();

    const companiesQuery =
        useRecruiterCompanies();

    const jobsQuery =
        useRecruiterJobs();

    const jobs =
        jobsQuery.data?.data ?? [];

    const applicationsQuery = useQuery({
        queryKey: [
            "recruiter-dashboard",
            "applications",
        ],

        queryFn: async () => {
            const response = await getAllRecruiterApplications();
            return response.data ?? [];
        },

        staleTime: 60 * 1000,
    });

    const applications =
        applicationsQuery.data ?? [];

    const applicationCountsByJob =
        applications.reduce<
            Record<number, number>
        >((counts, application) => {
            counts[application.jobId] =
                (counts[application.jobId] ?? 0) +
                1;

            return counts;
        }, {});

    return {
        profile:
            profileQuery.data?.data ?? null,

        companies:
            companiesQuery.data?.data ?? [],

        jobs,

        applications,

        applicationCountsByJob,

        isLoading:
            profileQuery.isLoading ||
            companiesQuery.isLoading ||
            jobsQuery.isLoading ||
            applicationsQuery.isLoading,

        isError:
            profileQuery.isError ||
            companiesQuery.isError ||
            jobsQuery.isError ||
            applicationsQuery.isError,

        error:
            profileQuery.error ??
            companiesQuery.error ??
            jobsQuery.error ??
            applicationsQuery.error ??
            null,
    };
}
