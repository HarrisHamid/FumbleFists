import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { BrandHeader } from "@/components/brand-header";
import { Screen } from "@/components/screen";
import { Stamp } from "@/components/stamp";
import { FighterCard } from "@/features/deck/fighter-card";
import { SAMPLE_FIGHTERS } from "@/features/deck/sample-fighters";
import { entrance } from "@/theme/motion";

function RageChip({ count }: { count: number }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5">
      <View className="size-1.5 rounded-full bg-blood" />
      <Text className="font-mono text-[11px] text-cream/80">{count} RAGE</Text>
    </View>
  );
}

export default function SparScreen() {
  const preview = SAMPLE_FIGHTERS[0]!;

  return (
    <Screen>
      <BrandHeader right={<RageChip count={0} />} />

      <Animated.View style={entrance.rise}>
        <View>
          <FighterCard fighter={preview} />
          <View className="absolute right-6 top-8">
            <Stamp label="SAMPLE CARD" color="match" delayMs={600} />
          </View>
        </View>
      </Animated.View>

      <Text className="mt-5 text-center font-mono text-[9px] tracking-[2px] text-cream/40">
        SWIPE DECK LANDS IN PHASE 2
      </Text>
    </Screen>
  );
}
