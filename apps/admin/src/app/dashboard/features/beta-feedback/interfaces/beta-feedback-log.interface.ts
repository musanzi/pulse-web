import { BetaFeedbackCategory, BetaFeedbackStatus, IBetaFeedbackRecord } from '@libs/utils';

export type BetaFeedbackCategoryFilter = 'all' | BetaFeedbackCategory;

export type BetaFeedbackStatusFilter = 'all' | BetaFeedbackStatus;

export interface IBetaFeedbackLogState {
  category: BetaFeedbackCategoryFilter;
  entries: IBetaFeedbackRecord[];
  error: string | null;
  loading: boolean;
  status: BetaFeedbackStatusFilter;
  updatingId: string | null;
}

export interface IBetaFeedbackSummary {
  averageRating: number;
  newCount: number;
  resolvedCount: number;
  total: number;
}
