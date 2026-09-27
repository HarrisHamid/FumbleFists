import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/persist";

export type BoutResult = "won" | "lost" | "draw";

export type Bout = {
  id: string;
  fighterId: string;
  /** Display label, e.g. "FRIDAY · 7PM". */
  when: string;
  where: string;
  bookedAt: number;
  status: "booked" | BoutResult;
  foughtAt?: number;
  /** How it ended, e.g. "KO · ROUND 2" or "DECISION". */
  method?: string;
};

type BoutsState = {
  /** Newest first. */
  bouts: Bout[];
  book: (bout: Pick<Bout, "fighterId" | "when" | "where">) => Bout;
  settle: (id: string, result: BoutResult, method: string) => void;
  cancel: (id: string) => void;
  reset: () => void;
};

export const useBoutsStore = create<BoutsState>()(
  persist(
    (set) => ({
      bouts: [],
      book: ({ fighterId, when, where }) => {
        const bout: Bout = {
          id: `${Date.now().toString(36)}-${fighterId}`,
          fighterId,
          when,
          where,
          bookedAt: Date.now(),
          status: "booked",
        };
        set((s) => ({ bouts: [bout, ...s.bouts] }));
        return bout;
      },
      settle: (id, result, method) =>
        set((s) => ({
          bouts: s.bouts.map((b) =>
            b.id === id ? { ...b, status: result, foughtAt: Date.now(), method } : b,
          ),
        })),
      cancel: (id) => set((s) => ({ bouts: s.bouts.filter((b) => b.id !== id) })),
      reset: () => set({ bouts: [] }),
    }),
    { name: "fumblefists-bouts", storage: deviceStorage, version: 1 },
  ),
);

/** The booked (not yet fought) bout with this fighter, if any. */
export function activeBoutWith(bouts: Bout[], fighterId: string) {
  return bouts.find((b) => b.fighterId === fighterId && b.status === "booked");
}

/** Your record, derived from settled bouts: "W-L", or "W-L-D" once there's a draw. */
export function recordOf(bouts: Bout[]) {
  const wins = bouts.filter((b) => b.status === "won").length;
  const losses = bouts.filter((b) => b.status === "lost").length;
  const draws = bouts.filter((b) => b.status === "draw").length;
  return draws ? `${wins}-${losses}-${draws}` : `${wins}-${losses}`;
}

/** Current streak from the most recent fights, e.g. "W3", "L1", or "—". */
export function streakOf(bouts: Bout[]) {
  const settled = bouts
    .filter((b) => b.status !== "booked")
    .sort((a, b) => (b.foughtAt ?? 0) - (a.foughtAt ?? 0));
  const first = settled[0];
  if (!first || first.status === "draw") return "—";
  let count = 0;
  for (const b of settled) {
    if (b.status !== first.status) break;
    count++;
  }
  return `${first.status === "won" ? "W" : "L"}${count}`;
}
