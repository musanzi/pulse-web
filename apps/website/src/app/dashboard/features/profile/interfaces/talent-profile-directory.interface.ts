export interface ITalentProfileDirectoryEntry {
  id: string;
  displayName: string;
  headline: string;
  summary: string;
  location: string;
  availability: string;
  skills: ITalentProfileDirectorySkill[];
  projects: ITalentProfileDirectoryProject[];
  source: 'api' | 'mock';
}

export interface ITalentProfileDirectorySkill {
  id: string;
  name: string;
  level: number;
  verified: boolean;
}

export interface ITalentProfileDirectoryProject {
  id: string;
  title: string;
  summary: string;
}
