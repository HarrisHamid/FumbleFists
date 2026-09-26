import type { Fighter } from "./types";

/**
 * Placeholder fighters from the Lovable prototype, used until the deck is
 * backed by Supabase (Phase 2). These move into supabase/seed.sql then.
 */
export const SAMPLE_FIGHTERS: Fighter[] = [
  {
    id: "sample-jade",
    name: "JADE OKAFOR",
    major: "BIOCHEM",
    year: "CLASS OF 27",
    gpa: "2.1",
    record: "14-3",
    failed: "ORGA",
    bio: '"Just failed ORGA Chemistry. I will not be talking about it. You bring gloves, I bring the footwork."',
  },
  {
    id: "sample-kofi",
    name: "KOFI MENSAH",
    major: "MECH ENG",
    year: "CLASS OF 26",
    gpa: "3.1",
    record: "1-2",
    failed: "THERMO",
    bio: '"Entropy is chaos. So am I after an F. Light rounds, heavy heart. Loser buys the dining hall nuggets."',
  },
  {
    id: "sample-mara",
    name: "MARA VOSS",
    major: "MOLECULAR BIO",
    year: "CLASS OF 28",
    gpa: "3.7",
    record: "4-0",
    failed: "OCHEM",
    bio: '"Gym opens 6am, loser buys protein. Undefeated and extremely well-rested."',
  },
];
