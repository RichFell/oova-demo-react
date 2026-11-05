---
id: OOVA-011
title: Add the Guided and Manual toggle
type: story
epic: EPIC-03
size: S
executor: claude
depends_on: [OOVA-005, OOVA-006, OOVA-009]
touches: [src/app/**, src/features/plan/**, src/features/scan/**, src/hooks/**]
claimed_by: Rich Fellure
---

## Context

The scan setup screen offers two modes. Guided shows the plan. Manual holds the sample step, which replaces the old prep step in the guided test.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/design/concept/2-plan.png`
- `docs/design/concept/2-plan-manual.png`

## Acceptance criteria

- [ ] A Guided and Manual toggle sits below the header, with Guided selected by default.
- [ ] Guided shows the existing plan content below the toggle.
- [ ] Manual shows today's strips from the current plan day, same-time guidance, and the sample button below the toggle.
- [ ] The header title and step progress change with the mode.
- [ ] The sample button opens the timer.
- [ ] Screens that link to scan setup can open it on Manual.

## Verification

- `npm run verify`
- `npm run screenshots`

## Out of scope

No timer logic. No saved mode preference.

## Open questions

None
