import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/persist";

import { ROSTER } from "./roster";
import type { SwipeDirection } from "./types";

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

type DeckState = {
  /** Fighter ids in the order they're dealt. */
  order: string[];
  /** Index into `order` of the card currently on top. */
  position: number;
  swipes: Record<string, SwipeDirection>;
  /** Only a pass (left swipe) can be rewound. */
  lastSwipe: { id: string; direction: SwipeDirection } | null;
  recordSwipe: (id: string, direction: SwipeDirection) => void;
  rewind: () => void;
  /** Deal a fresh shuffled deck from the given fighter ids. */
  redeal: (ids: string[]) => void;
  reset: () => void;
};

const freshDeck = () => ({
  order: shuffle(ROSTER.map((f) => f.id)),
  position: 0,
  swipes: {},
  lastSwipe: null,
});

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      ...freshDeck(),
      recordSwipe: (id, direction) =>
        set((s) => ({
          position: s.position + 1,
          swipes: { ...s.swipes, [id]: direction },
          lastSwipe: { id, direction },
        })),
      rewind: () => {
        const { lastSwipe, position, swipes } = get();
        if (!lastSwipe || lastSwipe.direction !== "left" || position === 0) return;
        const rest = { ...swipes };
        delete rest[lastSwipe.id];
        set({ position: position - 1, swipes: rest, lastSwipe: null });
      },
      redeal: (ids) => set({ order: shuffle(ids), position: 0, swipes: {}, lastSwipe: null }),
      reset: () => set(freshDeck()),
    }),
    { name: "fumblefists-deck", storage: deviceStorage, version: 1 },
  ),
);
