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
- [ ] The backend serves every route in the decision's table, with the responses it lists, using the reducer and selectors from `src/state/demoState.ts`.
- [ ] `PATCH /profile` changes only the fields it is sent, and the next `GET /plan` reflects the change.
- [ ] `POST /scans` completes the next scan, and the next `GET /scans` and `GET /progress` reflect it.
- [ ] `POST /reset` returns every route to its starting response, and each `createMockBackend()` call starts from the sample data on its own.
- [ ] `ProfileService`, `PlanService`, and `ScanService` take a `Transport` and expose typed reads and writes for those routes. Each write invalidates the routes it affects: a profile change invalidates `/profile` and `/plan`, a completed scan invalidates `/scans`, `/plan`, and `/progress`, and a reset invalidates every route.
- [ ] `ServicesProvider` builds the mock backend and the three services by default, and `useServices()` returns the services.
- [ ] Tests cover each route's response, each write's effect on later reads, the reset, and each write's invalidated routes.

## Verification

- `npm run verify`

## Out of scope

No changes to `DemoStateProvider`, view-model hooks, screens, or `src/app/_layout.tsx`. Don't move or change `src/state/demoState.ts`. No failure mode or new demo behavior.

## Open questions

None
