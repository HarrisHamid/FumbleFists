import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/persist";

export type Message = { id: string; from: "me" | "them"; text: string; at: number };

export type Thread = {
  messages: Message[];
  /** Timestamp of the last time you looked at this chat. */
  readAt: number;
};

type ChatState = {
  threads: Record<string, Thread>;
  /** Which fighters are "typing" right now. Not persisted. */
  typing: Record<string, boolean>;
  append: (fighterId: string, from: Message["from"], text: string) => void;
  markRead: (fighterId: string) => void;
  setTyping: (fighterId: string, typing: boolean) => void;
  reset: () => void;
};

let counter = 0;
const newId = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

const emptyThread = (): Thread => ({ messages: [], readAt: 0 });

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      threads: {},
      typing: {},
      append: (fighterId, from, text) =>
        set((s) => {
          const thread = s.threads[fighterId] ?? emptyThread();
          const message: Message = { id: newId(), from, text, at: Date.now() };
          return {
            threads: {
              ...s.threads,
              [fighterId]: {
                messages: [...thread.messages, message],
                // Your own messages never count as unread.
                readAt: from === "me" ? message.at : thread.readAt,
              },
            },
          };
        }),
      markRead: (fighterId) =>
        set((s) => {
          const thread = s.threads[fighterId];
          if (!thread) return s;
          return { threads: { ...s.threads, [fighterId]: { ...thread, readAt: Date.now() } } };
        }),
      setTyping: (fighterId, typing) =>
        set((s) => ({ typing: { ...s.typing, [fighterId]: typing } })),
      reset: () => set({ threads: {}, typing: {} }),
    }),
    {
      name: "fumblefists-chat",
      storage: deviceStorage,
      version: 1,
      partialize: (s) => ({ threads: s.threads }),
    },
  ),
);

export function unreadCount(thread: Thread | undefined) {
  if (!thread) return 0;
  return thread.messages.filter((m) => m.from === "them" && m.at > thread.readAt).length;
}
