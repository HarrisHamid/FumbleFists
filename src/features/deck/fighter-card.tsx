import { Image } from "expo-image";
import { Text, View } from "react-native";

import type { Fighter } from "./types";

/**
 * A fighter's deck card. Static for now; Phase 2 wraps it in the
 * gesture-driven swipe layer (SPAR / NOPE stamps, fling, next-card peek).
 */
export function FighterCard({ fighter }: { fighter: Fighter }) {
  return (
    <View className="rounded-[26px] border border-white/10 bg-card p-5">
      <View className="overflow-hidden rounded-t-[20px]">
        <Image
          source={fighter.photo}
          contentFit="cover"
          accessibilityLabel={fighter.name}
          style={{ width: "100%", aspectRatio: 4 / 5 }}
        />
      </View>

      <View className="mt-4 flex-row items-end justify-between gap-2">
        <View className="flex-1">
          <Text className="font-anton text-[40px] leading-[36px] text-paper">{fighter.name}</Text>
          <Text className="mt-1.5 font-mono text-[10px] tracking-[2px] text-cream/60">
            {fighter.major} · {fighter.year}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-anton text-[38px] leading-[36px] text-flame">{fighter.gpa}</Text>
          <Text className="mt-1 font-mono text-[8px] tracking-[1.6px] text-cream/50">GPA · FALLING</Text>
        </View>
      </View>

      <View className="mt-4 flex-row gap-2.5">
        <View className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
          <Text className="font-mono text-[8px] tracking-[1.6px] text-cream/50">RECORD</Text>
          <Text className="mt-1 font-anton text-2xl text-paper">{fighter.record}</Text>
        </View>
        <View className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
          <Text className="font-mono text-[8px] tracking-[1.6px] text-cream/50">FAILED</Text>
          <Text className="mt-1 font-anton text-2xl text-blood">{fighter.failed}</Text>
        </View>
      </View>

      <Text className="mt-4 font-body text-[13px] leading-5 text-cream/85">{fighter.bio}</Text>
    </View>
  );
}
