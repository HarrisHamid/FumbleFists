import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { entrance } from "@/theme/motion";

export function EmptyState({
  title,
  body,
  round,
}: {
  title: string;
  body: string;
  round?: string;
}) {
  return (
    <Animated.View style={[entrance.rise, { animationDelay: "150ms" }]}>
      <View className="mt-6 items-center rounded-2xl border border-white/10 bg-card p-8">
        {round ? (
          <Text className="mb-3 font-mono text-[9px] tracking-[2px] text-flame">{round}</Text>
        ) : null}
        <Text className="text-center font-anton text-2xl text-cream/60">{title}</Text>
        <Text className="mt-2 text-center font-body text-[13px] leading-5 text-cream/60">
          {body}
        </Text>
      </View>
    </Animated.View>
  );
}
