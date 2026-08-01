import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  BetaFeedbackCategory,
  BetaFeedbackRole,
  BetaFeedbackStatus,
  IBetaFeedbackCollection,
  IBetaFeedbackRecord,
  IBetaFeedbackSubmission,
  IBetaFeedbackUpdate
} from '@libs/utils';
import express from 'express';

const categories: BetaFeedbackCategory[] = [
  'accessibility',
  'ai-match',
  'messaging',
  'other',
  'performance',
  'usability'
];
const roles: BetaFeedbackRole[] = ['coordinator', 'employer', 'talent'];
const statuses: BetaFeedbackStatus[] = ['new', 'planned', 'resolved', 'reviewing'];
const feedbackFile = resolve(process.env['FEEDBACK_DATA_FILE'] ?? 'data/beta-feedback.json');
let mutationQueue = Promise.resolve();

export function createBetaFeedbackRouter(): express.Router {
  const router = express.Router();

  router.use(express.json({ limit: '16kb' }));

  router.get('/feedback', async (_request, response, next) => {
    try {
      const payload: IBetaFeedbackCollection = { items: await readFeedback() };
      response.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.post('/feedback', async (request, response, next) => {
    try {
      const submission = parseSubmission(request.body);
      const now = new Date().toISOString();
      const record: IBetaFeedbackRecord = {
        ...submission,
        id: randomUUID(),
        source: 'beta',
        status: 'new',
        submittedAt: now,
        updatedAt: now
      };

      await mutateFeedback((records) => [record, ...records]);
      response.status(201).json(record);
    } catch (error) {
      if (error instanceof TypeError) {
        response.status(400).json({ message: error.message });
        return;
      }

      next(error);
    }
  });

  router.patch('/feedback/:id', async (request, response, next) => {
    try {
      const update = parseUpdate(request.body);
      let updatedRecord: IBetaFeedbackRecord | null = null;

      await mutateFeedback((records) =>
        records.map((record) => {
          if (record.id !== request.params['id']) {
            return record;
          }

          updatedRecord = {
            ...record,
            status: update.status,
            updatedAt: new Date().toISOString()
          };
          return updatedRecord;
        })
      );

      if (!updatedRecord) {
        response.status(404).json({ message: 'Feedback entry not found' });
        return;
      }

      response.json(updatedRecord);
    } catch (error) {
      if (error instanceof TypeError) {
        response.status(400).json({ message: error.message });
        return;
      }

      next(error);
    }
  });

  return router;
}

async function mutateFeedback(mutate: (records: IBetaFeedbackRecord[]) => IBetaFeedbackRecord[]): Promise<void> {
  const operation = mutationQueue.then(async () => {
    const records = mutate(await readFeedback());
    await mkdir(dirname(feedbackFile), { recursive: true });
    const temporaryFile = `${feedbackFile}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(records, null, 2), 'utf8');
    await rename(temporaryFile, feedbackFile);
  });

  mutationQueue = operation.catch(() => undefined);
  return operation;
}

async function readFeedback(): Promise<IBetaFeedbackRecord[]> {
  try {
    const content = await readFile(feedbackFile, 'utf8');
    const records = JSON.parse(content) as IBetaFeedbackRecord[];
    return Array.isArray(records) ? records : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

function parseSubmission(value: unknown): IBetaFeedbackSubmission {
  if (!isRecord(value)) {
    throw new TypeError('A feedback payload is required');
  }

  const category = value['category'];
  const contactAllowed = value['contactAllowed'];
  const details = sanitizeText(value['details'], 2000);
  const rating = value['rating'];
  const role = value['role'];
  const route = sanitizeText(value['route'], 240);

  if (!categories.includes(category as BetaFeedbackCategory)) {
    throw new TypeError('Invalid feedback category');
  }
  if (typeof contactAllowed !== 'boolean') {
    throw new TypeError('Invalid contact preference');
  }
  if (!details) {
    throw new TypeError('Feedback details are required');
  }
  if (!Number.isInteger(rating) || Number(rating) < 1 || Number(rating) > 5) {
    throw new TypeError('Rating must be between 1 and 5');
  }
  if (!roles.includes(role as BetaFeedbackRole)) {
    throw new TypeError('Invalid beta tester role');
  }
  if (!route) {
    throw new TypeError('The tested route is required');
  }

  const contactEmail = contactAllowed ? sanitizeText(value['contactEmail'], 254) : '';
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    throw new TypeError('Invalid contact email');
  }

  return {
    category: category as BetaFeedbackCategory,
    contactAllowed,
    ...(contactEmail ? { contactEmail } : {}),
    details,
    rating: Number(rating),
    role: role as BetaFeedbackRole,
    route
  };
}

function parseUpdate(value: unknown): IBetaFeedbackUpdate {
  if (!isRecord(value) || !statuses.includes(value['status'] as BetaFeedbackStatus)) {
    throw new TypeError('Invalid feedback status');
  }

  return { status: value['status'] as BetaFeedbackStatus };
}

function sanitizeText(value: unknown, maximumLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maximumLength) : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
