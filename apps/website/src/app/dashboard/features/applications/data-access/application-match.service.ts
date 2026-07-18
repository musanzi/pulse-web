import { Service } from '@angular/core';
import { map, Observable, timer } from 'rxjs';
import { IApplicationMatchRequest, IMatchInsight, IMatchSkill, IRoleSkillRequirement } from '../interfaces';

const ROLE_REQUIREMENTS: IRoleSkillRequirement[] = [
  { category: 'programming', id: 'python', name: 'Python', requiredLevel: 4, weight: 0.34 },
  { category: 'analytics', id: 'data-analysis', name: 'Data Analysis', requiredLevel: 4, weight: 0.31 },
  { category: 'data', id: 'sql', name: 'SQL', requiredLevel: 3, weight: 0.18 },
  {
    category: 'communication',
    id: 'dashboard-storytelling',
    name: 'Dashboard Storytelling',
    requiredLevel: 4,
    weight: 0.17
  }
];

@Service()
export class ApplicationMatchService {
  loadMatchResult(request: IApplicationMatchRequest): Observable<IMatchInsight> {
    return timer(300).pipe(map(() => this.createMockMatchInsight(request)));
  }

  private createMockMatchInsight(request: IApplicationMatchRequest): IMatchInsight {
    const matchedSkills = this.getMatchedSkills(request);
    const missingSkills = this.getMissingSkills(request);
    const skillAlignment = Math.round(
      ROLE_REQUIREMENTS.reduce((score, requirement) => {
        const skill = request.talentProfile.skills.find((item) => item.id === requirement.id);
        const levelRatio = Math.min((skill?.level ?? 0) / requirement.requiredLevel, 1);

        return score + requirement.weight * levelRatio;
      }, 0) * 100
    );
    const projectEvidence = request.talentProfile.projects.length > 0 ? 5 : 0;

    return {
      ai: {
        model: 'openai/gpt-4.1-mini',
        promptVersion: 'talent-match-v1',
        provider: 'openrouter',
        source: 'mock'
      },
      applicationId: request.applicationId,
      compatibilityScore: Math.min(skillAlignment + projectEvidence, 100),
      confidence: 'high',
      generatedAt: new Date().toISOString(),
      headlineKey: 'applications.match.mockHeadline',
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
          descriptionKey: 'applications.rationale.mockSkillOverlapDescription',
          evidenceSkillIds: matchedSkills.map((skill) => skill.id),
          icon: 'badge-check',
          id: 'skill-overlap',
          metricLabelKey: 'applications.rationale.skillOverlapMetric',
          metricValue: `${matchedSkills.length}/${ROLE_REQUIREMENTS.length}`,
          titleKey: 'applications.rationale.mockSkillOverlapTitle'
        },
        {
          descriptionKey: 'applications.rationale.mockProjectFitDescription',
          evidenceSkillIds: request.talentProfile.projects.flatMap((project) => project.skillIds),
          icon: 'workflow',
          id: 'project-fit',
          metricLabelKey: 'applications.rationale.projectFitMetric',
          metricValue: `+${projectEvidence}%`,
          titleKey: 'applications.rationale.mockProjectFitTitle'
        },
        {
          descriptionKey: 'applications.rationale.mockGrowthAreaDescription',
          evidenceSkillIds: missingSkills.map((skill) => skill.id),
          icon: 'target',
          id: 'growth-area',
          metricLabelKey: 'applications.rationale.growthAreaMetric',
          metricValue: `${missingSkills.length} quest`,
          titleKey: 'applications.rationale.mockGrowthAreaTitle'
        }
      ],
      reviewEtaKey: 'applications.match.reviewEta',
      roleId: request.roleId,
      roleTitle: 'Data Analyst Intern',
      scoreBreakdown: {
        experience: 0,
        projectEvidence,
        skillAlignment
      },
      status: 'ready',
      summaryKey: 'applications.match.mockSummary',
      talentProfileId: request.talentProfile.id
    };
  }

  private getMatchedSkills(request: IApplicationMatchRequest): IMatchSkill[] {
    return ROLE_REQUIREMENTS.flatMap((requirement) => {
      const skill = request.talentProfile.skills.find((item) => item.id === requirement.id);

      if (!skill || skill.level < requirement.requiredLevel) {
        return [];
      }

      return [
        {
          category: requirement.category,
          id: requirement.id,
          name: requirement.name,
          requiredLevel: requirement.requiredLevel,
          userLevel: skill.level,
          weight: requirement.weight
        }
      ];
    });
  }

  private getMissingSkills(request: IApplicationMatchRequest): IMatchSkill[] {
    return ROLE_REQUIREMENTS.flatMap((requirement) => {
      const skill = request.talentProfile.skills.find((item) => item.id === requirement.id);

      if (skill && skill.level >= requirement.requiredLevel) {
        return [];
      }

      return [
        {
          category: requirement.category,
          id: requirement.id,
          name: requirement.name,
          requiredLevel: requirement.requiredLevel,
          userLevel: skill?.level ?? 0,
          weight: requirement.weight
        }
      ];
    });
  }
}
