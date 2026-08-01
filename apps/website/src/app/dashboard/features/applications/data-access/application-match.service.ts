import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of, switchMap, throwError } from 'rxjs';
import {
  IApplicationMatchRequest,
  IMatchInsight,
  IMatchSkill,
  IRecommendationApiResponse,
  ITalentProfile
} from '../interfaces';

@Service()
export class ApplicationMatchService {
  private readonly http = inject(HttpClient);

  loadMatchResult(request: IApplicationMatchRequest, talentProfile: ITalentProfile): Observable<IMatchInsight> {
    return this.http.get<IRecommendationApiResponse[]>('/matching/me/recommendations').pipe(
      switchMap((recommendations) =>
        recommendations.length > 0
          ? of(recommendations)
          : this.http.post<IRecommendationApiResponse[]>('/matching/me/recommendations/generate', {})
      ),
      switchMap((recommendations) => {
        const recommendation = this.selectRecommendation(recommendations, request.roleId);

        return recommendation
          ? of(this.toMatchInsight(recommendation, request, talentProfile))
          : throwError(() => new Error('No AI recommendation is available for this profile.'));
      })
    );
  }

  private selectRecommendation(
    recommendations: IRecommendationApiResponse[],
    roleId: string
  ): IRecommendationApiResponse | undefined {
    return (
      recommendations.find(
        (recommendation) => recommendation.questId === roleId || recommendation.targetRoleId === roleId
      ) ?? [...recommendations].sort((left, right) => (right.score ?? 0) - (left.score ?? 0))[0]
    );
  }

  private toMatchInsight(
    recommendation: IRecommendationApiResponse,
    request: IApplicationMatchRequest,
    talentProfile: ITalentProfile
  ): IMatchInsight {
    const compatibilityScore = this.toPercentage(recommendation.score);
    const missingSkills = this.toMissingSkills(recommendation.skillGaps ?? []);
    const gapNames = new Set(missingSkills.map((skill) => skill.name.toLocaleLowerCase()));
    const matchedSkills = talentProfile.skills
      .filter((skill) => !gapNames.has(skill.name.toLocaleLowerCase()))
      .map<IMatchSkill>((skill) => ({ ...skill }));
    const growthSkillNames = missingSkills.map((skill) => skill.name).join(', ');

    return {
      ai: {
        model: recommendation.modelVersion,
        promptVersion: 'backend-managed',
        provider: 'openrouter',
        source: 'api'
      },
      applicationId: request.applicationId,
      compatibilityScore,
      confidence: compatibilityScore >= 80 ? 'high' : compatibilityScore >= 60 ? 'medium' : 'low',
      generatedAt: recommendation.updatedAt ?? recommendation.createdAt,
      headlineKey: 'applications.match.apiHeadline',
      matchedSkills,
      missingSkills,
      nextActions: [
        {
          icon: 'route',
          id: 'view-skill-plan',
          labelKey: 'applications.match.viewSkillPlan',
          priority: 'primary',
          route: '/dashboard/skills-gap'
        },
        {
          icon: 'briefcase-business',
          id: 'browse-quests',
          labelKey: 'applications.match.browseQuests',
          priority: 'secondary',
          route: '/dashboard/marketplace'
        }
      ],
      rationales: [
        {
          description: recommendation.reason,
          descriptionKey: 'applications.rationale.apiReasonFallback',
          evidenceSkillIds: matchedSkills.map((skill) => skill.id),
          icon: 'badge-check',
          id: 'api-recommendation-reason',
          metricLabelKey: 'applications.rationale.skillOverlapMetric',
          metricValue: `${matchedSkills.length}`,
          titleKey: 'applications.rationale.apiReasonTitle'
        },
        ...(missingSkills.length > 0
          ? [
              {
                descriptionKey: 'applications.rationale.apiGrowthDescription',
                evidenceSkillIds: missingSkills.map((skill) => skill.id),
                icon: 'target',
                id: 'api-growth-area',
                metricLabelKey: 'applications.rationale.growthAreaMetric',
                metricValue: growthSkillNames,
                titleKey: 'applications.rationale.apiGrowthTitle'
              }
            ]
          : [])
      ],
      reviewEtaKey: 'applications.match.reviewEta',
      roleId: recommendation.questId ?? recommendation.targetRoleId ?? request.roleId,
      roleTitle: recommendation.type,
      scoreBreakdown: {
        experience: 0,
        projectEvidence: 0,
        skillAlignment: compatibilityScore
      },
      status: 'ready',
      summary: recommendation.reason,
      summaryKey: 'applications.match.apiSummaryFallback',
      talentProfileId: talentProfile.id
    };
  }

  private toMissingSkills(skillGaps: Record<string, unknown>[]): IMatchSkill[] {
    return skillGaps.flatMap((gap, index) => {
      const name = this.readString(gap, ['skill', 'name', 'skillName']);

      if (!name) {
        return [];
      }

      return [
        {
          category: 'growth',
          id: this.readString(gap, ['skillId', 'id']) ?? `gap-${index}-${this.slugify(name)}`,
          name,
          requiredLevel: this.readNumber(gap, ['requiredLevel', 'targetLevel', 'required']),
          userLevel: this.readNumber(gap, ['currentLevel', 'current'])
        }
      ];
    });
  }

  private readString(value: Record<string, unknown>, keys: string[]): string | undefined {
    const candidate = keys.map((key) => value[key]).find((item) => typeof item === 'string');
    return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : undefined;
  }

  private readNumber(value: Record<string, unknown>, keys: string[]): number | undefined {
    const candidate = keys.map((key) => value[key]).find((item) => typeof item === 'number');
    return typeof candidate === 'number' ? candidate : undefined;
  }

  private slugify(value: string): string {
    return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  private toPercentage(score: number | null): number {
    if (score === null || Number.isNaN(score)) {
      return 0;
    }

    return Math.round(Math.min(100, Math.max(0, score <= 1 ? score * 100 : score)));
  }
}
