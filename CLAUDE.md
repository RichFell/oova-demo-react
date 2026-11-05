# CLAUDE.md

Expo SDK 58 app for an unofficial Oova concept demo. Tickets and docs live in the private `oova-demo` workspace repo.

## Commands

- `npm run verify`: typecheck, lint, and tests. Must pass before any PR.
- `npm run typecheck`: `tsc --noEmit`
- `npm run lint`: `expo lint` with `eslint-config-expo` (see `eslint.config.js`)
- `npm test`: Jest with the `jest-expo` preset (configured in `package.json`)
- `npx expo install --check`: confirms dependency versions match SDK 58
- `npm run screenshots [-- <route>...]`: captures Expo web routes at 390 × 844 (1× scale) into `$OOVA_RUN_DIR`, or `.screenshots/` when unset
- Add dependencies only with `npx expo install` (use `--dev` for dev dependencies).

Don't skip, weaken, or delete tests, and don't change the `verify` script without a ticket.

## Screenshots

- UI tickets: capture only the routes you changed, for example `npm run screenshots -- journal more`. Run it once, before finishing, then open and inspect those images.
- To capture a state inside a route, pass its query params, like `npm run screenshots -- 'scan?mode=manual'`. The screen must read that state from its route params. Never edit code temporarily to reach a state.
- `OOVA_RUN_DIR` is already set in runner sessions, so don't prefix the command with it.
- Review step: don't capture or open screenshots.

## Structure

- `src/app`: Expo Router screens
- `src/features`: feature components
- `src/hooks`: view-model and navigation hooks
- `src/theme/tokens.ts`: design tokens. Don't add colors, spacing, or type styles without a ticket.
- `src/data/plan.ts`: scan plan builder. Supports only the 30-day plan.
- `src/data/sample.ts`: fictional profile, chart, and unlock data
- Tests live in `__tests__/` folders beside the code they cover.

## Testing

- Test behavior: logic, view-model hooks, and components with state or interaction.
- Don't write tests for types or interfaces. `npm run typecheck` covers them.
- Don't write tests for presentational components that only map props or tokens to styles, such as `AppText`.

## Routing

- `useAppRouter` in `src/hooks/useAppRouter.ts` wraps Expo Router, so different views can be injected later depending on settings, tests, or previews.
- Navigate only through it. Don't call `useRouter`, `router`, or `<Link>` from `expo-router` in screens or features.
- Add each destination as a named intent on the hook, like `navigateToScan()`, and pass it down as a callback such as `onPress`. Features never import the router.
- A screen that has states worth capturing, like a mode, reads its initial state from route params so `npm run screenshots -- 'scan?mode=manual'` can reach it.

## Sample-data rules

- All health data is fictional and visibly labeled as sample data. Screens stay labeled as an unofficial concept.
- No backend, accounts, analytics, real camera or scan flow, real user data, or medical logic.
- Don't invent product behavior, hormone logic, or medical claims. Facts come from the workspace's `docs/facts.md`.
- Product and health wording comes only from the workspace's `docs/copy.md`, used exactly.

## APIs

Never rely on memory for a library API or version. Check the installed package's types or source in `node_modules`, or the official docs, before using it.
