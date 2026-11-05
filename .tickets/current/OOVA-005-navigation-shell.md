---
id: OOVA-005
title: Add tabs and the concept badge
type: task
epic: EPIC-01
size: S
executor: claude
depends_on: [OOVA-004]
touches: [src/app/**, src/components/**, src/features/**, src/hooks/**]
claimed_by: Rich Fellure
blocked_reason:
pr: https://github.com/RichFell/oova-demo-react/pull/5
---

## Context

The app uses `expo-router/unstable-native-tabs`. Change to `expo-router/native-tabs`.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`
- `docs/design/concept/1-today.png`

## Acceptance criteria

- [ ] Tabs show Today, Journal, Calendar, Insights, and More.
- [ ] Journal, Calendar, Insights, and More are simple placeholders.
- [ ] `useAppRouter` handles all custom navigation.
- [ ] A concept badge appears on every screen with the exact approved label.

## Verification

- `npm run verify`

## Out of scope

No real Journal, Calendar, Insights, or More features.

## Open questions

None
