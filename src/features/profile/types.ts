export const CLASS_YEARS = [
  "CLASS OF 26",
  "CLASS OF 27",
  "CLASS OF 28",
  "CLASS OF 29",
  "GRAD STUDENT",
] as const;

export type ClassYear = (typeof CLASS_YEARS)[number];

/** Your own fighter card. Record/streak aren't stored here — they're derived from bouts. */
export type MyProfile = {
  name: string;
  major: string;
  year: ClassYear;
  gpa: number;
  failed: string;
  bio: string;
  /** Local file URI (document directory on device, data/blob URI on web). */
  photoUri?: string;
};

export type ProfileDraft = Omit<MyProfile, "gpa"> & { gpa: string };

export type ProfileErrors = Partial<Record<keyof ProfileDraft, string>>;
