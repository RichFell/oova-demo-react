---
id: OOVA-008
title: Build the Today screen
type: story
epic: EPIC-02
size: M
executor: claude
depends_on: [OOVA-004, OOVA-005, OOVA-006, OOVA-007]
touches: [src/app/(tabs)/**, src/features/today/**, src/features/StartScanTile.tsx, src/hooks/**]
claimed_by: Rich Fellure
blocked_reason:
---

## Context

Today should show one clear next step. Replace the placeholder and complete `useTodayViewModel`.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/design/concept/1-today.png`
- `docs/design/oova-reference/oova-144927.png`

## Acceptance criteria

- [ ] Hero shows the date, cycle day, plan day, today's strips, and usual time from state.
- [ ] The primary button opens scan setup on Manual.
- [ ] Next five days shows both strip tokens for each day.
- [ ] Chart lock shows remaining scans from state.
- [ ] The bottom action stays above the tab bar on small iPhones.
- [ ] Copy matches `docs/copy.md`.

## Verification

- `npm run verify`
- `npm run screenshots`, then compare Today with the concept

## Out of scope

No symptom logging flow.

## Open questions

None
