import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { BrandHeader } from "@/components/brand-header";
import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { Stamp } from "@/components/stamp";
import { recordOf, useBoutsStore } from "@/features/bouts/store";
import { FighterCard } from "@/features/deck/fighter-card";
import { useProfileStore } from "@/features/profile/store";
import { profileToFighter } from "@/features/profile/to-fighter";
import { burnEverything } from "@/features/reset";
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
  const profile = useProfileStore((s) => s.profile);
  const record = useBoutsStore((s) => recordOf(s.bouts));

  const editCard = () => router.push("/card/edit");

  // The tabs only exist once a card does (see the root layout); this covers
  // the moment between burning the card and returning to the landing page.
  if (!profile) return null;

  return (
    <Screen>
      <BrandHeader />
      <Animated.View style={entrance.rise}>
        <View>
          <FighterCard fighter={profileToFighter(profile, record)} />
          <View className="absolute right-6 top-8">
            <Stamp label="YOUR CARD" color="match" delayMs={500} />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[entrance.rise, { animationDelay: "150ms" }]}>
        <View className="mt-6 gap-3">
          <Button label="EDIT MY CARD" onPress={editCard} />
          <BurnEverythingButton onConfirm={burnEverything} />
          <Text className="text-center font-mono text-[9px] leading-4 tracking-[1.2px] text-cream/35">
            BURNING WIPES YOUR CARD, MATCHES AND DECK FROM THIS PHONE
          </Text>
        </View>
      </Animated.View>
    </Screen>
  );
}
