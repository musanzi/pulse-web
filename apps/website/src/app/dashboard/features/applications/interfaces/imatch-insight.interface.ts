import { IAiMatchMetadata, IMatchScoreBreakdown } from './match-model.interface';

export interface IMatchInsight {
  applicationId: string;
  talentProfileId: string;
  roleId: string;
  roleTitle: string;
  compatibilityScore: number;
  scoreBreakdown: IMatchScoreBreakdown;
  ai: IAiMatchMetadata;
  confidence: 'low' | 'medium' | 'high';
  status: 'queued' | 'reviewing' | 'ready';
  headlineKey: string;
  summaryKey: string;
  reviewEtaKey: string;
  matchedSkills: IMatchSkill[];
  missingSkills: IMatchSkill[];
  rationales: IMatchRationale[];
  nextActions: IMatchNextAction[];
  generatedAt: string;
}

export interface IMatchSkill {
  id: string;
  name: string;
  category: string;
  userLevel?: number;
  requiredLevel?: number;
  weight?: number;
}

export interface IMatchRationale {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  metricLabelKey?: string;
  metricValue?: string;
  evidenceSkillIds: string[];
}

export interface IMatchNextAction {
  id: string;
  labelKey: string;
  route: string;
  icon: string;
  priority: 'primary' | 'secondary';
}
