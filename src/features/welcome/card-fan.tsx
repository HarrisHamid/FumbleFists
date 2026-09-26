import { Text, useWindowDimensions, View } from "react-native";
import Animated, { css } from "react-native-reanimated";

import { Stamp } from "@/components/stamp";
import { springOut } from "@/theme/motion";

const dealIn = css.keyframes({
  from: { opacity: 0, transform: [{ translateY: 320 }, { scale: 0.8 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
});

// The prototype's idle "fumble": a slow, slightly drunk sway.
const fumble = css.keyframes({
  from: { transform: [{ rotate: "-1.6deg" }, { scale: 1.01 }] },
  to: { transform: [{ rotate: "1.4deg" }, { scale: 1 }] },
});

type FanCard = {
  initials: string;
  label: string;
  sub: string;
  initialsTone: string;
  rotate: number;
  /** Horizontal offset from centre, as a fraction of the fan width. */
  shift: number;
  delayMs: number;
  swayMs: number;
  featured?: boolean;
};

// Back-to-front: the featured card renders last so it sits on top.
const CARDS: FanCard[] = [
  {
    initials: "KM",
    label: "KOFI · 3.1 GPA",
    sub: "FAILED: THERMO",
    initialsTone: "text-match/40",
    rotate: -10,
    shift: -0.27,
    delayMs: 1300,
    swayMs: 3000,
  },
  {
    initials: "MV",
    label: "MARA · 4-0",
    sub: "FAILED: OCHEM",
    initialsTone: "text-blood/50",
    rotate: 9,
    shift: 0.27,
    delayMs: 1450,
    swayMs: 3400,
  },
  {
    initials: "JO",
    label: "JADE · 14-3",
    sub: "FAILED: ORGA",
    initialsTone: "text-flame/40",
    rotate: 0,
    shift: 0,
    delayMs: 1600,
    swayMs: 3800,
    featured: true,
  },
];

function MiniCard({ card, width }: { card: FanCard; width: number }) {
  return (
    <View
      className={`overflow-hidden rounded-2xl bg-card ${card.featured ? "border-2 border-flame" : "border border-white/15"}`}
      style={{ width, boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}
    >
      <View
        className="items-center justify-center bg-card-raised"
        style={{ width: "100%", aspectRatio: 4 / 5 }}
      >
        <Text
          className={`font-anton ${card.initialsTone}`}
          style={{ fontSize: width * 0.5, lineHeight: width * 0.6 }}
        >
          {card.initials}
        </Text>
      </View>
      <View className="px-3 py-2">
        <Text className="font-anton text-sm leading-[18px] text-paper">{card.label}</Text>
        <Text className="font-mono text-[8px] tracking-[1.6px] text-blood">{card.sub}</Text>
      </View>
    </View>
  );
}

/** Three fighter cards that deal in from below, fan out, then sway forever. */
export function CardFan() {
  const { width: screenWidth } = useWindowDimensions();
  const fanWidth = Math.min(screenWidth - 32, 420);
  const cardWidth = Math.min(fanWidth * 0.44, 180);
  const cardHeight = cardWidth * 1.25 + 48;

  return (
    <View style={{ width: fanWidth, height: cardHeight + 28, alignSelf: "center" }}>
      {CARDS.map((card) => (
        <View
          key={card.initials}
          style={{
            position: "absolute",
            top: card.featured ? 0 : 22,
            left: fanWidth / 2 - cardWidth / 2 + card.shift * fanWidth,
            transform: [{ rotate: `${card.rotate}deg` }],
          }}
        >
          <Animated.View
            style={{
              animationName: dealIn,
              animationDuration: "700ms",
              animationDelay: `${card.delayMs}ms`,
              animationTimingFunction: springOut,
              animationFillMode: "both",
            }}
          >
            <Animated.View
              style={{
                animationName: fumble,
                animationDuration: `${card.swayMs}ms`,
                animationDelay: `${card.delayMs + 700}ms`,
                animationIterationCount: "infinite",
                animationDirection: "alternate",
                animationTimingFunction: "ease-in-out",
              }}
            >
              <MiniCard card={card} width={cardWidth} />
              {card.featured ? (
                <View className="absolute right-2 top-3">
                  <Stamp label="SPAR" color="match" delayMs={card.delayMs + 500} />
                </View>
              ) : null}
            </Animated.View>
          </Animated.View>
        </View>
      ))}
    </View>
  );
}
