import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Platform, Pressable, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  css,
  Easing,
  ReduceMotion,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Stamp } from "@/components/stamp";
import { settleBout } from "@/features/bouts/actions";
import { type Bout, type BoutResult, recordOf, useBoutsStore } from "@/features/bouts/store";
import { initials } from "@/features/deck/fighter-card";
import { ROSTER_BY_ID } from "@/features/deck/roster";
import type { RosterFighter } from "@/features/deck/types";
import { useProfileStore } from "@/features/profile/store";
import { haptics } from "@/lib/haptics";
import { entrance, springOut } from "@/theme/motion";

const ROUNDS = 3;
const ROUND_MS = 15_000;
const TOTAL_MS = ROUNDS * ROUND_MS;
const TICK_MS = 100;
/** Recovery after each punch, so mashing doesn't work. */
const PUNCH_COOLDOWN_MS = 420;
/** Pause on the final blow before the result card. */
const RESULT_DELAY_MS = 1100;

/** Distance from the bar's center (0–0.5) that each hit tier allows. */
const ZONES = { crit: 0.06, pow: 0.225, graze: 0.35 } as const;
// Tuned with a quick simulation: sloppy timing still beats the weak half of the
// roster, and it takes real timing to take down the undefeated ones.
const DAMAGE = { crit: 7, pow: 4, graze: 1 } as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** 0 (never won) to 1 (undefeated), from a "W-L" record. */
function skillOf(record: string) {
  const [wins = 0, losses = 0] = record.split("-").map(Number);
  return wins + losses ? wins / (wins + losses) : 0.5;
}

const avatarTone = {
  flame: "text-flame",
  match: "text-match",
  blood: "text-blood",
  cream: "text-cream",
} as const;

const shake = css.keyframes({
  "0%": { transform: [{ translateX: 0 }, { rotate: "0deg" }] },
  "20%": { transform: [{ translateX: -10 }, { rotate: "-4deg" }] },
  "45%": { transform: [{ translateX: 8 }, { rotate: "3deg" }] },
  "70%": { transform: [{ translateX: -4 }, { rotate: "-1deg" }] },
  "100%": { transform: [{ translateX: 0 }, { rotate: "0deg" }] },
});

const floatUp = css.keyframes({
  "0%": { opacity: 0, transform: [{ translateY: 0 }, { scale: 0.5 }] },
  "20%": { opacity: 1, transform: [{ translateY: -10 }, { scale: 1.15 }] },
  "100%": { opacity: 0, transform: [{ translateY: -70 }, { scale: 1 }] },
});

const countIn = css.keyframes({
  from: { opacity: 0, transform: [{ scale: 2.2 }] },
  to: { opacity: 1, transform: [{ scale: 1 }] },
});

const flashOut = css.keyframes({
  from: { opacity: 0.55 },
  to: { opacity: 0 },
});

type Popup = {
  id: number;
  text: string;
  tone: "match" | "flame" | "blood" | "cream";
  /** Who took it. */
  on: "them" | "you";
  x: number;
};

const popupTone = {
  match: "text-match",
  flame: "text-flame",
  blood: "text-blood",
  cream: "text-cream/70",
} as const;

