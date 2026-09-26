import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { BrandHeader } from "@/components/brand-header";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { SectionIntro } from "@/components/section-intro";
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
  if (minutes < 1) return "JUST NOW";
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  return `${Math.floor(hours / 24)}D AGO`;
}

function MatchRow({
  fighter,
  matchedAt,
  index,
}: {
  fighter: RosterFighter;
  matchedAt: number;
  index: number;
}) {
  return (
    <Animated.View style={[entrance.rise, { animationDelay: `${Math.min(index * 60, 400)}ms` }]}>
      <View className="flex-row items-center gap-3 rounded-2xl border border-white/10 bg-card p-3">
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
            className="mt-0.5 font-mono text-[9px] tracking-[1.4px] text-cream/50"
          >
            {fighter.major} · GPA {fighter.gpa} · FAILED {fighter.failed}
          </Text>
        </View>
        <View className="items-end">
          <Text className="rounded border-2 border-match px-1.5 font-anton text-xs leading-5 text-match">
            MATCHED
          </Text>
          <Text className="mt-1 font-mono text-[8px] tracking-[1.2px] text-cream/40">
            {timeAgo(matchedAt)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function MatchesScreen() {
  const loaded = useHydrated(useMatchesStore);
  const matches = useMatchesStore((s) => s.matches);

  return (
    <Screen>
      <BrandHeader />
      <SectionIntro
        title="YOUR"
        accent="CORNER"
        blurb="Fighters who swiped back. Trash talk opens here next."
      />
      {!loaded ? null : matches.length === 0 ? (
        <EmptyState
          title="NO MATCHES YET"
          body="Swipe right on the Spar tab. If they swipe back, they land here."
        />
      ) : (
        <View className="mt-6 gap-3">
          {matches.map((m, i) => {
            const fighter = ROSTER_BY_ID[m.fighterId];
            return fighter ? (
              <MatchRow key={m.fighterId} fighter={fighter} matchedAt={m.matchedAt} index={i} />
            ) : null;
          })}
        </View>
      )}
    </Screen>
  );
}
