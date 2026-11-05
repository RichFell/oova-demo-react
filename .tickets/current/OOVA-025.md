---
id: OOVA-025
title: Add the mock backend and demo-state services
type: story
epic: EPIC-01
size: M
executor: claude
depends_on: [OOVA-024]
touches: [src/services/**]
claimed_by: Rich Fellure
---

## Context

OOVA-024 adds a transport that takes a route table. Per `docs/decisions/0005-mock-services.md`, a mock backend owns the demo state and serves it on the routes listed there. The reducer and selectors in `src/state/demoState.ts` already hold that logic. This ticket builds the backend and services on top of them. OOVA-026 moves the app over and removes `DemoStateProvider`.

## Sources of truth

- `docs/facts.md`
- `docs/decisions/0003-sample-data-only.md`
- `docs/decisions/0005-mock-services.md`

## Acceptance criteria

- [ ] `src/services/mock/` exports a `createMockBackend()` that holds its own in-memory demo state, starting from the sample data, and returns a route table for `MockTransport`.
- [ ] The backend serves every route in the decision's table, with the responses it lists, using the reducer and selectors from `src/state/demoState.ts`. No response repeats data that another route owns.
- [ ] `PATCH /plan` changes only the fields it is sent, returns the updated plan, and leaves `GET /profile` unchanged.
- [ ] `POST /scans` completes the next scan and returns the updated scans and unlock progress, and the next `GET /scans` matches.
- [ ] `POST /reset` returns every route to its starting response, and each `createMockBackend()` call starts from the sample data on its own.
- [ ] `ProfileService`, `PlanService`, and `ScanService` take a `Transport`, expose typed reads and writes for their own route, and each own a separate `QueryCache`. Each write sets its own route in its own cache from the response and touches no other cache. Each service's `refresh()` invalidates only its own cache.
- [ ] `DemoService.reset()` calls `POST /reset`, and `resetDemo(services)` resets the backend, then refreshes each service. `ServicesProvider` builds the mock backend and all four services by default, and `useServices()` returns them.
- [ ] Tests cover each route's response, each write's effect on later reads and on its own cache only, `refresh()`, and `resetDemo`.

## Verification

- `npm run verify`

## Out of scope

No changes to `DemoStateProvider`, view-model hooks, screens, or `src/app/_layout.tsx`. Don't move or change `src/state/demoState.ts`. No failure mode or new demo behavior.

## Open questions

None
