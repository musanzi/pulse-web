# Week 8 Release Candidate Report

## Candidate

- Branch: `design/week2-high-fidelity-screens`
- Validation date: 2026-08-04
- Scope: four core modules, beta feedback refinement, production SSR topology, launch material, and MVP roadmap

## Automated evidence

| Gate                 | Result | Evidence                                                                          |
| -------------------- | ------ | --------------------------------------------------------------------------------- |
| Website unit tests   | Passed | 6 files, 7 tests                                                                  |
| Admin unit tests     | Passed | 2 files, 2 tests                                                                  |
| ESLint               | Passed | Website and Admin                                                                 |
| Strict TypeScript    | Passed | Website and Admin application configs                                             |
| Production SSR build | Passed | Website and Admin bundles generated within configured initial budgets             |
| Runtime readiness    | Passed | Website persistence check and Admin readiness returned 200                        |
| SSR rendering        | Passed | Website and Admin sign-in routes returned rendered HTML through the proxy harness |
| Static assets        | Passed | EN translation asset served from the production Website bundle                    |
| Feedback isolation   | Passed | Public POST accepted; unauthenticated GET rejected with 403                       |
| Feedback persistence | Passed | Admin-proxied list and status update persisted successfully                       |
| Formatting           | Passed | All changed supported files match repository Prettier configuration               |
| Diff integrity       | Passed | `git diff --check` reported no whitespace errors                                  |
| Compose syntax       | Passed | `compose.beta.yml` parsed as valid YAML                                           |

The complete repeatable gate is `pnpm verify`. GitHub Actions now runs the same lint, test, type-check, build, and production-smoke sequence for pull requests and pushes to `main`.

## Environment notes

- The initial sandboxed Angular build could not traverse the OneDrive workspace boundary. Re-running with normal workspace access completed successfully; this was an environment permission issue, not a source failure.
- Docker CLI is not installed on this workstation. An actual `docker compose up` and Caddy binary validation could not be repeated locally. The Compose YAML parsed successfully, and the Node production smoke harness exercised equivalent `/api`, `/beta-api`, token injection, SSR, and persistence routing.
- Nx reports its existing Angular build target as flaky because the sandboxed attempt failed and the unrestricted retry passed. The successful build output is the release evidence.

## Required human release checks

These checks cannot be truthfully automated or completed without project-owner accounts and deployment infrastructure:

- Run the persona acceptance matrix on the hosted beta with the real `pulse-api` service.
- Test keyboard and screen-reader flows in supported browsers and mobile devices.
- Replace all example domains and `BETA_ADMIN_TOKEN`, then run `docker compose config` and `pnpm beta:up` on the deployment host.
- Assign release and rollback owners and confirm the monitoring window.
- Obtain content approval, publish the EN/FR social posts, and record the live URLs and campaign metrics.

## Recommendation

The repository is a stabilized production candidate at the automated validation level. Promotion to a public MVP should occur only after the listed hosted, accessibility, secret-management, and campaign-owner checks are signed off.
