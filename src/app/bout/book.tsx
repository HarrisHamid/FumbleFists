import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Stamp } from "@/components/stamp";
import { bookBout } from "@/features/bouts/actions";
import { WHEN_OPTIONS, WHERE_OPTIONS } from "@/features/bouts/lines";
import { ROSTER_BY_ID } from "@/features/deck/roster";
import { haptics } from "@/lib/haptics";
import { entrance } from "@/theme/motion";
import { colors } from "@/theme/tokens";

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`rounded-full border px-3.5 py-2.5 ${selected ? "border-flame bg-flame" : "border-white/15 bg-black/30"}`}
    >
      <Text
        className={`font-mono text-[11px] tracking-[1.4px] ${selected ? "text-ink" : "text-cream/75"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const CUSTOM = "__custom__";

export default function BookBoutScreen() {
  const { fighterId } = useLocalSearchParams<{ fighterId: string }>();
  const fighter = ROSTER_BY_ID[fighterId ?? ""];
  const insets = useSafeAreaInsets();

  const [when, setWhen] = useState(WHEN_OPTIONS[0]!);
  const [where, setWhere] = useState(WHERE_OPTIONS[0]!);
  const [customWhere, setCustomWhere] = useState("");

  const close = () => (router.canGoBack() ? router.back() : router.replace("/bouts"));

  if (!fighter) {
    return (
      <View className="flex-1 items-center justify-center bg-ink">
        <Text className="font-anton text-2xl text-cream/60">FIGHTER NOT FOUND</Text>
      </View>
    );
  }

  const place = where === CUSTOM ? customWhere.trim().toUpperCase() : where;
  const canBook = place.length > 0;

  const lockIn = () => {
    if (!canBook) return;
    haptics.success();
    bookBout(fighter.id, when, place);
    close();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-ink"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 20 : insets.top + 12,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ width: "100%", maxWidth: 440, alignSelf: "center" }}>
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable onPress={close} accessibilityRole="button" hitSlop={12}>
              <Text className="font-mono text-[10px] tracking-[2px] text-cream/60">← CANCEL</Text>
            </Pressable>
            <Stamp label="BOUT CONTRACT" color="flame" delayMs={200} />
          </View>

          <Animated.View style={entrance.rise}>
            <Text className="font-anton text-4xl leading-[44px] text-paper">
              YOU VS{"\n"}
              <Text className="text-flame">{fighter.name}</Text>
            </Text>
            <Text className="mt-2 font-mono text-[10px] tracking-[1.6px] text-cream/50">
              THEIR RECORD {fighter.record} · FAILED {fighter.failed}
            </Text>
          </Animated.View>

          <Animated.View style={[entrance.rise, { animationDelay: "120ms" }]}>
            <View className="mt-7 gap-6 rounded-2xl border border-white/10 bg-card p-5">
              <View>
                <Text className="mb-2.5 font-mono text-[9px] tracking-[2px] text-cream/50">
                  WHEN
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {WHEN_OPTIONS.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      selected={when === option}
                      onPress={() => {
                        haptics.tick();
                        setWhen(option);
                      }}
                    />
                  ))}
                </View>
              </View>

              <View>
                <Text className="mb-2.5 font-mono text-[9px] tracking-[2px] text-cream/50">
                  WHERE
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {WHERE_OPTIONS.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      selected={where === option}
                      onPress={() => {
                        haptics.tick();
                        setWhere(option);
                      }}
                    />
                  ))}
                  <Chip
                    label="SOMEWHERE ELSE"
                    selected={where === CUSTOM}
                    onPress={() => {
                      haptics.tick();
                      setWhere(CUSTOM);
                    }}
                  />
                </View>
                {where === CUSTOM ? (
                  <TextInput
                    value={customWhere}
                    onChangeText={setCustomWhere}
                    autoFocus
                    maxLength={40}
                    placeholder="e.g. Boxing club on 5th"
                    placeholderTextColor={`${colors.cream}4d`}
                    selectionColor={colors.flame}
                    accessibilityLabel="Custom location"
                    className="mt-3 rounded-lg border border-white/15 bg-black/30 px-3 py-3 font-body text-sm text-paper"
                  />
                ) : null}
              </View>

              <View className="rounded-lg border border-match/30 bg-match/10 px-3 py-2.5">
                <Text className="font-mono text-[9px] leading-4 tracking-[1.2px] text-match">
                  HOUSE RULES: PUBLIC PLACE, SOMEONE REFEREES, GLOVES + HEADGEAR, TAP OUT ANY TIME.
                </Text>
              </View>

              <Button label="LOCK IT IN" onPress={lockIn} disabled={!canBook} />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
