---
id: OOVA-010
title: Add the plan answers card
type: story
epic: EPIC-02
size: S
executor: claude
depends_on: [OOVA-009]
touches: [src/features/plan/**, src/hooks/**]
claimed_by: Rich Fellure
---

## Context

Users should see what shaped the plan.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/design/concept/2-plan.png`
- `docs/design/concept/2-plan-edit.png`

## Acceptance criteria

- [ ] Answers card shows health journey, regular cycles, last period, and typical bleeding.
- [ ] Edit appears as a small secondary button and changes to Done while editing.
- [ ] While editing, Last period started can move back up to 14 days and can't be later than today.
- [ ] Changing the last period date updates period markers and the cycle day on Today, but not the plan dates or strip counts.
- [ ] Typical bleeding can change from 1 to 10 days and updates period markers only.
- [ ] Strips needed shows 30 LH | PdG and 30 E3G strips from the plan.

## Verification

- `npm run verify`

## Out of scope

Editing other answers. No saved changes after the app restarts.

## Open questions

None
