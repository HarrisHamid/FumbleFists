import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function LogoMark() {
  return (
    <View
      className="size-10 items-center justify-center rounded-md bg-flame"
      style={{ transform: [{ rotate: "-3deg" }], boxShadow: "3px 3px 0 #000" }}
    >
      <Text className="font-anton text-lg text-ink">FF</Text>
    </View>
  );
}

export function BrandHeader({ right }: { right?: ReactNode }) {
  return (
    <View className="mb-5 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2.5">
        <LogoMark />
        <View>
          <Text className="font-display text-2xl tracking-[2px] text-paper">FUMBLEFISTS</Text>
          <Text className="font-mono text-[8px] tracking-[2.2px] text-cream/50">
            SPAR CLUB · EST. FAIL
          </Text>
        </View>
      </View>
      {right}
    </View>
  );
}
