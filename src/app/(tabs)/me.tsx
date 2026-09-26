import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { BrandHeader } from "@/components/brand-header";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { SectionIntro } from "@/components/section-intro";
import { Stamp } from "@/components/stamp";
import { FighterCard } from "@/features/deck/fighter-card";
import { useProfileStore } from "@/features/profile/store";
import { profileToFighter } from "@/features/profile/to-fighter";
import { useHydrated } from "@/lib/persist";
import { entrance } from "@/theme/motion";

const RESET_ARM_MS = 3000;

/** Two-tap destructive button: first tap arms it, second tap (within 3s) fires. */
function BurnEverythingButton({ onConfirm }: { onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), RESET_ARM_MS);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <Button
      label={armed ? "TAP AGAIN TO BURN IT ALL" : "BURN EVERYTHING"}
      variant={armed ? "armed" : "danger"}
      onPress={() => {
        if (!armed) return setArmed(true);
        setArmed(false);
        onConfirm();
      }}
    />
  );
}

export default function MeScreen() {
  const hydrated = useHydrated(useProfileStore);
  const profile = useProfileStore((s) => s.profile);
  const clearProfile = useProfileStore((s) => s.clearProfile);

  const editCard = () => router.push("/card/edit");

  if (!hydrated) return <Screen>{null}</Screen>;

  if (!profile) {
    return (
      <Screen>
        <BrandHeader />
        <SectionIntro
          title="WHO ARE WE"
          accent="THROWING IN?"
          blurb="Your card goes up against the deck. Make the rage honest."
        />
        <EmptyState
          title="NO FIGHTER CARD"
          body="Name, major, GPA, the exam that broke you, and a rage bio. Saved on this phone only."
        />
        <View className="mt-6">
          <Button label="PRINT MY CARD" onPress={editCard} />
        </View>
        <Text className="mt-6 text-center font-mono text-[9px] leading-4 tracking-[1.4px] text-cream/35">
          ALL FIGHTERS ARE FICTIONAL · NO GPAS WERE HARMED
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <BrandHeader />
      <Animated.View style={entrance.rise}>
        <View>
          {/* Record is derived from bouts once Phase 4 lands. */}
          <FighterCard fighter={profileToFighter(profile, "0-0")} />
          <View className="absolute right-6 top-8">
            <Stamp label="YOUR CARD" color="match" delayMs={500} />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[entrance.rise, { animationDelay: "150ms" }]}>
        <View className="mt-6 gap-3">
          <Button label="EDIT MY CARD" onPress={editCard} />
          <BurnEverythingButton onConfirm={clearProfile} />
          <Text className="text-center font-mono text-[9px] leading-4 tracking-[1.2px] text-cream/35">
            BURNING WIPES YOUR CARD FROM THIS PHONE
          </Text>
        </View>
      </Animated.View>
    </Screen>
  );
}
