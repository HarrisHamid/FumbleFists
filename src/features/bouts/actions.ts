import { fillSlots, scheduleReply } from "@/features/chat/bot";
import { useChatStore } from "@/features/chat/store";
import { useProfileStore } from "@/features/profile/store";

import { BOOKED_LINES, DRAW_LINES, THEY_LOST_LINES, THEY_WON_LINES } from "./lines";
import { type Bout, type BoutResult, useBoutsStore } from "./store";

const pick = (lines: string[]) => lines[Math.floor(Math.random() * lines.length)]!;

/** Book a bout: you propose it in chat and the fighter confirms. */
export function bookBout(fighterId: string, when: string, where: string): Bout {
  const bout = useBoutsStore.getState().book({ fighterId, when, where });
  const me = useProfileStore.getState().profile;
  useChatStore.getState().append(fighterId, "me", `${when} at ${where}. You in?`);
  scheduleReply(fighterId, fillSlots(pick(BOOKED_LINES), me, { when, where }));
  return bout;
}

/** Record the result, and have the fighter react in chat. */
export function settleBout(bout: Bout, result: BoutResult, method: string) {
  useBoutsStore.getState().settle(bout.id, result, method);
  const me = useProfileStore.getState().profile;
  const lines =
    result === "won" ? THEY_LOST_LINES : result === "lost" ? THEY_WON_LINES : DRAW_LINES;
  scheduleReply(bout.fighterId, fillSlots(pick(lines), me));
}
