import { cancelAllReplies } from "@/features/chat/bot";
import { useChatStore } from "@/features/chat/store";
import { useDeckStore } from "@/features/deck/store";
import { useMatchesStore } from "@/features/matches/store";
import { useProfileStore } from "@/features/profile/store";

/** Wipe everything this app keeps on the phone. */
export function burnEverything() {
  cancelAllReplies();
  useChatStore.getState().reset();
  useDeckStore.getState().reset();
  useMatchesStore.getState().reset();
  // Last: clearing the card sends you back to the landing page.
  useProfileStore.getState().clearProfile();
}
