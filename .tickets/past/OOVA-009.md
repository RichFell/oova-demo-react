---
id: OOVA-009
title: Build the plan timeline
type: story
epic: EPIC-02
size: M
executor: claude
depends_on: [OOVA-004, OOVA-006, OOVA-007]
touches: [src/app/**, src/features/plan/**, src/hooks/**]
claimed_by: Rich Fellure
---

## Context

Show the schedule before explanatory text. Plan data must come from state.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/design/concept/2-plan.png`
- `docs/design/oova-reference/oova-144859.png`

## Acceptance criteria

- [ ] Header shows plan length and dates.
- [ ] Horizontal timeline shows every plan day with both strip tokens.
- [ ] Selecting a day updates the details card.
- [ ] Expected period days have a pink marker and legend.
- [ ] Selected day has an accessible selected state.

## Verification

- `npm run verify`
- `npm run screenshots`, then compare with the concept

## Out of scope

No editing of answers.

## Open questions

None
