import type { ComponentProps } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { colors } from "@/theme/tokens";

export function FieldLabel({ label }: { label: string }) {
  return (
    <Text className="mb-1.5 font-mono text-[9px] tracking-[2px] text-cream/50" numberOfLines={1}>
      {label}
    </Text>
  );
}

type FieldProps = { label: string; error?: string } & Pick<
  ComponentProps<typeof TextInput>,
  | "value"
  | "onChangeText"
  | "placeholder"
  | "keyboardType"
  | "autoCapitalize"
  | "multiline"
  | "maxLength"
  | "returnKeyType"
>;

export function Field({ label, error, multiline, ...input }: FieldProps) {
  return (
    <View className="flex-1">
      <FieldLabel label={label} />
      <TextInput
        {...input}
        multiline={multiline}
        accessibilityLabel={label}
        placeholderTextColor={`${colors.cream}4d`}
        selectionColor={colors.flame}
        className={`rounded-lg border bg-black/30 px-3 py-3 font-body text-sm text-paper ${
          error ? "border-blood" : "border-white/15"
        }`}
        style={multiline ? { minHeight: 88, textAlignVertical: "top" } : undefined}
      />
      {error ? <Text className="mt-1 font-mono text-[9px] text-blood">{error}</Text> : null}
    </View>
  );
}

export function ChipSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View>
      <FieldLabel label={label} />
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(option)}
              className={`rounded-full border px-3 py-2 ${
                selected ? "border-flame bg-flame" : "border-white/15 bg-black/30"
              }`}
            >
              <Text
                className={`font-mono text-[10px] tracking-[1.4px] ${
                  selected ? "text-ink" : "text-cream/70"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
