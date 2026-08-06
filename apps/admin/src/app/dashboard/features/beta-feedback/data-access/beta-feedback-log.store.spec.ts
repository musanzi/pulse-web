import '@angular/compiler';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { IBetaFeedbackRecord } from '@libs/utils';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { BetaFeedbackLogService } from './beta-feedback-log.service';
import { BetaFeedbackLogStore } from './beta-feedback-log.store';

const records: IBetaFeedbackRecord[] = [
  {
    category: 'ai-match',
    contactAllowed: false,
    details: 'The score explanation was useful.',
    id: 'feedback-1',
    rating: 5,
    role: 'talent',
    route: '/dashboard/applications',
    source: 'beta',
    status: 'new',
    submittedAt: '2026-07-27T12:00:00.000Z',
    updatedAt: '2026-07-27T12:00:00.000Z'
  },
  {
    category: 'messaging',
    contactAllowed: false,
    details: 'Conversation switching felt quick.',
    id: 'feedback-2',
    rating: 4,
    role: 'employer',
    route: '/dashboard/messaging',
    source: 'beta',
    status: 'resolved',
    submittedAt: '2026-07-27T13:00:00.000Z',
    updatedAt: '2026-07-27T13:00:00.000Z'
  }
];

describe('BetaFeedbackLogStore', () => {
  it('loads, summarizes, filters, and updates beta feedback', () => {
    const injector = createEnvironmentInjector([
      {
        provide: BetaFeedbackLogService,
        useValue: {
          loadFeedback: () => of(records),
          updateStatus: (id: string) =>
            of({ ...records.find((record) => record.id === id)!, status: 'reviewing' as const })
        }
      }
    ]);
    const store = runInInjectionContext(injector, () => new BetaFeedbackLogStore());

    store.loadFeedback();

    expect(store.summary()).toEqual({
      averageRating: 4.5,
      newCount: 1,
      resolvedCount: 1,
      total: 2
    });

    store.setCategory('messaging');
    expect(store.filteredEntries()).toHaveLength(1);
    expect(store.filteredEntries()[0]?.id).toBe('feedback-2');

    store.updateStatus({ id: 'feedback-1', status: 'reviewing' });
    expect(store.entries()[0]?.status).toBe('reviewing');
    expect(store.updatingId()).toBeNull();

    injector.destroy();
  });
});