function Popups({ popups }: { popups: Popup[] }) {
  return (
    <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
      {popups.map((p) => (
        <Animated.View
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            animationName: floatUp,
            animationDuration: "800ms",
            animationTimingFunction: "ease-out",
            animationFillMode: "both",
          }}
        >
          <Text
            className={`font-anton text-4xl leading-[48px] ${popupTone[p.tone]}`}
            style={{ textShadowColor: "#000", textShadowOffset: { width: 3, height: 3 } }}
          >
            {p.text}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

function HpBar({ hp, tone }: { hp: number; tone: "flame" | "blood" }) {
  return (
    <View className="h-3.5 overflow-hidden rounded-full border border-white/15 bg-black/50">
      <Animated.View
        className={`h-full rounded-full ${tone === "flame" ? "bg-flame" : "bg-blood"}`}
        style={{
          width: `${Math.max(0, hp)}%`,
          transitionProperty: "width",
          transitionDuration: 220,
          transitionTimingFunction: "ease-out",
        }}
      />
    </View>
  );
}

/** The sweeping marker. Tap PUNCH when it's in the yellow. */
function TimingBar({ marker }: { marker: SharedValue<number> }) {
  const width = useSharedValue(0);
  const markerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: marker.get() * Math.max(0, width.get() - 6) }],
  }));
  const zone = (half: number) =>
    ({ left: `${(0.5 - half) * 100}%`, width: `${half * 200}%` }) as const;

  return (
    <View
      className="h-12 overflow-hidden rounded-xl border border-white/15 bg-black/50"
      onLayout={(e) => width.set(e.nativeEvent.layout.width)}
    >
      <View className="absolute inset-y-0 bg-white/5" style={zone(ZONES.graze)} />
      <View className="absolute inset-y-0 bg-flame/35" style={zone(ZONES.pow)} />
      <View className="absolute inset-y-0 bg-match" style={zone(ZONES.crit)} />
      <Animated.View
        className="absolute inset-y-0 w-1.5 rounded-full bg-paper"
        style={[{ boxShadow: "0 0 12px rgba(242,231,202,0.9)" }, markerStyle]}
      />
    </View>
  );
}

function leave(fighterId: string) {
  if (router.canGoBack()) router.back();
  else router.replace({ pathname: "/chat/[fighterId]", params: { fighterId } });
}

const VERDICTS = {
  won: { label: "WINNER", color: "match", line: "YOU TOOK IT" },
  lost: { label: "DEFEATED", color: "blood", line: "YOU GOT FUMBLED" },
  draw: { label: "DRAW", color: "flame", line: "NOBODY BLINKED" },
} as const;

