import { css, cubicBezier } from "react-native-reanimated";

/**
 * Brand motion, ported from the prototype's CSS keyframes. Use with an
 * Animated component's style, e.g.
 *   <Animated.View style={[entrance.rise, { animationDelay: "150ms" }]} />
 */
export const springOut = cubicBezier(0.34, 1.56, 0.64, 1);

const rise = css.keyframes({
  from: { opacity: 0, transform: [{ translateY: 22 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
});

const stampIn = css.keyframes({
  from: { opacity: 0, transform: [{ scale: 1.7 }, { rotate: "-14deg" }] },
  to: { opacity: 1, transform: [{ scale: 0.94 }, { rotate: "-12deg" }] },
});

const matchPop = css.keyframes({
  from: { opacity: 0, transform: [{ scale: 0.6 }, { rotate: "4deg" }] },
  to: { opacity: 1, transform: [{ scale: 1 }, { rotate: "-1deg" }] },
});

export const entrance = css.create({
  rise: {
    animationName: rise,
    animationDuration: "500ms",
    animationTimingFunction: springOut,
    animationFillMode: "both",
  },
  stampIn: {
    animationName: stampIn,
    animationDuration: "450ms",
    animationTimingFunction: springOut,
    animationFillMode: "both",
  },
  matchPop: {
    animationName: matchPop,
    animationDuration: "450ms",
    animationTimingFunction: springOut,
    animationFillMode: "both",
  },
});
