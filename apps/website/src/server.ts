import { timingSafeEqual } from 'node:crypto';
import { join } from 'node:path';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import { createBetaFeedbackRouter, ensureBetaFeedbackStorage } from './beta-feedback-api';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const allowedHosts = (process.env['ALLOWED_HOSTS'] ?? '*.localhost,localhost')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);
const allowedOrigins = (process.env['BETA_ALLOWED_ORIGINS'] ?? 'http://admin.localhost,http://localhost:4300')
  .split(',')
  .map((origin) => origin.trim());
const adminHosts = (process.env['BETA_ADMIN_HOSTS'] ?? 'admin.localhost').split(',').map((host) => host.trim());
const adminToken = process.env['BETA_ADMIN_TOKEN']?.trim() ?? '';
const production = process.env['NODE_ENV'] === 'production';
const angularApp = new AngularNodeAppEngine({
  allowedHosts
});

app.get('/healthz', (_request, response) => {
  response.status(200).json({ service: 'website', status: 'ok' });
});

app.get('/readyz', async (_request, response) => {
  try {
    await ensureBetaFeedbackStorage();
    response.status(200).json({ checks: { feedbackStorage: 'ok' }, service: 'website', status: 'ready' });
  } catch {
    response.status(503).json({ checks: { feedbackStorage: 'unavailable' }, service: 'website', status: 'not-ready' });
  }
});

app.use('/beta-api', (request, response, next) => {
  const origin = request.headers.origin;
  const suppliedToken = request.header('X-Beta-Admin-Token') ?? '';
  const trustedDevelopmentOrigin =
    !production && (adminHosts.includes(request.hostname) || (origin ? allowedOrigins.includes(origin) : false));
  const adminRequest = trustedDevelopmentOrigin || tokensMatch(suppliedToken, adminToken);

  if (origin && allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  if (request.method !== 'POST' && !adminRequest) {
    response.status(403).json({ message: 'Admin feedback access required' });
    return;
  }

  next();
});
app.use('/beta-api', createBetaFeedbackRouter());

function tokensMatch(suppliedToken: string, expectedToken: string): boolean {
  if (!suppliedToken || !expectedToken) {
    return false;
  }

  const supplied = Buffer.from(suppliedToken);
  const expected = Buffer.from(expectedToken);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4200.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4200;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
