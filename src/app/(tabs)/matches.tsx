import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { BrandHeader } from "@/components/brand-header";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { SectionIntro } from "@/components/section-intro";
import { type Thread, unreadCount, useChatStore } from "@/features/chat/store";
import { initials } from "@/features/deck/fighter-card";
import { ROSTER_BY_ID } from "@/features/deck/roster";
import type { RosterFighter } from "@/features/deck/types";
import { useMatchesStore } from "@/features/matches/store";
import { useHydrated } from "@/lib/persist";
import { entrance } from "@/theme/motion";

const avatarTone = {
  flame: "text-flame",
  match: "text-match",
  blood: "text-blood",
  cream: "text-cream",
} as const;

function timeAgo(timestamp: number) {
  const minutes = Math.floor((Date.now() - timestamp) / 60_000);
  if (minutes < 1) return "NOW";
  if (minutes < 60) return `${minutes}M`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H`;
  return `${Math.floor(hours / 24)}D`;
}

function MatchRow({
  fighter,
  matchedAt,
  thread,
  typing,
  index,
}: {
  fighter: RosterFighter;
  matchedAt: number;
  thread: Thread | undefined;
  typing: boolean;
  index: number;
}) {
  const last = thread?.messages[thread.messages.length - 1];
  const unread = unreadCount(thread);
  const preview = typing
    ? "typing…"
    : last
      ? `${last.from === "me" ? "You: " : ""}${last.text}`
      : `${fighter.major} · GPA ${fighter.gpa} · FAILED ${fighter.failed}`;

  return (
    <Animated.View style={[entrance.rise, { animationDelay: `${Math.min(index * 60, 400)}ms` }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Chat with ${fighter.name}`}
        onPress={() =>
          router.push({ pathname: "/chat/[fighterId]", params: { fighterId: fighter.id } })
        }
        className={`flex-row items-center gap-3 rounded-2xl border bg-card p-3 ${unread ? "border-flame/60" : "border-white/10"}`}
        style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
      >
        <View className="size-14 items-center justify-center rounded-xl bg-card-raised">
          <Text className={`font-anton text-2xl leading-8 ${avatarTone[fighter.tone ?? "flame"]}`}>
            {initials(fighter.name)}
          </Text>
        </View>
        <View className="flex-1">
          <Text numberOfLines={1} className="font-anton text-lg leading-6 text-paper">
            {fighter.name}
          </Text>
          <Text
            numberOfLines={1}
            className={`mt-0.5 font-body text-[13px] ${unread ? "text-paper" : "text-cream/55"} ${typing ? "italic" : ""}`}
          >
            {preview}
          </Text>
        </View>
        <View className="items-end gap-1.5">
          <Text className="font-mono text-[9px] tracking-[1.2px] text-cream/40">
            {timeAgo(last?.at ?? matchedAt)}
          </Text>
          {unread ? (
            <View className="min-w-5 items-center rounded-full bg-flame px-1.5">
              <Text className="font-anton text-xs leading-5 text-ink">{unread}</Text>
            </View>
          ) : (
            <View className="h-5" />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function MatchesScreen() {
  const matchesLoaded = useHydrated(useMatchesStore);
  const chatLoaded = useHydrated(useChatStore);
  const matches = useMatchesStore((s) => s.matches);
  const threads = useChatStore((s) => s.threads);
  const typing = useChatStore((s) => s.typing);

  // Most recent activity first: the latest message, or when you matched.
  const lastActivity = (fighterId: string, matchedAt: number) =>
    threads[fighterId]?.messages.at(-1)?.at ?? matchedAt;
  const sorted = [...matches].sort(
    (a, b) => lastActivity(b.fighterId, b.matchedAt) - lastActivity(a.fighterId, a.matchedAt),
  );

  return (
    <Screen>
      <BrandHeader />
      <SectionIntro
        title="YOUR"
        accent="CORNER"
        blurb="Fighters who swiped back. Talk your trash, set the terms."
      />
      {!matchesLoaded || !chatLoaded ? null : matches.length === 0 ? (
        <EmptyState
          title="NO MATCHES YET"
          body="Swipe right on the Spar tab. If they swipe back, they land here."
        />
      ) : (
        <View className="mt-6 gap-3">
          {sorted.map((m, i) => {
            const fighter = ROSTER_BY_ID[m.fighterId];
            return fighter ? (
              <MatchRow
                key={m.fighterId}
                fighter={fighter}
                matchedAt={m.matchedAt}
                thread={threads[m.fighterId]}
                typing={!!typing[m.fighterId]}
                index={i}
              />
            ) : null;
          })}
        </View>
      )}
    </Screen>
  );
}
