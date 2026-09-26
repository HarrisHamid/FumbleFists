import { useDeckStore } from "@/features/deck/store";
import { useMatchesStore } from "@/features/matches/store";
import { useProfileStore } from "@/features/profile/store";

/** Wipe everything this app keeps on the phone. */
export function burnEverything() {
  useDeckStore.getState().reset();
  useMatchesStore.getState().reset();
  // Last: clearing the card sends you back to the landing page.
  useProfileStore.getState().clearProfile();
}
