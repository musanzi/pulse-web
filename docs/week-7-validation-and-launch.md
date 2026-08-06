# Week 7 Validation and Launch

## Final functional validation matrix

| Module             | Persona                       | Primary journey                        | Contract or state validated                  | Pass condition                                                             |
| ------------------ | ----------------------------- | -------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------- |
| 1. Talent Profiles | Talent                        | Open the profile and review skills     | `GET /talent-profile/me`                     | API-backed fields render and unavailable backend fields are not fabricated |
| 1. Talent Profiles | Administrator                 | Follow a talent drill-down link        | Current backend limitation                   | Unsupported arbitrary lookup produces an actionable unavailable state      |
| 2. AI Matching     | Talent                        | Review recommendation evidence         | `GET/POST /matching/me/recommendations`      | Normalized score, rationale, matched skills, and growth gaps render        |
| 2. AI Matching     | Talent                        | Start a conversation from a match      | Router context contract                      | Quest/application context arrives in Messaging without a dead end          |
| 3. Messaging       | Talent, Employer, Coordinator | Load a conversation and send a message | Collaboration conversation/message endpoints | Loading, empty, sending, success, and error states remain coherent         |
| 4. Analytics       | Administrator                 | Review platform totals                 | `GET /stats`                                 | Supported metrics render; unsupported datasets show explicit empty states  |
| Bonus              | Beta tester                   | Submit feedback from an active journey | `/beta-api/feedback` POST                    | Current journey is preselected and submission is persisted                 |
| Bonus              | Administrator                 | List and resolve feedback              | Protected GET/PATCH                          | Unauthenticated reads fail and status changes persist                      |

## Quality assurance gate

Run the complete release-candidate gate from the repository root:

```bash
pnpm verify
```

The command performs:

1. ESLint checks for Website and Admin without modifying source files.
2. All Website and Admin Vitest suites.
3. Strict TypeScript checks for both Angular applications.
4. Production SSR builds for Website and Admin.
5. A runtime smoke test with an API stub and proxy topology equivalent to the beta Caddy routes.

The runtime smoke verifies both readiness endpoints, two SSR sign-in pages, static translations, public feedback submission, rejection of an unauthorized feedback read, protected Admin listing, and a persisted status update.

## Manual acceptance session

Automated tests do not replace these final human checks:

- Complete each matrix journey at desktop and mobile widths.
- Complete all controls using keyboard only and confirm visible focus.
- Switch EN/FR and light/dark mode on each newly changed screen.
- Verify loading, empty, API error, and retry states with network throttling.
- Confirm no personal contact details appear outside the protected Admin log.
- Record defects with route, persona, browser, viewport, reproduction steps, expected result, actual result, and severity.

## Social media communication launch kit

### Objective and audience

Launch the validated DigiPulse MVP to university talent, employers, project coordinators, mentors, and program stakeholders. The primary conversion is a visit to the beta Website followed by one completed core journey; the secondary conversion is a structured feedback submission.

### Channel sequence

| Phase    | Channel                                         | Content                                   | Call to action           | Measure                      |
| -------- | ----------------------------------------------- | ----------------------------------------- | ------------------------ | ---------------------------- |
| Teaser   | LinkedIn and project channels                   | Explain the skills-to-opportunity problem | Follow the launch update | Reach and saves              |
| Launch   | LinkedIn, university communities, partner email | Show the four-module workflow             | Try the beta             | Qualified visits             |
| Proof    | Project channels and demo session               | Share anonymized task-completion evidence | Complete one journey     | Completion rate              |
| Feedback | In-product shortcut and follow-up post          | Ask for one concrete observation          | Submit feedback          | Response and resolution rate |

### English launch copy

> DigiPulse is now entering its validated MVP stage. Talent can build an evidence-backed profile, understand explainable AI opportunity matches, close skill gaps through actionable work, and collaborate in context. Employers and coordinators gain clearer project communication, while administrators can monitor supported platform metrics and beta feedback. Explore the beta and tell us where the next improvement should go.

### French launch copy

> DigiPulse entre maintenant dans sa phase MVP validee. Les talents peuvent construire un profil fonde sur des preuves, comprendre les recommandations d'opportunites expliquees par l'IA, combler leurs ecarts de competences par des actions concretes et collaborer en contexte. Les employeurs et coordinateurs disposent d'une communication de projet plus claire, tandis que les administrateurs peuvent suivre les indicateurs disponibles et les retours beta. Explorez la beta et indiquez-nous la prochaine amelioration prioritaire.

### Publishing controls

- Replace beta URLs, owner names, screenshots, and campaign dates before publication.
- Use consented, anonymized evidence only; never publish contact details or raw feedback.
- Add per-channel UTM parameters using `utm_source`, `utm_medium`, `utm_campaign=digipulse_mvp`, and `utm_content`.
- Review EN/FR copy with the project owner and accessibility lead before posting.
- Capture reach, qualified visits, journey completion, feedback conversion, and critical defect counts after 24 hours and 7 days.
