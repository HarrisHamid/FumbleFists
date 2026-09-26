import { View } from "react-native";

import { BrandHeader } from "@/components/brand-header";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { SectionIntro } from "@/components/section-intro";
import { StatTile } from "@/components/stat-tile";

export default function BoutsScreen() {
  return (
    <Screen>
      <BrandHeader />
      <SectionIntro
        title="FIGHT"
        accent="LEDGER"
        blurb="Scheduled spars and results. A result only counts when both fighters confirm it."
      />
      <View className="mt-6 flex-row gap-2">
        <StatTile label="RECORD" value="0-0" />
        <StatTile label="STREAK" value="—" tone="match" />
        <StatTile label="LAST FAIL" value="—" tone="blood" />
      </View>
      <EmptyState
        round="PHASE 4"
        title="NO BOUTS BOOKED"
        body="Propose a time and place from a match chat. Both of you confirm before it's on."
      />
    </Screen>
  );
}
