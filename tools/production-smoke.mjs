import { spawn } from 'node:child_process';
import { createServer, request as createRequest } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const ports = {
  adminInternal: 46_031,
  adminPublic: 46_030,
  api: 46_040,
  websiteInternal: 46_021,
  websitePublic: 46_020
};
const adminToken = 'production-smoke-admin-token';
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'pulse-production-smoke-'));
const children = [];
const servers = [];

try {
  servers.push(await listen(createApiStub(), ports.api));

  children.push(
    startApplication('website', ports.websiteInternal, {
      BETA_ADMIN_TOKEN: adminToken,
      FEEDBACK_DATA_FILE: join(temporaryDirectory, 'feedback.json')
    }),
    startApplication('admin', ports.adminInternal)
  );

  servers.push(
    await listen(
      createFrontendProxy({
        apiPort: ports.api,
        applicationPort: ports.websiteInternal,
        port: ports.websitePublic,
        websitePort: ports.websiteInternal
      }),
      ports.websitePublic
    ),
    await listen(
      createFrontendProxy({
        adminToken,
        apiPort: ports.api,
        applicationPort: ports.adminInternal,
        port: ports.adminPublic,
        websitePort: ports.websiteInternal
      }),
      ports.adminPublic
    )
  );

  await waitFor(`http://127.0.0.1:${ports.websitePublic}/readyz`);
  await waitFor(`http://127.0.0.1:${ports.adminPublic}/readyz`);

  await assertHtml(`http://127.0.0.1:${ports.websitePublic}/auth/sign-in`, 'Website SSR');
  await assertHtml(`http://127.0.0.1:${ports.adminPublic}/auth/sign-in`, 'Admin SSR');

  const translationResponse = await fetch(`http://127.0.0.1:${ports.websitePublic}/i18n/en.json`);
  assert(translationResponse.ok, 'Website static translation asset was not served');

  const submissionResponse = await fetch(`http://127.0.0.1:${ports.websitePublic}/beta-api/feedback`, {
    body: JSON.stringify({
      category: 'performance',
      contactAllowed: false,
      details: 'Production smoke feedback record',
      rating: 5,
      role: 'coordinator',
      route: '/dashboard/messaging'
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  });
  assert(submissionResponse.status === 201, 'Public beta feedback submission failed');
  const submission = await submissionResponse.json();

  const deniedResponse = await fetch(`http://127.0.0.1:${ports.websitePublic}/beta-api/feedback`);
  assert(deniedResponse.status === 403, 'Unauthenticated feedback listing was not rejected');

  const adminListResponse = await fetch(`http://127.0.0.1:${ports.adminPublic}/beta-api/feedback`);
  assert(adminListResponse.ok, 'Admin feedback listing failed through the protected proxy');

  const updateResponse = await fetch(`http://127.0.0.1:${ports.adminPublic}/beta-api/feedback/${submission.id}`, {
    body: JSON.stringify({ status: 'resolved' }),
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH'
  });
  assert(updateResponse.ok, 'Admin feedback status update failed through the protected proxy');
  const updated = await updateResponse.json();
  assert(updated.status === 'resolved', 'Feedback status was not persisted');

  console.log('Production smoke passed: SSR, readiness, static assets, feedback persistence, and admin isolation.');
} finally {
  for (const server of servers) {
    await close(server);
  }
  for (const child of children) {
    child.kill();
  }
  await rm(temporaryDirectory, { force: true, recursive: true });
}

function startApplication(application, port, extraEnvironment = {}) {
  const serverEntry = resolve(`dist/${application}/server/server.mjs`);
  const child = spawn(process.execPath, [serverEntry], {
    env: {
      ...process.env,
      ALLOWED_HOSTS: '127.0.0.1,localhost',
      NODE_ENV: 'production',
      PORT: String(port),
      ...extraEnvironment
    },
    stdio: ['ignore', 'inherit', 'inherit']
  });
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${application} SSR process exited with code ${code}`);
    }
  });
  return child;
}

function createApiStub() {
  return createServer((request, response) => {
    if (request.url === '/auth/me') {
      response.writeHead(401, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'Unauthenticated smoke session' }));
      return;
    }

    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Not found' }));
  });
}

function createFrontendProxy({ adminToken: token, apiPort, applicationPort, websitePort }) {
  return createServer((incoming, outgoing) => {
    const incomingUrl = incoming.url ?? '/';
    const isApiRequest = incomingUrl === '/api' || incomingUrl.startsWith('/api/');
    const isAdminFeedbackRequest = Boolean(token) && incomingUrl.startsWith('/beta-api/');
    const targetPort = isApiRequest ? apiPort : isAdminFeedbackRequest ? websitePort : applicationPort;
    const targetPath = isApiRequest ? incomingUrl.slice('/api'.length) || '/' : incomingUrl;
    const headers = { ...incoming.headers, host: incoming.headers.host };

    if (isAdminFeedbackRequest) {
      headers['x-beta-admin-token'] = token;
    }

    const proxied = createRequest(
      {
        headers,
        hostname: '127.0.0.1',
        method: incoming.method,
        path: targetPath,
        port: targetPort
      },
      (response) => {
        outgoing.writeHead(response.statusCode ?? 502, response.headers);
        response.pipe(outgoing);
      }
    );
    proxied.on('error', (error) => {
      outgoing.writeHead(502, { 'Content-Type': 'application/json' });
      outgoing.end(JSON.stringify({ message: error.message }));
    });
    incoming.pipe(proxied);
  });
}

async function assertHtml(url, label) {
  const response = await fetch(url);
  const body = await response.text();
  assert(response.ok, `${label} returned ${response.status}`);
  assert(body.toLowerCase().includes('<!doctype html'), `${label} did not render HTML`);
}

async function waitFor(url) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // The SSR process may still be starting.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function listen(server, port) {
  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolvePromise(server));
  });
}

function close(server) {
  return new Promise((resolvePromise) => server.close(() => resolvePromise()));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
