import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import express from 'express';
import { afterEach, describe, expect, it } from 'vitest';
import { createBetaFeedbackRouter, ensureBetaFeedbackStorage } from './beta-feedback-api';

describe('beta feedback API', () => {
  let temporaryDirectory = '';

  afterEach(async () => {
    if (temporaryDirectory) {
      await rm(temporaryDirectory, { force: true, recursive: true });
      temporaryDirectory = '';
    }
  });

  it('validates, persists, lists, and updates feedback records', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'pulse-feedback-'));
    const feedbackFile = join(temporaryDirectory, 'nested', 'feedback.json');
    const app = express();
    app.use('/beta-api', createBetaFeedbackRouter(feedbackFile));
    const server = app.listen(0);
    const address = server.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${address.port}/beta-api/feedback`;

    try {
      const invalidResponse = await fetch(baseUrl, {
        body: JSON.stringify({ rating: 9 }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });
      expect(invalidResponse.status).toBe(400);

      const createResponse = await fetch(baseUrl, {
        body: JSON.stringify({
          category: 'usability',
          contactAllowed: false,
          details: 'The current journey context was captured automatically.',
          rating: 5,
          role: 'talent',
          route: '/dashboard/applications'
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });
      expect(createResponse.status).toBe(201);
      const created = (await createResponse.json()) as { id: string; status: string };
      expect(created.status).toBe('new');

      const listResponse = await fetch(baseUrl);
      const collection = (await listResponse.json()) as { items: { id: string }[] };
      expect(collection.items.map((item) => item.id)).toEqual([created.id]);

      const updateResponse = await fetch(`${baseUrl}/${created.id}`, {
        body: JSON.stringify({ status: 'resolved' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH'
      });
      expect(updateResponse.status).toBe(200);
      await expect(updateResponse.json()).resolves.toMatchObject({ id: created.id, status: 'resolved' });

      const persisted = JSON.parse(await readFile(feedbackFile, 'utf8')) as { status: string }[];
      expect(persisted[0]?.status).toBe('resolved');
      await expect(ensureBetaFeedbackStorage(feedbackFile)).resolves.toBeUndefined();
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
  });
});
