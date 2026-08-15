export interface Skill {
    id: number;
    name: string;
    category: string;
    description: string | null;
    isActive: boolean;
}

export interface UserSkill {
    id: number;
    skillId: number;
    skillName: string;
    category: string;
    proficiency: string | null;
    yearsOfExperience: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface AddUserSkillRequest {
    skillId: number;
    proficiency?: string;
    yearsOfExperience?: number;
}
