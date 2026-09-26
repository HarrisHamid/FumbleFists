import type { ImageSource } from "expo-image";

/** What a card in the deck shows. Phase 1 replaces this with the generated Supabase row type. */
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
};
