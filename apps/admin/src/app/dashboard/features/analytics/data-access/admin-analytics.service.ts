import { Service } from '@angular/core';
import { map, Observable, timer } from 'rxjs';
import { IAdminAnalyticsSnapshot, IAnalyticsFilter, IAnalyticsUsagePoint, IProgramOversightRow } from '../interfaces';

const PROGRAMS: IProgramOversightRow[] = [
  {
    completionPercent: 78,
    coordinatorName: 'Jules Martin',
    projectId: 'project-northstar',
    projectName: 'Northstar Data Lab',
    risk: 'low',
    status: 'on-track',
    talentName: 'Alex Morgan',
    talentProfileId: 'talent-123',
    talentProfileRoute: '/dashboard/talent/talent-123'
  },
  {
    completionPercent: 46,
    coordinatorName: 'Samira Bell',
    projectId: 'project-civic-signals',
    projectName: 'Civic Signals Sprint',
    risk: 'high',
    status: 'attention',
    talentName: 'Noah Williams',
    talentProfileId: 'talent-456',
    talentProfileRoute: '/dashboard/talent/talent-456'
  },
  {
    completionPercent: 100,
    coordinatorName: 'Jules Martin',
    projectId: 'project-accessibility',
    projectName: 'Accessibility Quest',
    risk: 'low',
    status: 'completed',
    talentName: 'Camille Dubois',
    talentProfileId: 'talent-789',
    talentProfileRoute: '/dashboard/talent/talent-789'
  }
];

@Service()
export class AdminAnalyticsService {
  loadAnalytics(filter: IAnalyticsFilter): Observable<IAdminAnalyticsSnapshot> {
    return timer(280).pipe(map(() => this.createSnapshot(filter)));
  }

  private createSnapshot(filter: IAnalyticsFilter): IAdminAnalyticsSnapshot {
    const multiplier = filter.range === '7d' ? 0.45 : filter.range === '90d' ? 2.4 : 1;

    return {
      generatedAt: new Date().toISOString(),
      metrics: [
        {
          changePercent: 12.8,
          format: 'number',
          icon: 'users-round',
          id: 'active-talents',
          labelKey: 'admin.analytics.metrics.activeTalents',
          trend: 'up',
          value: Math.round(1284 * multiplier)
        },
        {
          changePercent: 8.4,
          format: 'number',
          icon: 'sparkles',
          id: 'ai-matches',
          labelKey: 'admin.analytics.metrics.aiMatches',
          trend: 'up',
          value: Math.round(436 * multiplier)
        },
        {
          changePercent: 5.1,
          format: 'number',
          icon: 'messages-square',
          id: 'collaborations',
          labelKey: 'admin.analytics.metrics.collaborations',
          trend: 'up',
          value: Math.round(892 * multiplier)
        },
        {
          changePercent: 2.3,
          format: 'percent',
          icon: 'circle-check-big',
          id: 'completion-rate',
          labelKey: 'admin.analytics.metrics.completionRate',
          trend: 'up',
          value: 74
        }
      ],
      programs: PROGRAMS.map((program) => ({ ...program })),
      range: filter.range,
      reports: [
        {
          format: 'pdf',
          generatedAt: '2026-07-20T14:00:00.000Z',
          id: 'program-health',
          status: 'ready',
          titleKey: 'admin.analytics.reports.programHealth'
        },
        {
          format: 'csv',
          generatedAt: '2026-07-20T13:40:00.000Z',
          id: 'engagement-export',
          status: 'ready',
          titleKey: 'admin.analytics.reports.engagementExport'
        }
      ],
      source: 'mock',
      usage: this.createUsage(filter.range)
    };
  }

  private createUsage(range: IAnalyticsFilter['range']): IAnalyticsUsagePoint[] {
    const scale = range === '7d' ? 0.7 : range === '90d' ? 1.35 : 1;
    const values = [
      [108, 62, 38],
      [126, 71, 45],
      [119, 83, 51],
      [148, 96, 63],
      [162, 112, 69],
      [154, 124, 72],
      [181, 138, 84]
    ];

    return values.map(([activeUsers, messages, aiMatches], index) => ({
      activeUsers: Math.round(activeUsers * scale),
      aiMatches: Math.round(aiMatches * scale),
      date: new Date(Date.UTC(2026, 6, 14 + index)).toISOString(),
      messages: Math.round(messages * scale)
    }));
  }
}
