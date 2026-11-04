# oova-demo-react

Expo SDK 58 app for an unofficial Oova concept demo. All data is sample data.

## Run

```sh
npm install
npx expo install --check
npm run verify
npm start
```

Press `i` for the iOS Simulator. The project uses a development build workflow unless Expo Go support for SDK 58 is confirmed.

## Commands

- `npm run typecheck`: TypeScript check
- `npm run lint`: ESLint with Expo's config (`eslint-config-expo`)
- `npm test`: Jest with the `jest-expo` preset
- `npm run verify`: typecheck, lint, and tests. Fails if any step fails.

## Structure

- `src/app`: Expo Router screens
- `src/features`: feature components
- `src/hooks`: view-model and navigation hooks
- `src/theme/tokens.ts`: design tokens
- `src/data/plan.ts`: 30-day scan plan builder
- `src/data/sample.ts`: fictional profile, chart, and unlock data

Tickets, project notes, and the concept board live in the private `oova-demo` workspace repo.
