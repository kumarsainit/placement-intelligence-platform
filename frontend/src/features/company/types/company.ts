export interface Company {
    id: number;
    name: string;
    website: string | null;
    industry: string | null;
    description: string | null;
    location: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
