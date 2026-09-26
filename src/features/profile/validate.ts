import type { MyProfile, ProfileDraft, ProfileErrors } from "./types";

export const MAX_GPA = 4;
export const BIO_MAX_LENGTH = 200;

export function emptyDraft(): ProfileDraft {
  return { name: "", major: "", year: "CLASS OF 27", gpa: "", failed: "", bio: "" };
}

export function toDraft(profile: MyProfile): ProfileDraft {
  return { ...profile, gpa: String(profile.gpa) };
}

/** Returns the cleaned profile, or the per-field errors to show. */
export function validateDraft(
  draft: ProfileDraft,
): { ok: true; profile: MyProfile } | { ok: false; errors: ProfileErrors } {
  const errors: ProfileErrors = {};
  const name = draft.name.trim();
  const major = draft.major.trim();
  const failed = draft.failed.trim();
  const bio = draft.bio.trim();
  const gpa = Number(draft.gpa.trim().replace(",", "."));

  if (!name) errors.name = "Every fighter needs a name.";
  if (!major) errors.major = "Pick your poison.";
  if (!failed) errors.failed = "Which exam broke you?";
  if (!bio) errors.bio = "Channel the F.";
  else if (bio.length > BIO_MAX_LENGTH) errors.bio = `Keep it under ${BIO_MAX_LENGTH} characters.`;
  if (!draft.gpa.trim() || !Number.isFinite(gpa) || gpa < 0 || gpa > MAX_GPA) {
    errors.gpa = `0.0 – ${MAX_GPA.toFixed(1)}`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    profile: {
      name: name.toUpperCase(),
      major: major.toUpperCase(),
      year: draft.year,
      gpa: Math.round(gpa * 100) / 100,
      failed: failed.toUpperCase(),
      bio,
      photoUri: draft.photoUri,
    },
  };
}
