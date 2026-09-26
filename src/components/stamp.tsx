import { Text } from "react-native";
import Animated from "react-native-reanimated";

import { entrance } from "@/theme/motion";

const tone = {
  flame: "border-flame text-flame",
  match: "border-match text-match",
  blood: "border-blood text-blood",
} as const;

/** Rubber-stamp label ("SPAR", "NOPE", "SPAR WANTED") that slams in on mount. */
export function Stamp({
  label,
  color = "flame",
  delayMs = 0,
}: {
  label: string;
  color?: keyof typeof tone;
  delayMs?: number;
}) {
  const [border, text] = tone[color].split(" ");
  return (
    <Animated.View
      style={[entrance.stampIn, { animationDelay: `${delayMs}ms`, alignSelf: "flex-start" }]}
    >
      <Text className={`rounded border-2 px-3 py-1 font-anton text-lg tracking-[2px] ${border} ${text}`}>
        {label}
      </Text>
    </Animated.View>
  );
}
