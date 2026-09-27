import { openThread } from "@/features/chat/bot";
import { useMatchesStore } from "@/features/matches/store";
import { useProfileStore } from "@/features/profile/store";

import { useDeckStore } from "./store";
import { ROSTER } from "./roster";
import type { RosterFighter, SwipeDirection } from "./types";

/**
 * Record a swipe. A right swipe becomes a match if the fighter swipes back,
 * which is a coin flip weighted by how picky they are. Returns whether it matched.
 */
export function swipeFighter(fighter: RosterFighter, direction: SwipeDirection): boolean {
  useDeckStore.getState().recordSwipe(fighter.id, direction);
  if (direction !== "right" || Math.random() >= fighter.swipeBackChance) return false;
  useMatchesStore.getState().addMatch(fighter.id);
  // They open with a line, so the chat's waiting when you get there.
  openThread(fighter.id, useProfileStore.getState().profile);
  return true;
}

/** Deal everyone you haven't matched with yet back into the deck. */
export function runItBack() {
  const matched = new Set(useMatchesStore.getState().matches.map((m) => m.fighterId));
  useDeckStore.getState().redeal(ROSTER.filter((f) => !matched.has(f.id)).map((f) => f.id));
}
