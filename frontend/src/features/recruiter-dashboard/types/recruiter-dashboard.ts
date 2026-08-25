import type { RecruiterApplication } from "@/features/recruiter-applications/types/recruiter-application";
import type { RecruiterCompany } from "@/features/recruiter-company/types/recruiter-company";
import type { RecruiterJob } from "@/features/recruiter-jobs/types/recruiter-job";
import type { RecruiterProfile } from "@/features/recruiter-profile/types/recruiter-profile";

export interface RecruiterDashboardData {
    profile: RecruiterProfile | null;
    companies: RecruiterCompany[];
    jobs: RecruiterJob[];
    applications: RecruiterApplication[];
    applicationCountsByJob: Record<
        number,
        number
    >;
}
