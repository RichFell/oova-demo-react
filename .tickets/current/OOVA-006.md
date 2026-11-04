---
id: OOVA-006
title: Add demo state
type: task
epic: EPIC-01
size: M
executor: claude
depends_on: [OOVA-001]
touches: [src/data/**, src/state/**, src/app/_layout.tsx]
claimed_by: Rich Fellure
---

## Context

Screens must read one source of truth so plan, scans, chart, and report stay consistent.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/screen-spec.md`

## Acceptance criteria

- [ ] Add a React state provider with the sample profile, plan, completed scans, usual scan time, and reset action.
- [ ] Changing the last period date or typical bleeding days updates period markers without changing plan dates, and the state exposes the current cycle day.
- [ ] Completing a scan advances by one sample day and stops at the available sample data.
- [ ] Selectors return chart and report unlock progress using `unlockRules`.
- [ ] No new dependency and no persistence.
- [ ] Tests cover the actions and selectors.

## Verification

- `npm run verify`

## Out of scope

No UI.

## Open questions

None
