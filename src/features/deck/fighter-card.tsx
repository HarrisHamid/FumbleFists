import { Image } from "expo-image";
import { useState } from "react";
import { Text, View } from "react-native";

import type { Fighter, FighterTone } from "./types";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

const toneClass: Record<FighterTone, string> = {
  flame: "text-flame/30",
  match: "text-match/30",
  blood: "text-blood/40",
  cream: "text-cream/25",
};

function PhotoPlaceholder({
  name,
  tone = "flame",
  fill,
}: {
  name: string;
  tone?: FighterTone;
  fill: boolean;
}) {
  // When filling a variable-height slot, size the initials to fit it.
  const [height, setHeight] = useState(0);
  const fontSize = fill && height ? Math.min(140, height * 0.55) : 140;

  return (
    <View
      className="items-center justify-center bg-card-raised"
      style={fill ? { flex: 1 } : { width: "100%", aspectRatio: 4 / 5 }}
      onLayout={fill ? (e) => setHeight(e.nativeEvent.layout.height) : undefined}
      accessibilityLabel={`${name}, no photo yet`}
    >
      <Text
        className={`font-anton ${toneClass[tone]}`}
        style={{ fontSize, lineHeight: fontSize * 1.2 }}
      >
        {initials(name)}
      </Text>
      <Text className="absolute bottom-3 font-mono text-[9px] tracking-[2px] text-cream/40">
        NO PHOTO YET
      </Text>
    </View>
  );
}

/**
 * A fighter's card. By default it sizes to its content (4:5 photo); with
 * `fill` it stretches to its container and the photo takes the spare height,
 * which is how the swipe deck fits it between the header and the buttons.
 */
export function FighterCard({ fighter, fill = false }: { fighter: Fighter; fill?: boolean }) {
  return (
    <View
      className={`rounded-[26px] border border-white/10 bg-card ${fill ? "p-4" : "p-5"}`}
      style={fill ? { flex: 1 } : undefined}
    >
      <View className="overflow-hidden rounded-t-[20px]" style={fill ? { flex: 1 } : undefined}>
        {fighter.photo ? (
          <Image
            source={fighter.photo}
            contentFit="cover"
            accessibilityLabel={fighter.name}
            style={fill ? { flex: 1 } : { width: "100%", aspectRatio: 4 / 5 }}
          />
        ) : (
          <PhotoPlaceholder name={fighter.name} tone={fighter.tone} fill={fill} />
        )}
      </View>

      <View className={`${fill ? "mt-3" : "mt-4"} flex-row items-end justify-between gap-2`}>
        <View className="flex-1">
          <Text
            numberOfLines={fill ? 1 : undefined}
            adjustsFontSizeToFit={fill}
            className={`font-anton text-paper ${fill ? "text-[32px] leading-[40px]" : "text-[40px] leading-[48px]"}`}
          >
            {fighter.name}
          </Text>
          <Text className="mt-1 font-mono text-[10px] tracking-[2px] text-cream/60">
            {fighter.major} · {fighter.year}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className={`font-anton text-flame ${fill ? "text-[32px] leading-[40px]" : "text-[38px] leading-[46px]"}`}
          >
            {fighter.gpa}
          </Text>
          <Text className="mt-1 font-mono text-[8px] tracking-[1.6px] text-cream/50">
            GPA · FALLING
          </Text>
        </View>
      </View>

      <View className={`${fill ? "mt-3" : "mt-4"} flex-row gap-2.5`}>
        <View className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
          <Text className="font-mono text-[8px] tracking-[1.6px] text-cream/50">RECORD</Text>
          <Text className="mt-1 font-anton text-xl leading-7 text-paper">{fighter.record}</Text>
        </View>
        <View className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
          <Text className="font-mono text-[8px] tracking-[1.6px] text-cream/50">FAILED</Text>
          <Text numberOfLines={1} className="mt-1 font-anton text-xl leading-7 text-blood">
            {fighter.failed}
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={fill ? 2 : undefined}
        className={`${fill ? "mt-3" : "mt-4"} font-body text-[13px] leading-5 text-cream/85`}
      >
        “{fighter.bio}”
      </Text>
    </View>
  );
}
