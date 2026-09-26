import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { entrance } from "@/theme/motion";

/** Big two-tone Anton headline + one-line blurb, used at the top of each tab. */
export function SectionIntro({
  title,
  accent,
  blurb,
}: {
  title: string;
  accent: string;
  blurb: string;
}) {
  return (
    <Animated.View style={entrance.rise}>
      <View>
        <Text className="font-anton text-4xl leading-[44px] text-paper">
          {title} <Text className="text-flame">{accent}</Text>
        </Text>
        <Text className="mt-2 font-body text-[13px] leading-5 text-cream/75">{blurb}</Text>
      </View>
    </Animated.View>
  );
}
