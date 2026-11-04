---
id: OOVA-004
title: Build shared UI primitives
type: task
epic: EPIC-01
size: M
executor: claude
depends_on: [OOVA-002, OOVA-003]
touches: [src/components/**, src/theme/**, src/features/StartScanTile.tsx]
claimed_by: Rich Fellure
---

## Context

Screens need one small component set so they stay visually consistent.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/design/concept/1-today.png`
- `docs/design/concept/2-plan.png`

## Acceptance criteria

- [ ] Add `Screen`, `Card`, `Button`, `SectionLabel`, `Pill`, and `StripToken`.
- [ ] `Button` supports primary, secondary, gradient, and disabled states.
- [ ] `StripToken` supports E3G and LH | PdG.
- [ ] Interactive components have accessibility roles and labels.
- [ ] Tests cover Button disabled behavior.

## Verification

- `npm run verify`

## Out of scope

No screens beyond replacing the existing tile internals.

## Open questions

None
