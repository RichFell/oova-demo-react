---
id: OOVA-003
title: Add Outfit and text styles
type: task
epic: EPIC-01
size: S
executor: claude
depends_on: [OOVA-001]
touches: [package.json, package-lock.json, src/app/_layout.tsx, src/components/**, src/theme/**]
claimed_by: Rich Fellure
pr: https://github.com/RichFell/oova-demo-react/pull/3
---

## Context

Outfit is the stand-in font for Oova's rounded type. The real font is unknown.

## Sources of truth

- `docs/facts.md`
- `docs/copy.md`
- `docs/design/README.md`

## Acceptance criteria

- [ ] Outfit 400, 500, and 600 load before the app renders.
- [ ] An `AppText` component offers title, heading, body, label, and button variants from tokens.
- [ ] Dynamic Type stays enabled.

## Verification

- `npm run verify`

## Out of scope

No screen layout work.

## Open questions

None
