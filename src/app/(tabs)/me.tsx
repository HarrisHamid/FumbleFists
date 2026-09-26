import { Text } from "react-native";

import { BrandHeader } from "@/components/brand-header";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { SectionIntro } from "@/components/section-intro";

export default function MeScreen() {
  return (
    <Screen>
      <BrandHeader />
      <SectionIntro
        title="WHO ARE WE"
        accent="THROWING IN?"
        blurb="Your card is what other fighters swipe on. Make the rage honest."
      />
      <EmptyState
        round="PHASE 1"
        title="NO FIGHTER CARD"
        body="Sign in, confirm you're 18+, accept the sparring rules, then build your card."
      />
      <Text className="mt-6 text-center font-mono text-[9px] leading-4 tracking-[1.4px] text-cream/35">
        CONSENSUAL SPARRING ONLY · GLOVES + HEADGEAR · TAP OUT ANY TIME
      </Text>
    </Screen>
  );
}
