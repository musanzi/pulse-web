export interface ITalentProfile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  avatar: string | null;
  headline: string | null;
  summary: string | null;
  phone: string | null;
  location: string | null;
  educationSummary: string | null;
  availability: number | null;
  yearsExperience: number | null;
  portfolio: string | null;
  isComplete: boolean;
  skills: ITalentSkill[];
  projects: ITalentProjectEvidence[];
  source: 'api';
  createdAt: string;
  updatedAt: string;
}

export interface ITalentSkill {
  id: string;
  name: string;
  category: string;
  level?: number;
  verified?: boolean;
}

export interface ITalentProjectEvidence {
  id: string;
  title: string;
  summary: string;
  skillIds: string[];
  evidenceUrl?: string;
}

export interface ITalentProfileApiResponse {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  bio: string | null;
  educationSummary: string | null;
  availability: number | null;
  yearsExperience: number | null;
  portfolio: string | null;
  isComplete: boolean;
  skills: IProfileSkillApiResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface IProfileSkillApiResponse {
  id: string;
  profileId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
