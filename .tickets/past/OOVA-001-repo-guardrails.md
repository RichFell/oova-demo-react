---
id: OOVA-001
title: Add repo guardrails and the verify gate
type: task
epic: EPIC-01
size: M
executor: claude
depends_on: []
touches: [CLAUDE.md, README.md, package.json, package-lock.json, eslint.config.*, jest.config.*, jest.setup.*, tsconfig.json, src/data/**]
claimed_by: Rich Fellure
pr: https://github.com/RichFell/oova-demo-react/pull/1
---

## Context

The app has only `npm run typecheck`, and its README still says SDK 57. Every later ticket depends on one trustworthy verification command.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/workflow.md`

## Acceptance criteria

- [ ] `expo` is pinned with `~` to the installed SDK 58 version instead of `^58.0.0`.
- [ ] `npm run lint` works using Expo's ESLint setup.
- [ ] `npm test` runs Jest with `jest-expo`.
- [ ] `npm run verify` runs typecheck, lint, and tests, and fails if any fail.
- [ ] `src/data/plan.ts` supports only the 30-day plan and has tests for its dates, strip counts, and period markers.
- [ ] `CLAUDE.md` documents commands, structure, sample-data rules, and that APIs must be checked in `node_modules` or official docs.
- [ ] README describes SDK 58 and links to no local-only paths.

## Verification

- `npm run verify`
- `npx expo install --check`

## Out of scope

No UI changes.

## Open questions

None
