# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FumbleFists — a just-for-fun, **single-player** Tinder parody: build a fighter card, swipe a deck of fictional fighters who may swipe back, trash-talk in chat, book bouts, keep a W-L record. Runs on the owner's phone via Expo Go on **Expo SDK 57** (React Native 0.86, React 19, TypeScript strict).

There is **no backend, no accounts, and no App Store release** — all data is local (Zustand + AsyncStorage, planned). Don't add servers, auth, analytics, or store/compliance tooling unless asked.

`legacy-web/` is the original web prototype (TanStack Start, exported from Lovable — not connected). It is reference only — do not build, lint, or import from it. Delete it once its design/copy has been ported.

## Expo has changed — do not trust training data

Expo ships breaking changes every SDK. Before touching an Expo, EAS, or React Native API, check the installed version's docs (`https://docs.expo.dev/versions/v57.0.0/`, index at `https://docs.expo.dev/llms.txt`) or the package's `.d.ts` files in `node_modules`.

## Commands

Bun is the package manager (`bun.lock`). Use `bunx` rather than `npx`.

```bash
bun install
bun run start               # expo start (scan QR with Expo Go, or i / a for simulator)
bun run start:tunnel        # same, via an Expo tunnel — needed when phone and Mac aren't on one LAN
bun run typecheck           # tsc --noEmit
bun run lint                # expo lint
bunx expo-doctor            # dependency/config diagnostics
bunx expo install <pkg>     # ALWAYS use to add Expo/RN deps — picks SDK-compatible versions
bunx expo export --platform ios --platform android   # full bundle check without a device
```

Run typecheck + lint before calling anything done. There is no test framework; for UI changes also click through `bun run web` (react-native-web) since there's no simulator on this machine.

## Architecture

- **Routing**: Expo Router, file-based in `src/app/`. `_layout.tsx` is the root (fonts, splash, nav theme, Stack). `(tabs)/_layout.tsx` uses `NativeTabs` from `expo-router/unstable-native-tabs` (real UITabBar / Material tabs; icons via `sf` + `md` props). Keep non-route code out of `src/app/`.
- **Feature code** goes in `src/features/<feature>/` (components, stores, logic); shared UI in `src/components/`; small shared utilities in `src/lib/`.
- **Styling**: NativeWind v5 (release candidate) + Tailwind v4. Brand tokens live in the `@theme` block of `src/global.css` and are mirrored in `src/theme/tokens.ts` for APIs that need raw values (tab bar, nav theme, Reanimated) — change both together. Colors: `ink`, `paper`, `cream`, `flame`, `match`, `blood`, `card`, `card-raised`, `muted`. Fonts: `font-anton`, `font-display` (Bebas Neue), `font-body` (Archivo), `font-mono` (JetBrains Mono); family names are the keys passed to `useFonts()` in the root layout. `metro.config.js` sets `inlineRem: 16` so sizes match the web prototype.
  - `nativewind@5.0.0-rc.0` and `react-native-css@3.1.0-rc.0` are pinned exactly as a pair, with `lightningcss` pinned via `overrides`. Upgrade them together.
  - `className` works on RN core components. For third-party components (expo-image, SafeAreaView, Reanimated) use `style`.
- **Motion**: Reanimated 4. Brand entrances (`rise`, `stampIn`, `matchPop`, spring easing) are CSS-style keyframes in `src/theme/motion.ts`, applied via `style` on `Animated.View`. Gestures (swipe deck) will use react-native-gesture-handler + Reanimated worklets.
- **State**: Zustand stores per feature, persisted to AsyncStorage (added in Phase 1). Records/streaks are derived from bout results, never stored as literals.
- **The app is dark-only** (`userInterfaceStyle: "dark"`).

## Native projects

- `ios/` and `android/` are generated (Continuous Native Generation) and gitignored. Never edit them; configure via `app.json` and config plugins.
- Keep dependencies Expo Go–compatible (install with `bunx expo install`). A library needing a custom dev build would break the zero-setup Expo Go workflow — flag it before adding one.

## Roadmap

Phased plan and local data model are in `docs/architecture.md`.

## Git

`main` is the default branch. Work on one branch per roadmap phase (e.g. `phase-1-fighter-card`), commit and push in small verified batches as you go, and fast-forward `main` when the phase is done. Never rewrite pushed history.
