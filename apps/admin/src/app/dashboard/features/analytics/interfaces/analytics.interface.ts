export interface IAnalyticsFilter {
  range: '7d' | '30d' | '90d';
}

export interface IAnalyticsMetric {
  id: string;
  labelKey: string;
  value: number;
  changePercent: number;
  trend: 'up' | 'down' | 'steady';
  icon: string;
  format: 'number' | 'percent';
}

export interface IAnalyticsUsagePoint {
  date: string;
  activeUsers: number;
  messages: number;
  aiMatches: number;
}

export interface IProgramOversightRow {
  projectId: string;
  projectName: string;
  coordinatorName: string;
  talentProfileId: string;
  talentName: string;
  completionPercent: number;
  status: 'on-track' | 'attention' | 'completed';
  risk: 'low' | 'medium' | 'high';
  talentProfileRoute: string;
}

export interface IAnalyticsReport {
  id: string;
  titleKey: string;
  format: 'csv' | 'pdf';
  generatedAt: string;
  status: 'ready' | 'generating';
}

export interface IAdminAnalyticsSnapshot {
  source: 'api' | 'mock';
  range: IAnalyticsFilter['range'];
  generatedAt: string;
  metrics: IAnalyticsMetric[];
  usage: IAnalyticsUsagePoint[];
  programs: IProgramOversightRow[];
  reports: IAnalyticsReport[];
}