/** After the bell: the verdict, how it happened, and your updated record. */
function ResultCard({ bout, fighter }: { bout: Bout; fighter: RosterFighter }) {
  const insets = useSafeAreaInsets();
  const record = useBoutsStore((s) => recordOf(s.bouts));
  const verdict = VERDICTS[bout.status as BoutResult];

  return (
    <View
      className="flex-1 bg-ink px-5"
      style={{ paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }}
    >
      <View className="w-full max-w-[440px] flex-1 self-center">
        <View className="flex-1 items-center justify-center">
          <View className="scale-150">
            <Stamp label={verdict.label} color={verdict.color} />
          </View>
          <Animated.View style={[entrance.rise, { animationDelay: "250ms" }]}>
            <Text className="mt-12 text-center font-anton text-4xl leading-[48px] text-paper">
              {verdict.line}
            </Text>
            <Text className="mt-2 text-center font-mono text-[10px] tracking-[1.8px] text-cream/55">
              VS {fighter.name} · {bout.method}
            </Text>
          </Animated.View>
          <Animated.View style={[entrance.matchPop, { animationDelay: "450ms" }]}>
            <View className="mt-10 items-center rounded-2xl border border-white/10 bg-card px-10 py-5">
              <Text className="font-mono text-[9px] tracking-[2px] text-cream/50">YOUR RECORD</Text>
              <Text className="mt-1 font-anton text-5xl leading-[60px] text-flame">{record}</Text>
            </View>
          </Animated.View>
        </View>
        <Animated.View style={[entrance.rise, { animationDelay: "650ms" }]}>
          <View className="gap-3">
            <Button
              label={`TALK TO ${fighter.name.split(" ")[0]}`}
              onPress={() => leave(fighter.id)}
            />
            <Button
              label="FIGHT LEDGER"
              variant="secondary"
              onPress={() => router.dismissTo("/bouts")}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

function Fight({ bout, fighter }: { bout: Bout; fighter: RosterFighter }) {
  const insets = useSafeAreaInsets();
  const myName = useProfileStore((s) => s.profile?.name ?? "YOU");

  // Better records hit harder, swing more often, block more and move the bar faster.
  const skill = skillOf(fighter.record);

  const [phase, setPhase] = useState<"intro" | "fight">("intro");
  const [count, setCount] = useState(3);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [youHp, setYouHp] = useState(100);
  const [themHp, setThemHp] = useState(100);
  const [tappedOut, setTappedOut] = useState(false);
  const [tapArmed, setTapArmed] = useState(false);
  const [cooling, setCooling] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [themHits, setThemHits] = useState(0);
  const [flash, setFlash] = useState<{ n: number; color: string }>({ n: 0, color: "" });
  const nextPopup = useRef(0);

  const round = Math.min(ROUNDS, Math.floor(elapsed / ROUND_MS) + 1);
  const secondsLeft = elapsed >= TOTAL_MS ? 0 : Math.ceil((ROUND_MS - (elapsed % ROUND_MS)) / 1000);

  let result: BoutResult | null = null;
  let method = "";
  if (tappedOut) [result, method] = ["lost", `TAP OUT · ROUND ${round}`];
  else if (themHp <= 0) [result, method] = ["won", `KO · ROUND ${round}`];
  else if (youHp <= 0) [result, method] = ["lost", `KO · ROUND ${round}`];
  else if (elapsed >= TOTAL_MS) {
    const margin = youHp - themHp;
    [result, method] =
      Math.abs(margin) <= 5
        ? ["draw", "SPLIT DECISION"]
        : [margin > 0 ? "won" : "lost", "DECISION"];
  }
  const live = phase === "fight" && !result;

  const popup = useCallback((text: string, tone: Popup["tone"], on: Popup["on"] = "them") => {
    const id = nextPopup.current++;
    const x = on === "them" ? rand(15, 60) : rand(40, 70);
    setPopups((list) => [...list, { id, text, tone, on, x }]);
    setTimeout(() => setPopups((list) => list.filter((p) => p.id !== id)), 850);
  }, []);

  const takeHit = useCallback(
    (damage: number) => {
      setYouHp((hp) => Math.max(0, hp - damage));
      setFlash((f) => ({ n: f.n + 1, color: "rgba(201,48,41,1)" }));
      popup(`-${damage}`, "blood", "you");
      haptics.thud();
    },
    [popup],
  );

  // 3, 2, 1, FIGHT.
  useEffect(() => {
    if (phase !== "intro") return;
    const timer = setTimeout(() => {
      if (count > 0) {
        haptics.tick();
        setCount(count - 1);
      } else {
        haptics.thud();
        setStartedAt(Date.now());
        setPhase("fight");
      }
    }, 650);
    return () => clearTimeout(timer);
  }, [phase, count]);

  // The clock runs on wall time, so throttled or late ticks can't stretch a round.
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(
      () => setElapsed(Math.min(TOTAL_MS, Date.now() - startedAt)),
      TICK_MS,
    );
    return () => clearInterval(timer);
  }, [live, startedAt]);

  // They swing on their own schedule.
  useEffect(() => {
    if (!live) return;
    let timer: ReturnType<typeof setTimeout>;
    const swing = () => {
      timer = setTimeout(
        () => {
          takeHit(Math.round(lerp(2, 4, skill) + rand(0, 2)));
          swing();
        },
        lerp(2300, 1250, skill) + rand(-350, 350),
      );
    };
    swing();
    return () => clearTimeout(timer);
  }, [live, skill, takeHit]);

  // The marker sweeps faster each round.
  const marker = useSharedValue(0);
  const sweepMs = lerp(1050, 720, skill) * Math.pow(0.88, round - 1);
  useEffect(() => {
    if (!live) {
      cancelAnimation(marker);
      return;
    }
    marker.set(
      withRepeat(
        withTiming(1, {
          duration: sweepMs,
          easing: Easing.inOut(Easing.sin),
          // Gameplay, not decoration: it has to move even with Reduce Motion on.
          reduceMotion: ReduceMotion.Never,
        }),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    return () => cancelAnimation(marker);
  }, [live, sweepMs, marker]);

  // Record the first verdict, after a beat to see the final blow. Not cancelled
  // on re-render: a late counter-punch mustn't change or drop the result.
  const settled = useRef(false);
  useEffect(() => {
    if (!result || settled.current) return;
    settled.current = true;
    if (result === "won") haptics.success();
    else if (result === "lost") haptics.error();
    setTimeout(() => settleBout(bout, result, method), RESULT_DELAY_MS);
  }, [result, method, bout]);

  // Android back button: no running from a fight (TAP OUT is right there).
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!tapArmed) return;
    const timer = setTimeout(() => setTapArmed(false), 2500);
    return () => clearTimeout(timer);
  }, [tapArmed]);

  const punch = () => {
    if (!live || cooling) return;
    setCooling(true);
    setTimeout(() => setCooling(false), PUNCH_COOLDOWN_MS);

    const off = Math.abs(marker.get() - 0.5);
    const tier =
      off <= ZONES.crit ? "crit" : off <= ZONES.pow ? "pow" : off <= ZONES.graze ? "graze" : null;

    if (!tier) {
      // Whiff and they make you pay for it.
      haptics.error();
      popup("MISS", "cream");
      setTimeout(() => takeHit(Math.round(lerp(1, 3, skill))), 180);
      return;
    }
    if (tier !== "crit" && Math.random() < lerp(0.05, 0.25, skill)) {
      haptics.tick();
      popup("BLOCKED", "cream");
      setThemHp((hp) => Math.max(0, hp - 1));
      return;
    }
    const damage = DAMAGE[tier];
    setThemHp((hp) => Math.max(0, hp - damage));
    setThemHits((n) => n + 1);
    if (tier === "crit") {
      haptics.success();
      setFlash((f) => ({ n: f.n + 1, color: "rgba(247,205,58,1)" }));
      popup(`CRIT -${damage}`, "match");
    } else {
      haptics.thud();
      popup(tier === "pow" ? `POW -${damage}` : `-${damage}`, "flame");
    }
  };

  const tone = avatarTone[fighter.tone ?? "flame"];

  return (
    <View className="flex-1 bg-ink">
      <View
        className="w-full max-w-[440px] flex-1 self-center px-4"
        style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }}
      >
        {/* Round, clock, tap out */}
        <View className="flex-row items-center justify-between">
          <View className="w-24">
            <Animated.View key={round} style={entrance.stampIn}>
              <Text className="font-anton text-lg leading-7 tracking-[1px] text-flame">
                ROUND {round}/{ROUNDS}
              </Text>
            </Animated.View>
          </View>
          <Text
            className={`font-anton text-4xl leading-[48px] ${live && secondsLeft <= 3 ? "text-blood" : "text-paper"}`}
          >
            0:{String(secondsLeft).padStart(2, "0")}
          </Text>
          <View className="w-24 items-end">
            {live ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tap out and forfeit"
                hitSlop={10}
                onPress={() => {
                  if (!tapArmed) {
                    haptics.tick();
                    return setTapArmed(true);
                  }
                  setTappedOut(true);
                }}
                className={`rounded-md border px-2.5 py-1.5 ${tapArmed ? "border-blood bg-blood" : "border-white/15"}`}
              >
                <Text
                  className={`font-mono text-[9px] tracking-[1.4px] ${tapArmed ? "text-paper" : "text-cream/60"}`}
                >
                  {tapArmed ? "SURE?" : "TAP OUT"}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Them */}
        <View className="mt-4 flex-1 items-center justify-center rounded-3xl border border-white/10 bg-card">
          <Animated.View
            key={themHits}
            style={
              themHits
                ? {
                    animationName: shake,
                    animationDuration: "320ms",
                    animationTimingFunction: "ease-out",
                  }
                : undefined
            }
          >
            <View
              className={`size-36 items-center justify-center rounded-[36px] bg-card-raised ${themHp <= 0 ? "opacity-40" : ""}`}
              style={{ transform: [{ rotate: themHp <= 0 ? "-12deg" : "-2deg" }] }}
            >
              <Text className={`font-anton text-7xl leading-[88px] ${tone}`}>
                {initials(fighter.name)}
              </Text>
            </View>
          </Animated.View>
          <Text className="mt-4 font-anton text-2xl leading-8 text-paper">{fighter.name}</Text>
          <Text className="font-mono text-[9px] tracking-[1.6px] text-cream/50">
            {fighter.record} · FAILED {fighter.failed}
          </Text>
          <View className="mt-4 w-4/5">
            <HpBar hp={themHp} tone="blood" />
          </View>
          <Popups popups={popups.filter((p) => p.on === "them")} />
          {result ? (
            <View className="absolute top-6">
              <Stamp
                label={
                  result === "won"
                    ? "KNOCKED OUT"
                    : tappedOut
                      ? "TAPPED OUT"
                      : result === "lost"
                        ? "YOU'RE DOWN"
                        : "TIME"
                }
                color={result === "won" ? "match" : result === "lost" ? "blood" : "flame"}
              />
            </View>
          ) : null}
        </View>

        {/* You */}
        <View className="mt-3 flex-row items-center gap-3 rounded-2xl border border-white/10 bg-card px-3 py-3">
          <View className="size-11 items-center justify-center rounded-xl bg-flame">
            <Text className="font-anton text-lg leading-6 text-ink">{initials(myName)}</Text>
          </View>
          <View className="flex-1 gap-1.5">
            <View className="flex-row justify-between">
              <Text
                numberOfLines={1}
                className="font-mono text-[9px] tracking-[1.6px] text-cream/60"
              >
                YOU · {myName.toUpperCase()}
              </Text>
              <Text className="font-mono text-[9px] tracking-[1.6px] text-cream/60">
                {youHp} HP
              </Text>
            </View>
            <HpBar hp={youHp} tone="flame" />
          </View>
          <Popups popups={popups.filter((p) => p.on === "you")} />
        </View>

        {/* Controls */}
        <View className="mt-4">
          <TimingBar marker={marker} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Punch"
            disabled={!live}
            onPressIn={punch}
            className="mt-3 h-20 items-center justify-center rounded-2xl bg-flame"
            style={({ pressed }) => ({
              transform: [{ rotate: "-1deg" }, { scale: pressed ? 0.96 : 1 }],
              boxShadow: pressed ? "2px 2px 0 #000" : "6px 6px 0 #000",
              opacity: !live ? 0.4 : cooling ? 0.75 : 1,
            })}
          >
            <Text className="font-anton text-4xl leading-[48px] tracking-[2px] text-ink">
              PUNCH
            </Text>
          </Pressable>
          <Text className="mt-2 text-center font-mono text-[8px] tracking-[1.6px] text-cream/35">
            HIT THE YELLOW FOR A CRIT · WHIFFS GET COUNTERED
          </Text>
        </View>
      </View>

      {/* Hit flash */}
      {flash.n ? (
        <Animated.View
          key={flash.n}
          pointerEvents="none"
          className="absolute inset-0"
          style={{
            backgroundColor: flash.color,
            animationName: flashOut,
            animationDuration: "260ms",
            animationFillMode: "both",
          }}
        />
      ) : null}

      {/* Countdown */}
      {phase === "intro" ? (
        <View className="absolute inset-0 items-center justify-center bg-ink/85">
          <Text className="mb-4 font-mono text-[10px] tracking-[2px] text-cream/60">
            {bout.when} · {bout.where}
          </Text>
          <Animated.View
            key={count}
            style={{
              animationName: countIn,
              animationDuration: "380ms",
              animationTimingFunction: springOut,
              animationFillMode: "both",
            }}
          >
            <Text className="font-anton text-[120px] leading-[140px] text-flame">
              {count > 0 ? count : "FIGHT"}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}

export default function BoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bout = useBoutsStore((s) => s.bouts.find((b) => b.id === id));
  const fighter = bout ? ROSTER_BY_ID[bout.fighterId] : undefined;

  if (!bout || !fighter) {
    return (
      <View className="flex-1 items-center justify-center gap-6 bg-ink px-8">
        <Text className="font-anton text-2xl text-cream/60">BOUT NOT FOUND</Text>
        <Button label="BACK" variant="secondary" onPress={() => router.replace("/bouts")} />
      </View>
    );
  }

  return bout.status === "booked" ? (
    <Fight bout={bout} fighter={fighter} />
  ) : (
    <ResultCard bout={bout} fighter={fighter} />
  );
}
