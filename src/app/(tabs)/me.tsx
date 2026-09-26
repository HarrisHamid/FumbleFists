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
        blurb="Your card goes up against the deck. Make the rage honest."
      />
      <EmptyState
        round="PHASE 1"
        title="NO FIGHTER CARD"
        body="Name, major, GPA, the exam that broke you, and a rage bio. Saved on this phone only."
      />
      <Text className="mt-6 text-center font-mono text-[9px] leading-4 tracking-[1.4px] text-cream/35">
        ALL FIGHTERS ARE FICTIONAL · NO GPAS WERE HARMED
      </Text>
    </Screen>
  );
}
