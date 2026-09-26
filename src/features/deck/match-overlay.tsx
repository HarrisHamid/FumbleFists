import { Image } from "expo-image";
import { useEffect } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, { css, type CSSKeyframesRule } from "react-native-reanimated";

import { Button } from "@/components/button";
import { haptics } from "@/lib/haptics";
import { springOut } from "@/theme/motion";

import { initials } from "./fighter-card";
import type { Fighter } from "./types";

const fadeIn = css.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const stampSlam = css.keyframes({
  from: { opacity: 0, transform: [{ scale: 2.6 }, { rotate: "-12deg" }] },
  to: { opacity: 1, transform: [{ scale: 1 }, { rotate: "-4deg" }] },
});

const fromLeft = css.keyframes({
  from: { opacity: 0, transform: [{ translateX: -220 }, { rotate: "-20deg" }] },
  to: { opacity: 1, transform: [{ translateX: 0 }, { rotate: "-7deg" }] },
});

const fromRight = css.keyframes({
  from: { opacity: 0, transform: [{ translateX: 220 }, { rotate: "20deg" }] },
  to: { opacity: 1, transform: [{ translateX: 0 }, { rotate: "7deg" }] },
});

const vsPop = css.keyframes({
  from: { opacity: 0, transform: [{ scale: 0 }] },
  to: { opacity: 1, transform: [{ scale: 1 }] },
});

function Portrait({ fighter, label }: { fighter: Fighter; label: string }) {
  return (
    <View
      className="w-36 overflow-hidden rounded-2xl border-2 border-paper bg-card"
      style={{ boxShadow: "0 16px 36px rgba(0,0,0,0.6)" }}
    >
      <View className="items-center justify-center bg-card-raised" style={{ aspectRatio: 4 / 5 }}>
        {fighter.photo ? (
          <Image
            source={fighter.photo}
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Text className="font-anton text-6xl leading-[76px] text-flame/40">
            {initials(fighter.name)}
          </Text>
        )}
      </View>
      <View className="px-3 py-2">
        <Text numberOfLines={1} className="font-anton text-base leading-6 text-paper">
          {fighter.name.split(" ")[0]}
        </Text>
        <Text className="font-mono text-[8px] tracking-[1.6px] text-cream/60">{label}</Text>
      </View>
    </View>
  );
}

const anim = (name: CSSKeyframesRule, duration: number, delay: number) => ({
  animationName: name,
  animationDuration: `${duration}ms` as const,
  animationDelay: `${delay}ms` as const,
  animationTimingFunction: springOut,
  animationFillMode: "both" as const,
});

/** Full-screen "MATCH CONFIRMED" moment: you vs them, then talk trash or keep swiping. */
export function MatchOverlay({
  you,
  them,
  onTalkTrash,
  onKeepSwiping,
}: {
  you: Fighter;
  them: Fighter;
  onTalkTrash: () => void;
  onKeepSwiping: () => void;
}) {
  useEffect(() => {
    haptics.success();
  }, []);

  return (
    <Modal
      transparent
      visible
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onKeepSwiping}
    >
      <Animated.View
        className="flex-1 items-center justify-center bg-ink/95 px-6"
        style={{ animationName: fadeIn, animationDuration: "200ms", animationFillMode: "both" }}
      >
        <Pressable
          accessibilityLabel="Keep swiping"
          className="absolute inset-0"
          onPress={onKeepSwiping}
        />

        <Animated.View style={anim(stampSlam, 450, 120)}>
          <Text className="rounded-lg border-4 border-match px-4 py-1 font-anton text-4xl leading-[50px] tracking-[2px] text-match">
            MATCH CONFIRMED
          </Text>
        </Animated.View>
        <Animated.View style={anim(fadeIn, 400, 500)}>
          <Text className="mt-4 text-center font-mono text-[10px] tracking-[2px] text-cream/70">
            {them.name.split(" ")[0]} SWIPED BACK. GLOVES UP.
          </Text>
        </Animated.View>

        <View className="mt-10 flex-row items-center">
          <Animated.View style={anim(fromLeft, 550, 350)}>
            <Portrait fighter={you} label={`YOU · ${you.gpa} GPA`} />
          </Animated.View>
          <Animated.View className="z-10 -mx-5" style={anim(vsPop, 400, 800)}>
            <View className="size-16 items-center justify-center rounded-full border-4 border-ink bg-flame">
              <Text className="font-anton text-2xl leading-8 text-ink">VS</Text>
            </View>
          </Animated.View>
          <Animated.View style={anim(fromRight, 550, 450)}>
            <Portrait fighter={them} label={`${them.record} · FAILED ${them.failed}`} />
          </Animated.View>
        </View>

        <Animated.View style={{ width: "100%", maxWidth: 400, ...anim(fadeIn, 400, 1000) }}>
          <View className="mt-12 gap-3">
            <Button label="TALK TRASH" onPress={onTalkTrash} />
            <Button label="KEEP SWIPING" variant="secondary" onPress={onKeepSwiping} />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
