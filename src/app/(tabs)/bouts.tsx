import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { BrandHeader } from "@/components/brand-header";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { SectionIntro } from "@/components/section-intro";
import { StatTile } from "@/components/stat-tile";
import { type Bout, recordOf, streakOf, useBoutsStore } from "@/features/bouts/store";
import { initials } from "@/features/deck/fighter-card";
import { ROSTER_BY_ID } from "@/features/deck/roster";
import { useProfileStore } from "@/features/profile/store";
import { haptics } from "@/lib/haptics";
import { useHydrated } from "@/lib/persist";
import { entrance } from "@/theme/motion";

const avatarTone = {
  flame: "text-flame",
  match: "text-match",
  blood: "text-blood",
  cream: "text-cream",
} as const;

const resultBadge = {
  won: { letter: "W", box: "bg-match", text: "text-ink" },
  lost: { letter: "L", box: "bg-blood", text: "text-paper" },
  draw: { letter: "D", box: "bg-card-raised", text: "text-cream" },
} as const;

function dateLabel(at: number) {
  return new Date(at).toLocaleDateString([], { month: "short", day: "numeric" }).toUpperCase();
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="mb-3 mt-8 font-mono text-[9px] tracking-[2px] text-cream/50">{children}</Text>
  );
}

function UpcomingBout({ bout, index }: { bout: Bout; index: number }) {
  const fighter = ROSTER_BY_ID[bout.fighterId];
  const cancel = useBoutsStore((s) => s.cancel);
  if (!fighter) return null;

  return (
    <Animated.View style={[entrance.rise, { animationDelay: `${Math.min(index * 60, 300)}ms` }]}>
      <View className="rounded-2xl border border-flame/40 bg-card p-3">
        <View className="flex-row items-center gap-3">
          <View className="size-14 items-center justify-center rounded-xl bg-card-raised">
            <Text
              className={`font-anton text-2xl leading-8 ${avatarTone[fighter.tone ?? "flame"]}`}
            >
              {initials(fighter.name)}
            </Text>
          </View>
          <View className="flex-1">
            <Text numberOfLines={1} className="font-anton text-lg leading-6 text-paper">
              VS {fighter.name}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-0.5 font-mono text-[10px] tracking-[1.2px] text-flame"
            >
              {bout.when}
            </Text>
            <Text
              numberOfLines={1}
              className="font-mono text-[10px] tracking-[1.2px] text-cream/55"
            >
              {bout.where}
            </Text>
          </View>
        </View>
        <View className="mt-3 flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call off the bout with ${fighter.name}`}
            onPress={() => {
              haptics.tick();
              cancel(bout.id);
            }}
            className="items-center justify-center rounded-lg border border-white/15 px-4 py-2.5"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="font-mono text-[10px] tracking-[1.6px] text-cream/60">
              CALL IT OFF
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Step in against ${fighter.name}`}
            onPress={() => {
              haptics.thud();
              router.push({ pathname: "/bout/[id]", params: { id: bout.id } });
            }}
            className="flex-1 items-center justify-center rounded-lg bg-flame py-2.5"
            style={({ pressed }) => ({
              transform: [{ rotate: "-1deg" }, { scale: pressed ? 0.97 : 1 }],
              boxShadow: pressed ? undefined : "4px 4px 0 #000",
            })}
          >
            <Text className="font-anton text-lg leading-6 tracking-[1px] text-ink">STEP IN</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function LedgerRow({ bout, index }: { bout: Bout; index: number }) {
  const fighter = ROSTER_BY_ID[bout.fighterId];
  if (!fighter || bout.status === "booked") return null;
  const badge = resultBadge[bout.status];

  return (
    <Animated.View style={[entrance.rise, { animationDelay: `${Math.min(index * 50, 400)}ms` }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${bout.status} against ${fighter.name}, ${bout.method}`}
        onPress={() => router.push({ pathname: "/bout/[id]", params: { id: bout.id } })}
        className="flex-row items-center gap-3 rounded-xl border border-white/10 bg-card px-3 py-2.5"
        style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
      >
        <View className={`size-9 items-center justify-center rounded-lg ${badge.box}`}>
          <Text className={`font-anton text-xl leading-7 ${badge.text}`}>{badge.letter}</Text>
        </View>
        <View className="flex-1">
          <Text numberOfLines={1} className="font-anton text-base leading-6 text-paper">
            {fighter.name}
          </Text>
          <Text numberOfLines={1} className="font-mono text-[9px] tracking-[1.2px] text-cream/50">
            {bout.method}
          </Text>
        </View>
        <Text className="font-mono text-[9px] tracking-[1.2px] text-cream/40">
          {dateLabel(bout.foughtAt ?? bout.bookedAt)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function BoutsScreen() {
  const loaded = useHydrated(useBoutsStore);
  const bouts = useBoutsStore((s) => s.bouts);
  const lastFail = useProfileStore((s) => s.profile?.failed ?? "—");

  const upcoming = bouts.filter((b) => b.status === "booked");
  const settled = bouts
    .filter((b) => b.status !== "booked")
    .sort((a, b) => (b.foughtAt ?? 0) - (a.foughtAt ?? 0));
  const streak = streakOf(bouts);

  return (
    <Screen>
      <BrandHeader />
      <SectionIntro
        title="FIGHT"
        accent="LEDGER"
        blurb="Booked bouts and results. Every win, loss and fumble goes on the ledger."
      />
      <View className="mt-6 flex-row gap-2">
        <StatTile label="RECORD" value={recordOf(bouts)} />
        <StatTile
          label="STREAK"
          value={streak}
          tone={streak.startsWith("W") ? "match" : streak.startsWith("L") ? "blood" : "paper"}
        />
        <StatTile label="LAST FAIL" value={lastFail.toUpperCase()} tone="blood" />
      </View>

      {!loaded ? null : bouts.length === 0 ? (
        <EmptyState
          round="NO FIGHTS YET"
          title="NOTHING BOOKED"
          body="Open a match chat and hit BOOK to set a time and place. Then step in the ring."
        />
      ) : (
        <>
          {upcoming.length ? (
            <>
              <SectionLabel>{`UPCOMING · ${upcoming.length}`}</SectionLabel>
              <View className="gap-3">
                {upcoming.map((b, i) => (
                  <UpcomingBout key={b.id} bout={b} index={i} />
                ))}
              </View>
            </>
          ) : null}
          {settled.length ? (
            <>
              <SectionLabel>{`THE LEDGER · ${settled.length}`}</SectionLabel>
              <View className="gap-2">
                {settled.map((b, i) => (
                  <LedgerRow key={b.id} bout={b} index={i} />
                ))}
              </View>
            </>
          ) : null}
        </>
      )}
    </Screen>
  );
}
