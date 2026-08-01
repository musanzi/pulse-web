# Week 5 Beta Deployment and Feedback Log

## Delivery scope

- Website beta: `http://app.localhost`
- Admin beta: `http://admin.localhost`
- Reverse proxy: Caddy with compression, security headers, active upstream health checks, and automatic HTTPS on real domains
- Runtime: Angular SSR applications in non-root Node 24 containers
- Feedback storage: persistent Docker volume mounted at `/app/data`
- Feedback workflow: Website submission -> persisted `/beta-api/feedback` record -> Admin triage log

## Start the beta environment

```bash
pnpm beta:up
docker compose -f compose.beta.yml ps
```

For a hosted beta, copy `.env.beta.example` to `.env.beta`, replace the `.localhost` values with the assigned DNS names, and start with:

```bash
docker compose --env-file .env.beta -f compose.beta.yml up --build -d
```

Caddy enables automatic HTTPS when `WEBSITE_ADDRESS` and `ADMIN_ADDRESS` are real hostnames without an `http://` prefix.

## Beta test protocol

Each tester completes the same core journey before submitting one observation through `/dashboard/feedback`.

| Persona       | Core task                                                               | Success signal                                                             |
| ------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Talent        | Review an AI match, inspect growth evidence, then start a conversation  | Match rationale is understood and Messaging opens with the correct context |
| Employer      | Review talent evidence and continue a project conversation              | The relevant talent and application context remain visible                 |
| Coordinator   | Review collaboration progress and identify the next action              | Messaging and project state support a clear intervention                   |
| Administrator | Review analytics, drill into a talent profile, and triage beta feedback | The correct profile opens and feedback status persists                     |

## Measurement targets

| Measure                  | Week 5 beta target                                 |
| ------------------------ | -------------------------------------------------- |
| Core task completion     | At least 80% without facilitator intervention      |
| Median experience rating | At least 4/5                                       |
| Critical blockers        | 0 unresolved before the next beta release          |
| Feedback acknowledgement | All new entries reviewed within one working day    |
| Accessibility            | Keyboard completion for all beta feedback controls |

## Feedback status definitions

| Status    | Meaning                                        |
| --------- | ---------------------------------------------- |
| New       | Captured and awaiting first review             |
| Reviewing | Reproducing or validating the observation      |
| Planned   | Accepted into an upcoming implementation cycle |
| Resolved  | Fix verified or observation otherwise closed   |

## Engineering verification log

| Date       | Environment     | Check                             | Result  | Notes                                        |
| ---------- | --------------- | --------------------------------- | ------- | -------------------------------------------- |
| 2026-07-27 | Local workspace | Website unit tests                | Passed  | 5/5 tests passed                             |
| 2026-07-27 | Local workspace | Admin unit tests                  | Passed  | 2/2 tests passed                             |
| 2026-07-27 | Local workspace | Nx lint                           | Passed  | Website and Admin pass ESLint                |
| 2026-07-27 | Local workspace | Production SSR build              | Passed  | Website and Admin bundles generated          |
| 2026-07-27 | Website SSR     | Feedback API smoke test           | Passed  | Health, create, list, and update verified    |
| 2026-07-27 | Docker beta     | Compose structure                 | Passed  | Both Compose files parse as valid YAML       |
| 2026-07-27 | Docker beta     | Caddy and container health checks | Blocked | Docker CLI is not installed on this computer |

## Active user feedback log

User submissions are stored by the Website SSR service and displayed in the Admin application at `/dashboard/beta-feedback`. The log captures persona, tested route, category, 1-5 experience rating, observation, consent-based contact details, timestamps, and triage status.

Do not copy personal contact information into this document. Use the protected Admin feedback log as the source of truth.
