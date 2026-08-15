export interface UserProfile {
    username: string;
    phoneNumber: string;
    fullName: string | null;
    college: string | null;
    degree: string | null;
    branch: string | null;
    graduationYear: number | null;
    cgpa: number | null;
    bio: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    leetcodeUrl: string | null;
    codeforcesUrl: string | null;
    portfolioUrl: string | null;
    profilePhotoUrl: string | null;
    resumeUrl: string | null;
}

export interface UpdateProfileRequest {
    fullName?: string;
    college?: string;
    degree?: string;
    branch?: string;
    graduationYear?: number;
    cgpa?: number;
    bio?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    leetcodeUrl?: string;
    codeforcesUrl?: string;
    portfolioUrl?: string;
}
