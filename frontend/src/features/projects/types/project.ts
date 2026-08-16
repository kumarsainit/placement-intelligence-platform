export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string;
    projectUrl: string | null;
    githubUrl: string | null;
    startDate: string | null;
    endDate: string | null;
    currentlyWorking: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AddProjectRequest {
    title: string;
    description: string;
    technologies: string;
    projectUrl?: string;
    githubUrl?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking: boolean;
}
