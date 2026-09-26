import type { ImageSource } from "expo-image";

export type FighterTone = "flame" | "match" | "blood" | "cream";

/** What a card in the deck shows. */
export type Fighter = {
  id: string;
  name: string;
  major: string;
  year: string;
  gpa: string;
  record: string;
  failed: string;
  bio: string;
  /** Absent until the fighter uploads one; the card shows a branded placeholder. */
  photo?: ImageSource | number;
  /** Accent for the placeholder portrait. */
  tone?: FighterTone;
};

/** A fictional fighter in the deck. */
export type RosterFighter = Fighter & {
  /** Probability (0–1) they swipe right on you back. Picky fighters are rarer matches. */
  swipeBackChance: number;
};

export type SwipeDirection = "left" | "right";
