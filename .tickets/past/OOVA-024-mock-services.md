---
id: OOVA-024
title: Add the mock transport and client cache
type: story
epic: EPIC-01
size: M
executor: claude
depends_on: []
touches: [src/services/**]
claimed_by: Rich Fellure
pr: https://github.com/RichFell/oova-demo-react/pull/13
---

## Context

Demo state lives in `DemoStateProvider`, and view models read it directly. Per `docs/decisions/0005-mock-services.md`, the app should reach demo state only through requests to a mock backend. This ticket adds the transport, the client cache, and the wiring, with no routes yet. OOVA-025 adds the mock backend and services, and OOVA-026 moves the app over.

## Sources of truth

- `docs/facts.md`
- `docs/decisions/0003-sample-data-only.md`
- `docs/decisions/0004-tests-and-routing.md`
- `docs/decisions/0005-mock-services.md`

## Acceptance criteria

- [ ] `src/services/transport` exports a `Transport` interface with `request<T>({ method, route, body? })` for `GET`, `POST`, and `PATCH`, and a `MockTransport` that takes a route table and resolves each request with its handler after a fixed 300 ms delay.
- [ ] A request whose method and route aren't in the table rejects with an error that names both.
- [ ] While a `GET` is running, a matching `GET` for the same route gets the same promise, and the handler runs once. After it settles, either way, the next `GET` starts a new request.
- [ ] `POST` and `PATCH` requests are never deduplicated.
- [ ] `useQuery(key, load)` returns `{ data, isLoading, error }` from a shared cache, so two components with the same key share one request and one result.
- [ ] `invalidate(keys)` makes mounted queries with those keys fetch again.
- [ ] `ServicesProvider` builds the transport and cache once, or uses ones passed in, and `useServices()` returns them. Calling `useServices()` outside the provider throws.
- [ ] Tests use fake timers and a test route table, and cover the delay, the unknown route, `GET` deduplication and clearing, writes not deduplicated, shared queries, and invalidation.

## Verification

- `npm run verify`

## Out of scope

No mock backend routes, sample data, or services. No changes to `DemoStateProvider`, view-model hooks, screens, or `src/app/_layout.tsx`. No failure mode or data-fetching library. No real network requests.

## Open questions

None
