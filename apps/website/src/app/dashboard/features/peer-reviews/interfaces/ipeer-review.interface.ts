export interface IPeerReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  status: 'pending' | 'completed';
  comment?: string;
  createdAt: string;
}