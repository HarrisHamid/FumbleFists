import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const tones = {
  match: { band: "bg-match", text: "text-ink" },
  flame: { band: "bg-flame", text: "text-ink" },
} as const;

/**
 * Endless "caution tape" ticker. Two copies of the text sit side by side and
 * the row slides by exactly one copy's width, so the loop is seamless.
 */
export function Marquee({
  text,
  tone = "match",
  reverse = false,
  pixelsPerSecond = 45,
}: {
  text: string;
  tone?: keyof typeof tones;
  reverse?: boolean;
  pixelsPerSecond?: number;
}) {
  const [segmentWidth, setSegmentWidth] = useState(0);
  const offset = useSharedValue(0);

  useEffect(() => {
    if (!segmentWidth) return;
    const from = reverse ? -segmentWidth : 0;
    const to = reverse ? 0 : -segmentWidth;
    offset.set(from);
    offset.set(
      withRepeat(
        withTiming(to, {
          duration: (segmentWidth / pixelsPerSecond) * 1000,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(offset);
  }, [segmentWidth, reverse, pixelsPerSecond, offset]);

  const slide = useAnimatedStyle(() => ({ transform: [{ translateX: offset.get() }] }));

  const segment = `${text}  ✦  `.repeat(4);
  const { band, text: textTone } = tones[tone];

  return (
    <View className={`overflow-hidden border-y-2 border-ink py-1.5 ${band}`}>
      {/* Wide fixed-width row so the text is never wrapped to the screen width. */}
      <Animated.View style={[{ flexDirection: "row", width: 10000 }, slide]}>
        <Text
          numberOfLines={1}
          onLayout={(e) => setSegmentWidth(e.nativeEvent.layout.width)}
          className={`font-anton text-lg tracking-[2px] ${textTone}`}
        >
          {segment}
        </Text>
        <Text numberOfLines={1} className={`font-anton text-lg tracking-[2px] ${textTone}`}>
          {segment}
        </Text>
      </Animated.View>
    </View>
  );
}
