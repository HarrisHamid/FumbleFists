import { Pressable, Text } from "react-native";

const variants = {
  primary: {
    box: "bg-flame",
    text: "font-anton text-xl text-ink",
    shadow: "5px 5px 0 #000",
    tilt: -1,
  },
  secondary: {
    box: "border border-white/15 bg-card",
    text: "font-mono text-[11px] tracking-[2px] text-paper",
    shadow: undefined,
    tilt: 0,
  },
  danger: {
    box: "border border-white/15 bg-card",
    text: "font-mono text-[11px] tracking-[2px] text-blood",
    shadow: undefined,
    tilt: 0,
  },
  armed: {
    box: "bg-blood",
    text: "font-anton text-lg text-paper",
    shadow: "4px 4px 0 #000",
    tilt: 1,
  },
} as const;

export type ButtonVariant = keyof typeof variants;

/** Chunky poster-style button: tilted, hard drop shadow that "presses" flat. */
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}) {
  const v = variants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`items-center rounded-lg px-6 py-4 ${v.box} ${disabled ? "opacity-50" : ""}`}
      style={({ pressed }) => ({
        boxShadow: pressed ? undefined : v.shadow,
        transform: [
          { rotate: `${v.tilt}deg` },
          { translateX: pressed && v.shadow ? 3 : 0 },
          { translateY: pressed && v.shadow ? 3 : 0 },
          { scale: pressed && !v.shadow ? 0.98 : 1 },
        ],
      })}
    >
      <Text className={v.text}>{label}</Text>
    </Pressable>
  );
}
