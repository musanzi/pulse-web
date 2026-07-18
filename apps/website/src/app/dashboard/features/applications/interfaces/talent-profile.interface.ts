export interface ITalentProfile {
  id: string;
  userId: string;
  displayName: string;
  avatar: string | null;
  headline: string | null;
  summary: string | null;
  skills: ITalentSkill[];
  projects: ITalentProjectEvidence[];
  source: 'api' | 'mock';
  updatedAt: string;
}

export interface ITalentSkill {
  id: string;
  name: string;
  category: string;
  level: number;
  verified: boolean;
}

export interface ITalentProjectEvidence {
  id: string;
  title: string;
  summary: string;
  skillIds: string[];
  evidenceUrl?: string;
}
