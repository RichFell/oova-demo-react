---
id: OOVA-007
title: Add a screenshot command
type: task
epic: EPIC-01
size: M
executor: claude
depends_on: [OOVA-005]
touches: [package.json, package-lock.json, scripts/**, README.md, .gitignore, CLAUDE.md]
claimed_by: Rich Fellure
blocked_reason:
pr: https://github.com/RichFell/oova-demo-react/pull/7
---

## Context

UI tickets need image evidence, not only passing types.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/workflow.md`

## Acceptance criteria

- [ ] `npm run screenshots` captures each main route at 390 × 844 (1× scale) from Expo web.
- [ ] `npm run screenshots -- <route> [<route>...]` captures only the listed routes.
- [ ] Output goes to the folder in `OOVA_RUN_DIR` when set, otherwise `.screenshots/`.
- [ ] `.screenshots/` is ignored by git.
- [ ] `CLAUDE.md` tells UI tickets to capture only the routes they changed, once before finishing, and inspect those images.
- [ ] `CLAUDE.md` tells the review step not to capture or open screenshots.

## Verification

- `npm run verify`
- `npm run screenshots`

## Out of scope

No visual regression baseline yet.

## Open questions

None
