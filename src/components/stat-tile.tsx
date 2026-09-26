import { Text, View } from "react-native";

const valueTone = { paper: "text-paper", match: "text-match", blood: "text-blood", flame: "text-flame" } as const;

export function StatTile({
  label,
  value,
  tone = "paper",
}: {
  label: string;
  value: string;
  tone?: keyof typeof valueTone;
}) {
  return (
    <View className="flex-1 rounded-xl border border-white/10 bg-card px-3 py-3">
      <Text className="font-mono text-[8px] tracking-[1.6px] text-cream/50">{label}</Text>
      <Text className={`mt-1 font-anton text-xl ${valueTone[tone]}`}>{value}</Text>
    </View>
  );
}
