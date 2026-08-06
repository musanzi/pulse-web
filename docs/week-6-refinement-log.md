# Week 6 Refinement Log

## Evidence basis

No export of identifiable beta submissions is committed to the repository. At the start of Week 6, the protected feedback store contained no reviewable anonymized findings in source control and PR #4 had no reviewer comments. The refinement scope therefore uses the Week 1 UX audit, the Week 5 test protocol, and production-readiness gaps observed during engineering validation. It does not attribute invented statements to users.

## Delivered bonus refinements

| Finding                                                                     | Refinement                                                                       | Acceptance signal                                                                         |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Testers had to leave a task and manually remember its route                 | Added a persistent Material feedback shortcut in the Website dashboard header    | Opening feedback from a supported module preselects the current journey                   |
| Feedback administration relied on Host/Origin trust                         | Added a timing-safe admin token check and proxy-only token injection             | Production GET/PATCH requests without the token return 403; public POST remains available |
| A process health check could pass while the feedback volume was unavailable | Added `/readyz` and a write-access check for the feedback storage directory      | Website readiness returns 503 when persistence is unavailable                             |
| Release checks were documented but not reproducible in CI                   | Added strict type-check, unit-test, build, and production runtime smoke commands | A single `pnpm verify` command exercises the complete candidate gate                      |

## UX and accessibility details

- The feedback shortcut uses Angular Material's icon button and tooltip patterns.
- Its accessible name is translated in English and French.
- It is hidden on the feedback page to avoid a circular action.
- Journey context is allow-listed before it reaches the form; arbitrary query-string values are ignored.
- Existing light and dark theme tokens are reused, with no new visual theme introduced.

## Security and operations details

- `BETA_ADMIN_TOKEN` must be replaced before deploying to a shared host.
- Caddy injects the token only for Admin-originated `/beta-api/*` traffic.
- Token comparison uses `timingSafeEqual` and rejects missing or length-mismatched values.
- Development retains the existing trusted-origin fallback so local Angular development remains usable.
- Container health checks now use readiness rather than process liveness.

## Deferred findings

These items require backend API changes and remain explicit rather than simulated:

- arbitrary Talent Profile lookup for Admin drill-down;
- participant display metadata in collaboration summaries;
- analytics time-series, program oversight, and report datasets;
- a durable shared feedback database and role-based authorization owned by `pulse-api`.
