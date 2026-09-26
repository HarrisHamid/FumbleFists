import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { BrandHeader } from "@/components/brand-header";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { runItBack, swipeFighter } from "@/features/deck/actions";
import { MatchOverlay } from "@/features/deck/match-overlay";
import { ROSTER, ROSTER_BY_ID } from "@/features/deck/roster";
import { useDeckStore } from "@/features/deck/store";
import { SwipeCard, type SwipeCardHandle, WaitingCard } from "@/features/deck/swipe-card";
import type { RosterFighter, SwipeDirection } from "@/features/deck/types";
import { useMatchesStore } from "@/features/matches/store";
import { useProfileStore } from "@/features/profile/store";
import { profileToFighter } from "@/features/profile/to-fighter";
import { haptics } from "@/lib/haptics";
import { useHydrated } from "@/lib/persist";

function RageChip({ count }: { count: number }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5">
      <View className="size-1.5 rounded-full bg-blood" />
      <Text className="font-mono text-[11px] text-cream/80">{count} RAGE</Text>
    </View>
  );
}

function RoundButton({
  label,
  sub,
  onPress,
  disabled = false,
  big = false,
  tone,
}: {
  label: string;
  sub: string;
  onPress: () => void;
  disabled?: boolean;
  big?: boolean;
  tone: "blood" | "ink" | "paper";
}) {
  const labelTone = { blood: "text-blood", ink: "text-ink", paper: "text-paper" }[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={sub}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`items-center justify-center rounded-full ${big ? "size-20 bg-flame" : "size-16 border border-white/15 bg-card"} ${disabled ? "opacity-30" : ""}`}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.9 : 1 }, { rotate: big ? "-2deg" : "0deg" }],
        boxShadow: big ? "0 0 34px rgba(246,83,17,0.45)" : undefined,
      })}
    >
      <Text
        className={`font-anton ${big ? "text-3xl leading-9" : "text-2xl leading-8"} ${labelTone}`}
      >
        {label}
      </Text>
      <Text
        className={`font-mono ${big ? "text-[9px] text-ink/60" : "text-[8px] text-cream/40"} tracking-[1.5px]`}
      >
        {sub}
      </Text>
    </Pressable>
  );
}

export default function SparScreen() {
  const deckLoaded = useHydrated(useDeckStore);
  const matchesLoaded = useHydrated(useMatchesStore);
  const profile = useProfileStore((s) => s.profile);
  const order = useDeckStore((s) => s.order);
  const position = useDeckStore((s) => s.position);
  const lastSwipe = useDeckStore((s) => s.lastSwipe);
  const rewind = useDeckStore((s) => s.rewind);
  const matchCount = useMatchesStore((s) => s.matches.length);

  const [matchedWith, setMatchedWith] = useState<RosterFighter | null>(null);
  const [enterFrom, setEnterFrom] = useState<SwipeDirection | undefined>();
  const progress = useSharedValue(0);
  const topCard = useRef<SwipeCardHandle>(null);

  if (!deckLoaded || !matchesLoaded || !profile) return <Screen scroll={false}>{null}</Screen>;

  const top = ROSTER_BY_ID[order[position] ?? ""];
  const next = ROSTER_BY_ID[order[position + 1] ?? ""];
  const left = Math.max(0, order.length - position);
  const canRewind = lastSwipe?.direction === "left";
  const unmatchedCount = ROSTER.length - matchCount;

  const handleSwiped = (direction: SwipeDirection) => {
    if (!top) return;
    progress.set(0);
    setEnterFrom(undefined);
    if (swipeFighter(top, direction)) setMatchedWith(top);
  };

  const handleRewind = () => {
    haptics.tick();
    progress.set(0);
    setEnterFrom("left");
    rewind();
  };

  return (
    <Screen scroll={false}>
      <BrandHeader right={<RageChip count={matchCount} />} />

      {top ? (
        <>
          <View className="flex-1">
            {next ? (
              <View className="absolute inset-0">
                <WaitingCard key={next.id} fighter={next} progress={progress} />
              </View>
            ) : null}
            <View className="absolute inset-0">
              <SwipeCard
                key={top.id}
                ref={topCard}
                fighter={top}
                progress={progress}
                onSwiped={handleSwiped}
                enterFrom={enterFrom}
              />
            </View>
          </View>

          <View className="mt-5 flex-row items-center justify-center gap-6">
            <RoundButton
              label="NO"
              sub="PASS"
              tone="blood"
              onPress={() => topCard.current?.fling("left")}
            />
            <RoundButton
              label="SPAR"
              sub="MATCH"
              tone="ink"
              big
              onPress={() => topCard.current?.fling("right")}
            />
            <RoundButton
              label="↺"
              sub="REWIND"
              tone="paper"
              disabled={!canRewind}
              onPress={handleRewind}
            />
          </View>
          <Text className="mt-3 text-center font-mono text-[9px] tracking-[1.6px] text-cream/35">
            {left} {left === 1 ? "FIGHTER" : "FIGHTERS"} LEFT IN THE DECK
          </Text>
        </>
      ) : (
        <View className="flex-1 justify-center">
          <EmptyState
            title={unmatchedCount > 0 ? "OUT OF FIGHTERS" : "UNDISPUTED"}
            body={
              unmatchedCount > 0
                ? `You've seen everyone. ${unmatchedCount} haven't matched with you yet. Deal them back in?`
                : "Every fighter on the card swiped back. Go settle it in Matches."
            }
          />
          <View className="mt-6 gap-3">
            {unmatchedCount > 0 ? (
              <Button
                label="RUN IT BACK"
                onPress={() => {
                  haptics.thud();
                  runItBack();
                }}
              />
            ) : null}
            {matchCount > 0 ? (
              <Button
                label="SEE YOUR MATCHES"
                variant="secondary"
                onPress={() => router.push("/matches")}
              />
            ) : null}
          </View>
        </View>
      )}

      {matchedWith ? (
        <MatchOverlay
          you={profileToFighter(profile, "0-0")}
          them={matchedWith}
          onKeepSwiping={() => setMatchedWith(null)}
          onTalkTrash={() => {
            setMatchedWith(null);
            router.push("/matches");
          }}
        />
      ) : null}
    </Screen>
  );
}
