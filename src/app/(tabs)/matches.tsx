import { BrandHeader } from "@/components/brand-header";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { SectionIntro } from "@/components/section-intro";

export default function MatchesScreen() {
  return (
    <Screen>
      <BrandHeader />
      <SectionIntro
        title="YOUR"
        accent="CORNER"
        blurb="Mutual right-swipes land here. Talk terms, set rules, pick a gym."
      />
      <EmptyState
        round="PHASE 3"
        title="NO MATCHES YET"
        body="Swipe right on someone who swipes right back and the chat opens here."
      />
    </Screen>
  );
}
