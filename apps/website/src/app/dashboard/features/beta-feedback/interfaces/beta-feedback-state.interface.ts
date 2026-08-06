import { IBetaFeedbackRecord } from '@libs/utils';

export interface IBetaFeedbackState {
  error: string | null;
  lastSubmission: IBetaFeedbackRecord | null;
  submitting: boolean;
}
