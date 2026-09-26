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
        blurb="Booked bouts and results. Every win, loss and fumble goes on the ledger."
      />
      <View className="mt-6 flex-row gap-2">
        <StatTile label="RECORD" value="0-0" />
        <StatTile label="STREAK" value="—" tone="match" />
        <StatTile label="LAST FAIL" value="—" tone="blood" />
      </View>
      <EmptyState
        round="PHASE 4"
        title="NO BOUTS BOOKED"
        body="Book a bout from a match chat, then step in the ring to settle it."
      />
    </Screen>
  );
}
