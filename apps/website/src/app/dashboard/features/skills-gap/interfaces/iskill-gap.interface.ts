export interface ISkillGap {
  skillId: string;
  skillName: string;
  category: string;
  icon: string;
  currentLevel: number;
  targetLevel: number;
  maxLevel: number;
  gapLevel: number;
  severity: 'growth' | 'important' | 'blocked';
  growthHintKey: string;
  estimatedMatchLift: number;
  shortestPathMinutes?: number;
  recommendedQuestIds: string[];
}

export interface ISkillGapSummary {
  userId: string;
  roleId?: string;
  readinessScore: number;
  currentVector: ISkillRadarPoint[];
  potentialVector: ISkillRadarPoint[];
  targetVector: ISkillRadarPoint[];
  gaps: ISkillGap[];
  updatedAt: string;
}

export interface ISkillRadarPoint {
  skillId: string;
  skillName: string;
  level: number;
  maxLevel: number;
}

export interface IQuestRecommendation {
  id: string;
  title: string;
  summary: string;
  skillIds: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  xpReward: number;
  estimatedMatchLift: number;
  isShortestPath: boolean;
  route: string;
}
