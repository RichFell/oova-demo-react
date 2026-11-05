---
id: OOVA-026
title: Read and change demo state through services
type: story
epic: EPIC-01
size: M
executor: claude
depends_on: [OOVA-025, OOVA-023]
touches: [src/state/**, src/services/**, src/hooks/**, src/app/_layout.tsx, CLAUDE.md]
claimed_by: Rich Fellure
---

## Context

OOVA-025 adds a mock backend and services for demo state. The view models still read `useDemoState()`, and `usePlanAnswersViewModel` imports `src/data/sample.ts`. Per `docs/decisions/0005-mock-services.md`, view models should read through `useQuery` and change state through service writes, and `DemoStateProvider` goes away.

## Sources of truth

- `docs/facts.md`
- `docs/decisions/0004-tests-and-routing.md`
- `docs/decisions/0005-mock-services.md`

## Acceptance criteria

- [ ] `src/app/_layout.tsx` wraps the app in `ServicesProvider` instead of `DemoStateProvider`, and keeps the splash screen up until the fonts load and each service has prefetched its route into its own cache.
- [ ] `useTodayViewModel`, `usePlanViewModel`, `useScanSetupViewModel`, and `usePlanAnswersViewModel` read through `useQuery` with each service's own cache, and return the same values as before for the sample data. The current plan day and current cycle day come from pure helpers that take the plan and the scan count, with tests.
- [ ] Changing the last period start or typical bleed days in `usePlanAnswersViewModel` calls `PlanService.updatePlan`, and the plan timeline updates from the response without another request.
- [ ] `QueryCache.prefetch(key, load)` returns a promise that settles when the key's data is stored, shares a request already running for the key, and has tests. A view model whose query has no data yet tells its screen to render nothing.
- [ ] `DemoStateProvider` is deleted, the reducer and selectors move from `src/state/demoState.ts` into `src/services/mock/`, and `src/state` is removed if empty.
- [ ] No file outside `src/services/mock/` and `src/data/__tests__/` imports `src/data/sample.ts`, and the app's `CLAUDE.md` lists `src/services` under Structure with that rule.
- [ ] View-model tests pass a fake transport to `ServicesProvider` and cover the loaded values and the plan write updating the timeline.
- [ ] Today and scan setup look the same as before in screenshots.

## Verification

- `npm run verify`
- `npm run screenshots -- index scan`

## Out of scope

No loading or error UI. No failure mode. No new routes, screens, or copy. No change to the backend's responses.

## Open questions

None
