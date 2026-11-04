# CLAUDE.md

Expo SDK 58 app for an unofficial Oova concept demo. Tickets and docs live in the private `oova-demo` workspace repo.

## Commands

- `npm run verify`: typecheck, lint, and tests. Must pass before any PR.
- `npm run typecheck`: `tsc --noEmit`
- `npm run lint`: `expo lint` with `eslint-config-expo` (see `eslint.config.js`)
- `npm test`: Jest with the `jest-expo` preset (configured in `package.json`)
- `npx expo install --check`: confirms dependency versions match SDK 58
- Add dependencies only with `npx expo install` (use `--dev` for dev dependencies).

Don't skip, weaken, or delete tests, and don't change the `verify` script without a ticket.

## Structure

- `src/app`: Expo Router screens
- `src/features`: feature components
- `src/hooks`: view-model and navigation hooks
- `src/theme/tokens.ts`: design tokens. Don't add colors, spacing, or type styles without a ticket.
- `src/data/plan.ts`: scan plan builder. Supports only the 30-day plan.
- `src/data/sample.ts`: fictional profile, chart, and unlock data
- Tests live in `__tests__/` folders beside the code they cover.
- `useAppRouter` should be used to wrap Expo Router logic to allow easy injection of different views dependent on settings.

## Sample-data rules

- All health data is fictional and visibly labeled as sample data. Screens stay labeled as an unofficial concept.
- No backend, accounts, analytics, real camera or scan flow, real user data, or medical logic.
- Don't invent product behavior, hormone logic, or medical claims. Facts come from the workspace's `docs/facts.md`.
- Product and health wording comes only from the workspace's `docs/copy.md`, used exactly.

## APIs

Never rely on memory for a library API or version. Check the installed package's types or source in `node_modules`, or the official docs, before using it.
