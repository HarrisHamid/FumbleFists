import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { clearMatches, loadMatches } from "@/lib/storage";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Match History — FumbleFists" },
      {
        name: "description",
        content: "Every spar you've booked since the grades came back.",
      },
      { property: "og:title", content: "Match History — FumbleFists" },
      {
        property: "og:description",
        content: "Every spar you've booked since the grades came back.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/history" }],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? loadMatches() : [],
  );

  const wipe = () => {
    clearMatches();
    setMatches([]);
  };

  return (
    <div className="min-h-screen w-full bg-ink bg-[radial-gradient(circle_at_50%_-10%,#33251a_0%,#17100a_58%)] font-body text-paper">
      <div className="mx-auto max-w-[460px] px-5 pb-14 pt-6">
        <header className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-10 -rotate-3 place-items-center rounded-md bg-flame shadow-[3px_3px_0_#000]">
              <span className="font-anton text-lg leading-none text-ink">FF</span>
            </div>
            <span className="font-display text-2xl tracking-[0.08em]">FUMBLEFISTS</span>
          </Link>
          <Link to="/spar" className="font-mono text-[10px] tracking-[0.2em] text-cream/60 hover:text-paper">
            ← BACK TO DECK
          </Link>
        </header>

        <div className="[animation:rise_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both]">
          <h1 className="font-anton text-4xl leading-[0.9] tracking-tight">
            FIGHT <span className="text-flame">LEDGER</span>
          </h1>
          <p className="mt-2 text-[13px] text-cream/75">
            {matches.length} spar{matches.length === 1 ? "" : "s"} booked since the grades came back.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-card p-8 text-center ring-1 ring-white/10 [animation:rise_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.15s_both]">
            <div className="font-anton text-2xl text-cream/60">NO FIGHTS YET</div>
            <p className="mt-2 text-[13px] text-cream/60">
              The ledger is clean. Go fail something and swipe right.
            </p>
            <Link
              to="/spar"
              className="mt-5 inline-block -rotate-1 rounded-lg bg-flame px-6 py-3 font-anton text-lg text-ink shadow-[4px_4px_0_#000]"
            >
              START SWIPING
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {matches.map((m, i) => (
                <div
                  key={m.name + m.when + i}
                  className="flex items-center justify-between rounded-2xl bg-card p-4 ring-1 ring-white/10 [animation:rise_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]"
                  style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
                >
                  <div>
                    <div className="font-anton text-lg leading-none">{m.name}</div>
                    <div className="mt-1.5 font-mono text-[9px] tracking-[0.15em] text-cream/50">
                      {m.major} · GPA {m.gpa} · FAILED {m.failed}
                    </div>
                    <div className="mt-1 font-mono text-[9px] tracking-[0.1em] text-cream/35">
                      {m.when}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="rounded border-2 border-match px-2 py-0.5 font-anton text-xs text-match">
                      SPARRED
                    </div>
                    <div className="mt-1.5 font-mono text-[9px] text-cream/40">
                      REC {m.record}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={wipe}
              className="mt-6 w-full rounded-lg bg-card py-3 font-mono text-[10px] tracking-[0.2em] text-blood ring-1 ring-white/15 transition-colors hover:bg-secondary"
            >
              BURN THE LEDGER
            </button>
          </>
        )}
      </div>
    </div>
  );
}
