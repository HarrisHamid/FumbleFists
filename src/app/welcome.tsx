import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  css,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LogoMark } from "@/components/brand-header";
import { Button } from "@/components/button";
import { CardFan } from "@/features/welcome/card-fan";
import { Marquee } from "@/features/welcome/marquee";
import { springOut } from "@/theme/motion";

// Each headline line punches in from oversized and tilted.
const slam = css.keyframes({
  from: { opacity: 0, transform: [{ scale: 2.4 }, { rotate: "-8deg" }] },
  to: { opacity: 1, transform: [{ scale: 1 }, { rotate: "0deg" }] },
});

const fadeDown = css.keyframes({
  from: { opacity: 0, transform: [{ translateY: -14 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
});

const rise = css.keyframes({
  from: { opacity: 0, transform: [{ translateY: 28 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
});

// Slow "breathing" glow behind everything.
const breathe = css.keyframes({
  from: { opacity: 0.5, transform: [{ scale: 1 }] },
  to: { opacity: 1, transform: [{ scale: 1.18 }] },
});

// Expanding ring behind the call-to-action.
const ping = css.keyframes({
  from: { opacity: 0.55, transform: [{ scaleX: 1 }, { scaleY: 1 }] },
  to: { opacity: 0, transform: [{ scaleX: 1.12 }, { scaleY: 1.5 }] },
});

const HEADLINE = [
  { text: "FAILED", tone: "text-paper", delayMs: 250 },
  { text: "THE EXAM?", tone: "text-paper", delayMs: 550 },
  { text: "THROW SOME HANDS!", tone: "text-flame", delayMs: 900 },
] as const;

const TAPE_DELAY_MS = 1200;
const CTA_DELAY_MS = 2100;

/** Soft radial light that slowly breathes behind the page. */
function Glow({ color, size, style }: { color: string; size: number; style: ViewStyle }) {
  const gradient = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          animationName: breathe,
          animationDuration: "4200ms",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationTimingFunction: "ease-in-out",
        },
        Platform.OS === "web"
          ? ({ backgroundImage: gradient } as ViewStyle)
          : { experimental_backgroundImage: gradient },
        style,
      ]}
    />
  );
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const headlineSize = Math.min(64, width * 0.15);

  // Screen shake + haptic thud timed to each headline slam.
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  useEffect(() => {
    if (reduceMotion) return;
    const timers = HEADLINE.map(({ delayMs }, i) =>
      setTimeout(
        () => {
          const strength = i === HEADLINE.length - 1 ? 9 : 5;
          shake.set(
            withSequence(
              withTiming(strength, { duration: 40 }),
              withTiming(-strength * 0.7, { duration: 45 }),
              withTiming(strength * 0.35, { duration: 45 }),
              withTiming(0, { duration: 60 }),
            ),
          );
          if (Platform.OS !== "web") {
            Haptics.impactAsync(
              i === HEADLINE.length - 1
                ? Haptics.ImpactFeedbackStyle.Heavy
                : Haptics.ImpactFeedbackStyle.Medium,
            );
          }
        },
        // Land on the impact frame, a beat after the slam starts.
        delayMs + 180,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion, shake]);

  return (
    <View className="flex-1 overflow-hidden bg-ink">
      <Glow
        color="rgba(246,83,17,0.38)"
        size={width * 1.5}
        style={{ top: -width * 0.7, left: -width * 0.55 }}
      />
      <Glow
        color="rgba(247,205,58,0.16)"
        size={width * 1.3}
        style={{ bottom: -width * 0.45, right: -width * 0.6 }}
      />

      <ScrollView
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <Animated.View style={[{ flex: 1 }, shakeStyle]}>
          <Animated.View
            className="flex-row items-center gap-2.5 px-5"
            style={{
              animationName: fadeDown,
              animationDuration: "500ms",
              animationFillMode: "both",
            }}
          >
            <LogoMark />
            <View>
              <Text className="font-display text-2xl tracking-[2px] text-paper">FUMBLEFISTS</Text>
              <Text className="font-mono text-[8px] tracking-[2.2px] text-cream/50">
                SPAR CLUB · EST. FAIL
              </Text>
            </View>
          </Animated.View>

          <View className="mt-8 px-5">
            {HEADLINE.map((line) => (
              <Animated.View
                key={line.text}
                style={{
                  alignSelf: "flex-start",
                  // Anton needs a generous line box; pull lines back together.
                  marginTop: -headlineSize * 0.22,
                  animationName: slam,
                  animationDuration: "420ms",
                  animationDelay: `${line.delayMs}ms`,
                  animationTimingFunction: springOut,
                  animationFillMode: "both",
                }}
              >
                <Text
                  className={`font-anton ${line.tone}`}
                  style={{ fontSize: headlineSize, lineHeight: headlineSize * 1.22 }}
                >
                  {line.text}
                </Text>
              </Animated.View>
            ))}
            <Animated.View
              style={{
                animationName: rise,
                animationDuration: "500ms",
                animationDelay: "1150ms",
                animationTimingFunction: springOut,
                animationFillMode: "both",
              }}
            >
              <Text className="mt-3 max-w-[320px] font-body text-[15px] leading-6 text-cream/80">
                Swipe on fellow failures, match, and settle it in the ring. Loser buys nuggets.
              </Text>
            </Animated.View>
          </View>

          {/* Crossed caution tape behind the card fan. */}
          <View className="mt-8 justify-center">
            <Animated.View
              className="absolute inset-x-0"
              style={{
                animationName: rise,
                animationDuration: "600ms",
                animationDelay: `${TAPE_DELAY_MS}ms`,
                animationFillMode: "both",
              }}
            >
              <View style={{ marginHorizontal: -60, transform: [{ rotate: "-7deg" }], top: -120 }}>
                <Marquee text="0% PASSING · 100% PUNCHING" tone="match" />
              </View>
              <View style={{ marginHorizontal: -60, transform: [{ rotate: "5deg" }], top: 95 }}>
                <Marquee text="FAIL · SWIPE · SPAR · REPEAT" tone="flame" reverse />
              </View>
            </Animated.View>
            <CardFan />
          </View>

          <View className="flex-1" />

          <Animated.View
            className="mt-6 px-5"
            style={{
              animationName: rise,
              animationDuration: "600ms",
              animationDelay: `${CTA_DELAY_MS}ms`,
              animationTimingFunction: springOut,
              animationFillMode: "both",
            }}
          >
            <View>
              <Animated.View
                pointerEvents="none"
                className="absolute inset-0 rounded-lg bg-flame"
                style={{
                  animationName: ping,
                  animationDuration: "1600ms",
                  animationDelay: `${CTA_DELAY_MS + 600}ms`,
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-out",
                }}
              />
              <Button label="PRINT MY CARD" onPress={() => router.push("/card/edit")} />
            </View>
            <Text className="mt-4 text-center font-mono text-[9px] tracking-[1.4px] text-cream/40">
              TAKES 30 SECONDS · STORED ON THIS PHONE · ALL FIGHTERS FICTIONAL
            </Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
