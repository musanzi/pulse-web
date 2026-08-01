export interface ITalentProfileDirectoryEntry {
  id: string;
  displayName: string;
  headline: string | null;
  summary: string | null;
  location: string | null;
  availability: number | null;
  skills: ITalentProfileDirectorySkill[];
  projects: ITalentProfileDirectoryProject[];
  source: 'api';
}

export interface ITalentProfileDirectorySkill {
  id: string;
  name: string;
  level?: number;
  verified?: boolean;
}

export interface ITalentProfileDirectoryProject {
  id: string;
  title: string;
  summary: string;
}

export interface ITalentProfileDirectoryApiResponse {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  location: string | null;
  bio: string | null;
  educationSummary: string | null;
  availability: number | null;
  skills: ITalentProfileDirectorySkillApiResponse[];
}

export interface ITalentProfileDirectorySkillApiResponse {
  id: string;
  profileId: string;
  name: string;
}
