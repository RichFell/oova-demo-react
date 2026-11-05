---
id: OOVA-023
title: Add a back chevron to the Plan screen toolbar
type: story
epic: EPIC-02
size: S
executor: claude
depends_on: [OOVA-011]
touches: [src/features/plan/**, src/hooks/**, src/components/**]
copy: [Global/Back label]
claimed_by: Rich Fellure
pr: https://github.com/RichFell/oova-demo-react/pull/12
---

## Context

Scan setup (`PlanScreen`, at `/scan`) is pushed on the root stack with the stack header hidden, so there is no way back except a system gesture. A toolbar row at the top of the screen adds a back control that shows only a chevron icon, with no text label.

Per `docs/decisions/0004-tests-and-routing.md`, the screen navigates only through `useAppRouter`, so going back needs a new named intent.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/design/concept/2-plan.png`
- `docs/decisions/0004-tests-and-routing.md`

## Acceptance criteria

- [ ] A toolbar row sits above the step progress on `PlanScreen` in both Guided and Manual modes.
- [ ] The toolbar shows a back chevron icon at its leading edge, with no visible text.
- [ ] Pressing the chevron returns to the previous screen.
- [ ] When there is no previous screen, pressing the chevron opens the Today tab.
- [ ] `useAppRouter` exposes a `navigateBack()` intent, and `PlanScreen` doesn't import `expo-router`.
- [ ] The chevron has a button role, the approved back label, and a touch target of at least 44 pt.
- [ ] Tests cover the press calling `navigateBack()`.

## Verification

- `npm run verify`
- `npm run screenshots`

## Out of scope

No back control on other screens. No change to the step progress, title, or mode toggle. No re-enabling the stack header.

## Open questions

None
