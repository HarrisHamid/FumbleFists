import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/persist";

export type Match = { fighterId: string; matchedAt: number };

type MatchesState = {
  /** Newest first. */
  matches: Match[];
  addMatch: (fighterId: string) => void;
  reset: () => void;
};

export const useMatchesStore = create<MatchesState>()(
  persist(
    (set) => ({
      matches: [],
      addMatch: (fighterId) =>
        set((s) =>
          s.matches.some((m) => m.fighterId === fighterId)
            ? s
            : { matches: [{ fighterId, matchedAt: Date.now() }, ...s.matches] },
        ),
      reset: () => set({ matches: [] }),
    }),
    { name: "fumblefists-matches", storage: deviceStorage, version: 1 },
  ),
);
