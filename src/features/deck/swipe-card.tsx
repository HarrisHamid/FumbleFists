import { useImperativeHandle, type Ref } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  css,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { haptics } from "@/lib/haptics";
import { springOut } from "@/theme/motion";

import { FighterCard } from "./fighter-card";
import type { Fighter, SwipeDirection } from "./types";

/** Drag distance (px) past which letting go commits the swipe. */
const COMMIT_DISTANCE = 110;
/** A fast enough flick commits regardless of distance. */
const FLICK_VELOCITY = 900;
const MAX_TILT_DEG = 14;

// A rewound card slides back in from the side it left by.
const returnFromLeft = css.keyframes({
  from: { transform: [{ translateX: -500 }, { rotate: "-18deg" }] },
  to: { transform: [{ translateX: 0 }, { rotate: "0deg" }] },
});
const returnFromRight = css.keyframes({
  from: { transform: [{ translateX: 500 }, { rotate: "18deg" }] },
  to: { transform: [{ translateX: 0 }, { rotate: "0deg" }] },
});

export type SwipeCardHandle = { fling: (direction: SwipeDirection) => void };

/**
 * The top card of the deck. Drag to tilt; SPAR / NOPE stamps fade in by
 * direction; release past the commit distance (or flick) to fling it off.
 * `progress` (0–1) is shared with the deck so the card behind can grow in.
 */
export function SwipeCard({
  fighter,
  progress,
  onSwiped,
  enterFrom,
  ref,
}: {
  fighter: Fighter;
  progress: SharedValue<number>;
  onSwiped: (direction: SwipeDirection) => void;
  /** Slide in from off-screen, e.g. after a rewind. */
  enterFrom?: SwipeDirection;
  ref?: Ref<SwipeCardHandle>;
}) {
  const { width } = useWindowDimensions();
  const offscreen = width * 1.5;

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const pastCommit = useSharedValue(false);
  const leaving = useSharedValue(false);

  const flingOut = (direction: SwipeDirection, velocity = 0) => {
    "worklet";
    if (leaving.get()) return;
    leaving.set(true);
    progress.set(withTiming(1, { duration: 200 }));
    const target = direction === "right" ? offscreen : -offscreen;
    // Faster flicks leave faster.
    const duration = Math.max(160, 320 - Math.abs(velocity) / 12);
    x.set(
      withTiming(target, { duration }, (finished) => {
        if (finished) scheduleOnRN(onSwiped, direction);
      }),
    );
    y.set(withTiming(y.get() + 40, { duration }));
  };

  useImperativeHandle(ref, () => ({
    fling: (direction) => {
      haptics.thud();
      flingOut(direction);
    },
  }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (leaving.get()) return;
      x.set(e.translationX);
      y.set(e.translationY * 0.35);
      progress.set(Math.min(1, Math.abs(e.translationX) / COMMIT_DISTANCE));
      const past = Math.abs(e.translationX) > COMMIT_DISTANCE;
      if (past !== pastCommit.get()) {
        pastCommit.set(past);
        scheduleOnRN(haptics.tick);
      }
    })
    .onEnd((e) => {
      if (leaving.get()) return;
      const dx = x.get();
      const direction: SwipeDirection | null =
        dx > COMMIT_DISTANCE || e.velocityX > FLICK_VELOCITY
          ? "right"
          : dx < -COMMIT_DISTANCE || e.velocityX < -FLICK_VELOCITY
            ? "left"
            : null;
      if (direction) {
        scheduleOnRN(haptics.thud);
        flingOut(direction, e.velocityX);
      } else {
        x.set(withSpring(0, { damping: 15, stiffness: 180 }));
        y.set(withSpring(0, { damping: 15, stiffness: 180 }));
        progress.set(withSpring(0));
        pastCommit.set(false);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      {
        rotate: `${interpolate(x.get(), [-width / 2, 0, width / 2], [-MAX_TILT_DEG, 0, MAX_TILT_DEG], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const sparStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.get(), [20, COMMIT_DISTANCE], [0, 1], Extrapolation.CLAMP),
    transform: [
      { rotate: "-14deg" },
      { scale: interpolate(x.get(), [20, COMMIT_DISTANCE], [1.4, 1], Extrapolation.CLAMP) },
    ],
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.get(), [-COMMIT_DISTANCE, -20], [1, 0], Extrapolation.CLAMP),
    transform: [
      { rotate: "14deg" },
      { scale: interpolate(x.get(), [-COMMIT_DISTANCE, -20], [1, 1.4], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <Animated.View
      style={
        enterFrom
          ? {
              flex: 1,
              animationName: enterFrom === "left" ? returnFromLeft : returnFromRight,
              animationDuration: "450ms",
              animationTimingFunction: springOut,
              animationFillMode: "both",
            }
          : { flex: 1 }
      }
    >
      <GestureDetector gesture={pan}>
        <Animated.View style={[{ flex: 1 }, cardStyle]}>
          <FighterCard fighter={fighter} fill />
          <Animated.View pointerEvents="none" className="absolute left-8 top-10" style={sparStyle}>
            <Text className="rounded-lg border-4 border-match px-3 py-1 font-anton text-4xl leading-[48px] tracking-[3px] text-match">
              SPAR
            </Text>
          </Animated.View>
          <Animated.View pointerEvents="none" className="absolute right-8 top-10" style={nopeStyle}>
            <Text className="rounded-lg border-4 border-blood px-3 py-1 font-anton text-4xl leading-[48px] tracking-[3px] text-blood">
              NOPE
            </Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

/** The card waiting underneath, growing into place as the top card is dragged away. */
export function WaitingCard({
  fighter,
  progress,
}: {
  fighter: Fighter;
  progress: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1], [0.55, 1]),
    transform: [
      { scale: interpolate(progress.get(), [0, 1], [0.93, 1]) },
      { translateY: interpolate(progress.get(), [0, 1], [14, 0]) },
    ],
  }));
  return (
    <Animated.View pointerEvents="none" style={[{ flex: 1 }, style]}>
      <View style={{ flex: 1 }}>
        <FighterCard fighter={fighter} fill />
      </View>
    </Animated.View>
  );
}
