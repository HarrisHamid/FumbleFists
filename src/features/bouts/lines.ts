/**
 * What fighters say around a bout. Shared by everyone; {when} and {where}
 * are filled from the booking, {me} from your card.
 */
export const BOOKED_LINES = [
  "{when} at {where}. Don't be late.",
  "Locked in. {where}, {when}. Bring water.",
  "{when}? Fine. {where}. Wear something you can lose in.",
  "See you at {where}, {when}. I'll be the one warming up.",
];

/** They say this after YOU win. */
export const THEY_LOST_LINES = [
  "Rematch. I demand a rematch.",
  "Okay that was lucky. Run it back.",
  "Respect, {me}. Still think I had you in round two.",
  "Fine. I'll buy the food. This time.",
];

/** They say this after YOU lose. */
export const THEY_WON_LINES = [
  "Told you. Food's on you.",
  "Good effort. Wrong opponent.",
  "Ice that tonight. And maybe study.",
  "GG {me}. Come back when you've passed something.",
];

export const DRAW_LINES = [
  "A draw? Unacceptable. Rematch.",
  "Nobody wins, everybody's tired. Classic.",
  "We'll call it even. For now.",
];

export const WHEN_OPTIONS = ["TONIGHT · 9PM", "TOMORROW · 6AM", "FRIDAY · 7PM", "SUNDAY · NOON"];

export const WHERE_OPTIONS = [
  "REC CENTER · MAT 2",
  "CAMPUS GYM",
  "THE QUAD (PADDED)",
  "DORM BASEMENT",
];
