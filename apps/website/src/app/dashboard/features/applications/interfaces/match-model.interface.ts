export interface IAiMatchMetadata {
  provider: 'openrouter';
  model: string;
  promptVersion: string;
  source: 'api' | 'mock';
}

export interface IMatchScoreBreakdown {
  skillAlignment: number;
  projectEvidence: number;
  experience: number;
}

export interface IRoleSkillRequirement {
  id: string;
  name: string;
  category: string;
  requiredLevel: number;
  weight: number;
}
