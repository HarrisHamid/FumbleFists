# FumbleFists — Architecture & Roadmap

## What it is

A just-for-fun, **single-player** Tinder parody for your own phone. You build a fighter card (name, major, GPA, the exam that broke you, a rage bio) and swipe a deck of **fictional** fighters. Some of them swipe back. Matches open a trash-talk chat with a canned-personality bot. You book a bout, settle it in the ring, and the result goes on your W-L record.

There's no backend, no accounts, no App Store release and no real users. Everything lives on the device.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript (strict) | |
| App | **Expo SDK 57** + React Native 0.86 | Run it on your phone through **Expo Go**, with no Xcode or store needed. |
| Navigation | Expo Router (`src/app/`), NativeTabs | File-based routes, real native tab bar. |
| Styling | NativeWind v5 + Tailwind v4 | Brand tokens ported from the prototype. |
| Motion | Reanimated 4 + Gesture Handler, `expo-haptics` | Native-feeling swipe deck and animations. |
| State + persistence | **Zustand** + `persist` over **AsyncStorage** | Small typed stores that survive app restarts. Both work in Expo Go. |
| Images | `expo-image`, `expo-image-picker` | Your own card photo, picked from the camera roll and stored locally. |

Dropped because they aren't needed here: Supabase/any backend, auth, TanStack Query, EAS store builds, analytics/crash reporting, moderation/legal flows.

## Layout

```
src/
  app/
    _layout.tsx              # fonts, splash, nav theme, root Stack
    (tabs)/_layout.tsx       # NativeTabs: Spar, Matches, Bouts, Me
    (tabs)/index.tsx         # Spar: swipe deck
    (tabs)/matches.tsx       # matches list
    (tabs)/bouts.tsx         # booked bouts, record, ledger
    (tabs)/me.tsx            # your fighter card (create/edit)
    chat/[fighterId].tsx     # trash-talk chat with a matched fighter
    bout/[id].tsx            # the fight itself + result
  components/                # shared brand UI: Screen, BrandHeader, Stamp, StatTile…
  features/
    deck/                    # Fighter type, roster, FighterCard, SwipeDeck
    profile/                 # your card store + form
    matches/                 # match store, swipe-back odds
    chat/                    # personality lines, reply generator
    bouts/                   # bout store, fight resolution, record/streak selectors
  theme/                     # tokens.ts, motion.ts
  global.css                 # Tailwind + NativeWind theme
```

## Data (all local)

One Zustand store per feature, each persisted under its own AsyncStorage key:

- **profile**: your `Fighter`-shaped card (+ optional local photo URI).
- **deck**: the roster order and a cursor, plus a `swipes` map `fighterId → "left" | "right"`.
- **matches**: `{ fighterId, matchedAt }[]`. A right swipe becomes a match based on a per-fighter "swipe-back" chance (picky fighters are rarer).
- **chat**: `fighterId → Message[]`. Bot replies are picked from that fighter's personality lines (e.g. Kofi uses thermo puns, Mara brags about being undefeated).
- **bouts**: `{ id, fighterId, scheduledFor, status: "booked" | "won" | "lost" | "draw" }[]`. Your record, streak and "last fail" are **derived** from this, never hand-entered (the prototype's `9-4` was fake).

A single "Reset everything" in Me clears every store.

## Roadmap

**Phase 0: Scaffold** ✅. Expo app, theme, fonts, tab shell, static `FighterCard`.

**Phase 1: Your fighter card** ✅. Zustand + AsyncStorage setup. A Me screen with a card form (port `legacy-web/src/routes/profile.tsx`), optional photo from the camera roll, and a live preview using `FighterCard`.

**Phase 2: Swipe deck** ✅. Expand the fictional roster (10–15 fighters with bios and personalities). Port the prototype's swipe interaction (`legacy-web/src/routes/spar.tsx`: drag rotation, SPAR/NOPE stamps, fling, next-card peek, NO / SPAR / REPLAY buttons) to Gesture Handler + Reanimated with haptics. Swipe-back odds and a "MATCH CONFIRMED" pop modal.

**Phase 3: Matches + trash-talk chat.** Matches list, and a chat screen with a typing delay and personality-driven replies.

**Phase 4: Bouts + record.** Book a bout from chat, then a small fight screen that settles it (simple odds from both records/GPAs, or a quick tap mini-game). Results feed a derived record/streak and the Fight Ledger (replaces the prototype's `/history`).

**Phase 5: Polish (optional).** Fighter art for the roster (the prototype's photos were 1×1 placeholders), sound effects, a custom app icon/splash, and more fighters.

## Running it

`bun run start` → scan the QR code with **Expo Go** on your phone. If you ever want a standalone install without Expo Go, a local `bunx expo run:ios` (needs Xcode) or an EAS internal build can come later.

## Verification per phase

- `bun run typecheck`, `bun run lint`, `bunx expo-doctor` stay green.
- `bunx expo export --platform ios --platform android` bundles cleanly.
- Click through the flow in the web preview (`bun run web`) and on the phone via Expo Go. Data survives an app restart.
