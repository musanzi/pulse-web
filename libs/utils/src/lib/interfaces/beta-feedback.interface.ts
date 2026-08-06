export type BetaFeedbackCategory = 'accessibility' | 'ai-match' | 'messaging' | 'other' | 'performance' | 'usability';

export type BetaFeedbackRole = 'coordinator' | 'employer' | 'talent';

export type BetaFeedbackStatus = 'new' | 'planned' | 'resolved' | 'reviewing';

export interface IBetaFeedbackSubmission {
  category: BetaFeedbackCategory;
  contactAllowed: boolean;
  contactEmail?: string;
  details: string;
  rating: number;
  role: BetaFeedbackRole;
  route: string;
}

export interface IBetaFeedbackRecord extends IBetaFeedbackSubmission {
  id: string;
  source: 'beta';
  status: BetaFeedbackStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface IBetaFeedbackCollection {
  items: IBetaFeedbackRecord[];
}

export interface IBetaFeedbackUpdate {
  status: BetaFeedbackStatus;
}
