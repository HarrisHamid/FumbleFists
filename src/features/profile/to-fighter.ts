import type { Fighter } from "@/features/deck/types";

import type { MyProfile } from "./types";

/** 3 → "3.0", 3.5 → "3.5", 3.75 → "3.75" */
export function formatGpa(gpa: number) {
  const fixed = gpa.toFixed(2);
  return fixed.endsWith("0") ? fixed.slice(0, -1) : fixed;
}

/** Render your own card with the same FighterCard the deck uses. */
export function profileToFighter(profile: MyProfile, record: string): Fighter {
  return {
    id: "me",
    name: profile.name,
    major: profile.major,
    year: profile.year,
    gpa: formatGpa(profile.gpa),
    record,
    failed: profile.failed,
    bio: `"${profile.bio}"`,
    photo: profile.photoUri ? { uri: profile.photoUri } : undefined,
  };
}
