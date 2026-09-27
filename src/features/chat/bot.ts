import { ROSTER_BY_ID } from "@/features/deck/roster";
import type { MyProfile } from "@/features/profile/types";
import { formatGpa } from "@/features/profile/to-fighter";

import { PERSONAS, SHARED_TOPICS, type Topic, TOPIC_PATTERNS } from "./personas";
import { useChatStore } from "./store";

const pending = new Map<string, ReturnType<typeof setTimeout>[]>();

function clearPending(fighterId: string) {
  pending.get(fighterId)?.forEach(clearTimeout);
  pending.delete(fighterId);
}

/** Cancel every scheduled reply, e.g. when wiping all data. */
export function cancelAllReplies() {
  [...pending.keys()].forEach(clearPending);
}

function titleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function fillSlots(line: string, me: MyProfile | null, extra: Record<string, string> = {}) {
  const withExtras = Object.entries(extra).reduce(
    (text, [slot, value]) => text.replaceAll(`{${slot}}`, value),
    line,
  );
  return withExtras
    .replaceAll("{me}", me ? titleCase(me.name.split(" ")[0] ?? "") : "champ")
    .replaceAll("{major}", me?.major ?? "undeclared")
    .replaceAll("{gpa}", me ? formatGpa(me.gpa) : "2.0")
    .replaceAll("{failed}", me?.failed ?? "that exam");
}

function detectTopic(text: string): Topic | null {
  return TOPIC_PATTERNS.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
}

/** Pick a reply in this fighter's voice, preferring lines they haven't used yet. */
export function pickReply(fighterId: string, text: string, me: MyProfile | null): string {
  const persona = PERSONAS[fighterId];
  const topic = detectTopic(text);
  const said = new Set(
    (useChatStore.getState().threads[fighterId]?.messages ?? [])
      .filter((m) => m.from === "them")
      .map((m) => m.text),
  );

  const pools = [
    topic ? persona?.topics?.[topic] : undefined,
    topic ? SHARED_TOPICS[topic] : undefined,
    persona?.lines,
  ].filter((p): p is string[] => !!p?.length);

  for (const pool of pools) {
    const fresh = pool.map((l) => fillSlots(l, me)).filter((l) => !said.has(l));
    if (fresh.length) return fresh[Math.floor(Math.random() * fresh.length)]!;
  }
  // Everything's been said; repeat something in character.
  const fallback = persona?.lines ?? ["..."];
  return fillSlots(fallback[Math.floor(Math.random() * fallback.length)]!, me);
}

/** Start a chat with the fighter's opener, if it hasn't started yet. */
export function openThread(fighterId: string, me: MyProfile | null) {
  const { threads, append } = useChatStore.getState();
  if (threads[fighterId]?.messages.length) return;
  const opener =
    PERSONAS[fighterId]?.opener ?? `${ROSTER_BY_ID[fighterId]?.name ?? "They"} wants to spar.`;
  append(fighterId, "them", fillSlots(opener, me));
}

/**
 * Have the fighter "type" for a moment, then send `reply`. A newer scheduled
 * reply replaces an older one, like a person catching up on rapid-fire texts.
 */
export function scheduleReply(fighterId: string, reply: string) {
  const { setTyping } = useChatStore.getState();
  clearPending(fighterId);
  setTyping(fighterId, false);
  const typingDelay = 500 + Math.random() * 500;
  const replyDelay = typingDelay + Math.min(2600, 700 + reply.length * 28);

  pending.set(fighterId, [
    setTimeout(() => useChatStore.getState().setTyping(fighterId, true), typingDelay),
    setTimeout(() => {
      const store = useChatStore.getState();
      store.setTyping(fighterId, false);
      store.append(fighterId, "them", reply);
      pending.delete(fighterId);
    }, replyDelay),
  ]);
}

/** Send your message and get a reply in the fighter's voice. */
export function sendMessage(fighterId: string, text: string, me: MyProfile | null) {
  const trimmed = text.trim();
  if (!trimmed) return;
  useChatStore.getState().append(fighterId, "me", trimmed);
  scheduleReply(fighterId, pickReply(fighterId, trimmed, me));
}
