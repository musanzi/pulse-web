# DigiPulse WebApps

The workspace uses Nx, pnpm, Angular SSR, Angular Material, Transloco, shared libraries, and a shared styling layer so both apps can share infrastructure without mixing app-specific features.

## What's Included

- **Two Angular applications**
  - `website` for the public-facing app, landing pages, auth flows, and user dashboard
  - `admin` for the authenticated admin/dashboard app
- **Server-side rendering** for both apps
- **Nx workspace tooling** for builds, linting, caching, and project orchestration
- **Shared libraries**
  - `@libs/core` for application infrastructure such as icons, theming, media, Transloco, and local storage
  - `@libs/ui` for reusable standalone UI building blocks
  - `@libs/utils` for reusable interfaces, errors, and utility types
- **Shared styles** under `styles/`, including Tailwind CSS, base styles, components, and third-party overrides
- **Path aliases** for cleaner imports across apps and libraries
- **Light/dark mode and EN/FR translation support** as baseline UI requirements

## Tech Stack

- Angular 22
- Nx 23
- pnpm
- TypeScript 6
- Tailwind CSS 4
- Angular Material / CDK
- NgRx Signals
- Transloco
- Express SSR
- Vitest-ready tooling

## Requirements

- Node.js `>=24.0.0`
- pnpm
- Docker, if you want to build and run the apps in containers

Install pnpm if needed:

```bash
npm install -g pnpm
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the public website:

```bash
pnpm dev:website
```

The website runs on `http://localhost:4200`.

Run the admin app:

```bash
pnpm dev:admin
```

The admin app runs on `http://localhost:4300`.

## Docker

Start both apps in development mode:

```bash
docker compose -f compose.dev.yml up
```

Start both apps in production mode:

```bash
docker compose -f compose.prod.yml up
```

The website runs on `http://localhost:4200` and the admin app runs on `http://localhost:4300`.

To start only one app, add the service name:

```bash
docker compose -f compose.dev.yml up website
docker compose -f compose.dev.yml up admin
```

Use the same service names with the production compose file:

```bash
docker compose -f compose.prod.yml up website
docker compose -f compose.prod.yml up admin
```

The development compose file builds the Dockerfile `development` stage and mounts the local workspace into the container for live development. The production compose file builds the `production` stage and runs the SSR servers from the built output.

## Available Scripts

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `pnpm dev:website`   | Start the website dev server on port `4200`. |
| `pnpm dev:admin`     | Start the admin dev server on port `4300`.   |
| `pnpm build`         | Build both applications.                     |
| `pnpm build:website` | Build only the website app.                  |
| `pnpm build:admin`   | Build only the admin app.                    |
| `pnpm lint`          | Lint both applications.                      |
| `pnpm ssr:website`   | Run the built website SSR server.            |
| `pnpm ssr:admin`     | Run the built admin SSR server.              |

Build the target app before running an `ssr:*` command.

## Application Routes

The website app is split into landing, authentication, and dashboard areas:

```text
/                  Landing routes
/auth              Sign in, sign up, password reset, and related auth flows
/dashboard         Authenticated user dashboard and profile routes
```

The admin app protects the dashboard at the root route and includes a locked screen:

```text
/                  Authenticated admin dashboard
/locked            Locked-session screen
```

## Project Structure

```text
apps/
  admin/              Admin/dashboard application
    src/app/auth/     Admin authentication feature
    src/app/dashboard/  Admin dashboard feature
    src/app/locked/   Locked-session screen

  website/            Public website application
    src/app/auth/     Public authentication feature
    src/app/dashboard/  User dashboard feature
    src/app/landing/  Public landing routes

libs/
  core/               Shared application infrastructure
  ui/                 Reusable UI components
  utils/              Shared interfaces, errors, and utility exports

public/               Static assets copied into each app build
styles/               Shared CSS, Tailwind layers, and component styles

eslint.config.ts      Workspace ESLint configuration
nx.json               Nx workspace configuration
tsconfig.base.json    Shared TypeScript configuration and path aliases
```

Feature folders should stay inside the owning app unless the code is genuinely reusable. Within a feature, use these folders consistently:

```text
data-access/          Services and NgRx Signal Store state
interfaces/           Feature-local interfaces prefixed with I
pages/                Route-level screens
ui/                   Presentational components with no direct store access
```

## Import Aliases

The workspace defines these aliases in `tsconfig.base.json`:

```ts
import { ... } from '@libs/core';
import { ... } from '@libs/ui';
import { ... } from '@libs/utils';
import { ... } from '@admin/app/...';
import { ... } from '@website/app/...';
```

Use `@libs/core` for reusable infrastructure, `@libs/ui` for shared UI components, and `@libs/utils` for shared types or lightweight utilities. Keep app-specific code inside its app folder unless it is clearly useful across applications.

## Feature Conventions

- Build UI with Angular Material components and shared styles.
- Every new UI surface must support light and dark mode.
- Every new user-facing label must support English and French translations.
- Put feature state and API services in `data-access/`.
- Use Angular `@Service()` for services.
- Use NgRx Signal Store for feature state.
- Put all interfaces in an `interfaces/` folder and prefix interface names with `I`, for example `ISignInPayload`.
- Do not define reusable or feature contracts directly inside components or services.
- Keep `ui/` components presentational. They should receive data through inputs and emit events instead of reading directly from stores.

## Internationalization

Translations are loaded through the shared Transloco loader in `@libs/core`.

Runtime translation files are expected at:

```text
public/i18n/en.json
public/i18n/fr.json
```

Because `public/` is configured as a build asset input for both applications, translations placed there are available to both SSR builds.

## Styling

Global styles are loaded from:

```text
styles/styles.css
```

That file pulls from the shared style system:

- `styles/base/` for reset, typography, and base rules
- `styles/components/` for reusable component-level CSS
- `styles/tailwind/` for Tailwind theme, utilities, and variants
- `styles/third-party/` for vendor-specific style overrides

Static assets, including fonts, live in `public/`.

## Building For Production

Build both apps:

```bash
pnpm build
```

The SSR output is generated under:

```text
dist/website/
dist/admin/
```

Run the built servers locally:

```bash
pnpm ssr:website
pnpm ssr:admin
```

For deployment, point your host or process manager at the generated server entry:

```text
dist/website/server/server.mjs
dist/admin/server/server.mjs
```

## Week 5 Beta Deployment

The beta stack runs both SSR applications behind Caddy and persists active user feedback in a Docker volume:

```bash
pnpm beta:up
```

Open `http://app.localhost` for the Website and `http://admin.localhost` for Admin. Use `/dashboard/feedback` to submit a beta observation and `/dashboard/beta-feedback` to triage the shared feedback log.

Hosted environments can copy `.env.beta.example` to `.env.beta`, set the assigned Website and Admin domains, and run:

```bash
docker compose --env-file .env.beta -f compose.beta.yml up --build -d
```

Caddy provisions HTTPS automatically for resolvable public domains. The complete test protocol and tracking template are in `docs/week-5-beta-test-log.md`.

## Development Notes

- Prefer adding shared, framework-level behavior to `libs/core`.
- Prefer adding reusable interfaces and small utility exports to `libs/utils`.
- Keep route-level features colocated inside the owning app.
- Keep global visual decisions in `styles/` so both apps stay consistent.
- Use Nx commands when adding new projects, libraries, or targets so workspace metadata stays in sync.
- Before opening a PR or handing off work, run the relevant lint and build commands for the app you changed.
