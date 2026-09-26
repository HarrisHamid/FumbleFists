# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FumbleFists — a Tinder-style mobile app where students who failed an exam match for a consensual sparring bout. Native iOS + Android via **Expo SDK 57** (React Native 0.86, React 19, TypeScript strict). Backend is planned on **Supabase** (Postgres + RLS, Auth, Realtime, Storage, Edge Functions) — not yet added.

`legacy-web/` is the original Lovable web prototype (TanStack Start). It is reference only — do not build, lint, or import from it. Delete it once its design/copy has been ported.

## Expo has changed — do not trust training data

Expo ships breaking changes every SDK. Before touching an Expo, EAS, or React Native API, check the installed version's docs (`https://docs.expo.dev/versions/v57.0.0/`, index at `https://docs.expo.dev/llms.txt`) or the package's `.d.ts` files in `node_modules`.

## Commands

Bun is the package manager (`bun.lock`). Use `bunx` rather than `npx`.

```bash
bun install
bun run start               # expo start (scan QR with Expo Go, or i / a for simulator)
bun run typecheck           # tsc --noEmit
bun run lint                # expo lint
bunx expo-doctor            # dependency/config diagnostics
bunx expo install <pkg>     # ALWAYS use to add Expo/RN deps — picks SDK-compatible versions
bunx expo export --platform ios --platform android   # full bundle check without a device
```

Run typecheck + lint before calling anything done. There are no tests yet (planned: Jest + RNTL, Maestro E2E, pgTAP for RLS).

## Architecture

- **Routing**: Expo Router, file-based in `src/app/`. `_layout.tsx` is the root (fonts, splash, QueryClient, nav theme, Stack). `(tabs)/_layout.tsx` uses `NativeTabs` from `expo-router/unstable-native-tabs` (real UITabBar / Material tabs; icons via `sf` + `md` props). Keep non-route code out of `src/app/`.
- **Feature code** goes in `src/features/<feature>/` (components, hooks, query functions); shared UI in `src/components/`; clients/singletons in `src/lib/`.
- **Styling**: NativeWind v5 (release candidate) + Tailwind v4. Brand tokens live in the `@theme` block of `src/global.css` and are mirrored in `src/theme/tokens.ts` for APIs that need raw values (tab bar, nav theme, Reanimated) — change both together. Colors: `ink`, `paper`, `cream`, `flame`, `match`, `blood`, `card`, `card-raised`, `muted`. Fonts: `font-anton`, `font-display` (Bebas Neue), `font-body` (Archivo), `font-mono` (JetBrains Mono); family names are the keys passed to `useFonts()` in the root layout. `metro.config.js` sets `inlineRem: 16` so sizes match the web prototype.
  - `nativewind@5.0.0-rc.0` and `react-native-css@3.1.0-rc.0` are pinned exactly as a pair, with `lightningcss` pinned via `overrides`. Upgrade them together.
  - `className` works on RN core components. For third-party components (expo-image, SafeAreaView, Reanimated) use `style`.
- **Motion**: Reanimated 4. Brand entrances (`rise`, `stampIn`, `matchPop`, spring easing) are CSS-style keyframes in `src/theme/motion.ts`, applied via `style` on `Animated.View`. Gestures (swipe deck) will use react-native-gesture-handler + Reanimated worklets.
- **Server state**: TanStack Query (`src/lib/query-client.ts`).
- **The app is dark-only** (`userInterfaceStyle: "dark"`).

## Native projects & builds

- `ios/` and `android/` are generated (Continuous Native Generation) and gitignored. Never edit them; configure via `app.json` and config plugins.
- Expo Go works for the current dependency set. Once a native module outside Expo Go is added (e.g. Apple sign-in, MMKV), a development build is needed: add `expo-dev-client` and a `development` profile to `eas.json`, then `bunx eas-cli build --profile development` or `bunx expo run:ios`.
- `bundleIdentifier` / `package` are `com.fumblefists.app` — confirm before the first store build; they can't change after publishing.

## Roadmap & constraints

The phased plan (backend schema, deck, chat, bouts/records, launch hardening) is in `docs/architecture.md`. Safety features (18+ gate, waiver, report/block, in-app account deletion, Sign in with Apple) are App Store requirements, not nice-to-haves.

## Git / Lovable

`main` is still connected to Lovable and syncs pushes into its editor. Work happens on feature branches (currently `expo-migration`). Don't merge the Expo app into `main` until the repo is disconnected from Lovable. Never rewrite pushed history.
