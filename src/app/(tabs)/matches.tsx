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
        blurb="Fighters who swiped back land here. Talk trash, set terms, book the bout."
      />
      <EmptyState
        round="PHASE 3"
        title="NO MATCHES YET"
        body="Swipe right. If they swipe back, the trash talk opens here."
      />
    </Screen>
  );
}
