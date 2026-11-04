---
id: OOVA-002
title: Block hard-coded design values
type: task
epic: EPIC-01
size: S
executor: claude
depends_on: [OOVA-001]
touches: [eslint.config.*, src/features/**, src/theme/**, package.json, package-lock.json]
claimed_by: Rich Fellure
pr: https://github.com/RichFell/oova-demo-react/pull/2
---

## Context

Design drift is easy to introduce and hard to spot in review. Make the rule automatic.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`

## Acceptance criteria

- [ ] Lint fails on hex or `rgb()` colors outside `src/theme/`.
- [ ] `StartScanTile` uses tokens only.
- [ ] A short comment in the lint config explains the rule.

## Verification

- `npm run verify`
- Add a temporary hex color locally, confirm lint fails, then remove it

## Out of scope

No visual redesign.

## Open questions

None
