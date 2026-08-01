import { IAiMatchMetadata, IMatchScoreBreakdown } from './match-model.interface';

export interface IMatchInsight {
  applicationId: string | null;
  talentProfileId: string;
  roleId: string;
  roleTitle: string;
  compatibilityScore: number;
  scoreBreakdown: IMatchScoreBreakdown;
  ai: IAiMatchMetadata;
  confidence: 'low' | 'medium' | 'high';
  status: 'queued' | 'reviewing' | 'ready';
  headlineKey: string;
  headline?: string;
  summaryKey: string;
  summary?: string;
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
  title?: string;
  descriptionKey: string;
  description?: string;
  metricLabelKey?: string;
  metricValue?: string;
  evidenceSkillIds: string[];
}

export interface IRecommendationApiResponse {
  id: string;
  userId: string;
  type: 'QUEST' | 'LEARNING_PATH' | string;
  questId: string | null;
  targetRoleId: string | null;
  score: number | null;
  reason: string;
  skillGaps: Record<string, unknown>[] | null;
  modelVersion: string;
  status: 'SUGGESTED' | 'ACCEPTED' | 'DISMISSED' | string;
  steps?: ILearningPathStepApiResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ILearningPathStepApiResponse {
  id: string;
  recommendationId: string;
  stepOrder: number;
  type: string;
  questId: string | null;
  skillId: string | null;
  title: string;
  note: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMatchNextAction {
  id: string;
  labelKey: string;
  route: string;
  icon: string;
  priority: 'primary' | 'secondary';
}
