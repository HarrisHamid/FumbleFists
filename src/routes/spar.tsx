import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import fighterJade from "@/assets/fighter-jade.jpg";
import fighterKofi from "@/assets/fighter-kofi.jpg";
import fighterMara from "@/assets/fighter-mara.jpg";
import fighterMarcus from "@/assets/fighter-marcus.jpg";

export const Route = createFileRoute("/spar")({
  head: () => ({
    meta: [
      { title: "FumbleFists — Swipe to Spar" },
      {
        name: "description",
        content:
          "Failed an exam? Match with another student who did too and throw hands (consensually). Records, majors, GPAs, rage bios.",
      },
      { property: "og:title", content: "FumbleFists — Swipe to Spar" },
      {
        property: "og:description",
        content:
          "Failed an exam? Match with another student who did too and throw hands (consensually). Records, majors, GPAs, rage bios.",
      },
    ],
  }),
  component: SparPage,
});

type Fighter = {
  name: string;
  major: string;
  year: string;
  gpa: string;
  record: string;
  failed: string;
  bio: string;
  image: string;
};

const FIGHTERS: Fighter[] = [
  {
    name: "JADE OKAFOR",
    major: "BIOCHEM",
    year: "CLASS OF 27",
    gpa: "2.1",
    record: "14-3",
    failed: "ORGA",
    bio: '"Just failed ORGA Chemistry. I will not be talking about it. I will be THROWING PUNCHES at it instead. You bring gloves, I bring the damage."',
    image: fighterJade,
  },
  {
    name: "KOFI MENSAH",
    major: "MECH ENG",
    year: "CLASS OF 26",
    gpa: "3.1",
    record: "1-2",
    failed: "THERMO",
    bio: '"Entropy is chaos. So am I after an F. Light rounds, heavy heart. Loser buys the dining hall nuggets."',
    image: fighterKofi,
  },
  {
    name: "MARA VOSS",
    major: "MOLECULAR BIO",
    year: "CLASS OF 28",
    gpa: "3.7",
    record: "4-0",
    failed: "OCHEM",
    bio: '"UAC doesn\'t break bonds. I do. Gym opens 6am, loser buys protein. Undefeated and unmedicated."',
    image: fighterMara,
  },
];

const SWIPE_THRESHOLD = 90;

function SparPage() {
  const [deckIndex, setDeckIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, active: false });
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);
  const [matches, setMatches] = useState<Fighter[]>([]);
  const startX = useRef(0);

  const current = FIGHTERS[deckIndex % FIGHTERS.length]!;
  const next = FIGHTERS[(deckIndex + 1) % FIGHTERS.length]!;
  const rotation = drag.x / 18;

  const fling = (dir: "left" | "right") => {
    if (leaving) return;
    setLeaving(dir);
    if (dir === "right") {
      setMatches((m) => [...m, current]);
    }
    window.setTimeout(() => {
      setDeckIndex((i) => i + 1);
      setDrag({ x: 0, active: false });
      setLeaving(null);
    }, 320);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    setDrag({ x: 0, active: true });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.active) return;
    setDrag({ x: e.clientX - startX.current, active: true });
  };

  const onPointerUp = () => {
    if (!drag.active) return;
    if (drag.x > SWIPE_THRESHOLD) fling("right");
    else if (drag.x < -SWIPE_THRESHOLD) fling("left");
    else setDrag({ x: 0, active: false });
  };

  const lastMatch = matches[matches.length - 1];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-ink bg-[radial-gradient(circle_at_50%_-10%,#33251a_0%,#17100a_58%)] font-body text-paper">
      <div className="mx-auto flex min-h-screen max-w-[420px] flex-col px-4 pb-14 pt-6">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-10 -rotate-3 place-items-center rounded-md bg-flame shadow-[3px_3px_0_#000]">
              <span className="font-anton text-lg leading-none text-ink">FF</span>
            </div>
            <div className="leading-none">
              <div className="font-display text-2xl tracking-[0.08em] text-paper">
                FUMBLEFISTS
              </div>
              <div className="mt-1 font-mono text-[8px] tracking-[0.28em] text-cream/50">
                SPAR CLUB · EST. FAIL
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 font-mono text-[11px] text-cream/80 ring-1 ring-white/10">
            <span className="size-1.5 animate-pulse rounded-full bg-blood" />
            {matches.length} RAGE
          </div>
        </header>

        {/* Swipe deck */}
        <div className="relative h-[468px] touch-none select-none">
          <div className="absolute inset-x-0 bottom-0 h-[430px] rounded-[24px] bg-[#150f09] ring-1 ring-white/10" />
          <div className="absolute inset-x-0 bottom-7 h-[444px] rounded-[24px] bg-[#1a130c] ring-1 ring-white/10" />

          {/* Next card peeking */}
          <div className="absolute inset-0 scale-[0.97] rounded-[26px] bg-card p-5 opacity-60 ring-1 ring-white/10">
            <div className="overflow-hidden rounded-t-[20px]">
              <img
                src={next.image}
                alt={next.name}
                loading="lazy"
                width={736}
                height={912}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>

          {/* Front card */}
          <div
            key={deckIndex}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute inset-0 flex cursor-grab flex-col rounded-[26px] bg-card p-5 ring-1 ring-white/10 active:cursor-grabbing"
            style={{
              transform: leaving
                ? `translateX(${leaving === "right" ? 520 : -520}px) rotate(${leaving === "right" ? 24 : -24}deg)`
                : `translateX(${drag.x}px) rotate(${rotation}deg)`,
              transition:
                drag.active && !leaving
                  ? "none"
                  : "transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="overflow-hidden rounded-t-[20px]">
              <img
                src={current.image}
                alt={current.name}
                width={736}
                height={912}
                draggable={false}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            {/* Drag stamps */}
            {drag.x > 30 && !leaving && (
              <div className="absolute left-5 top-8 -rotate-12 rounded border-2 border-match px-3 py-1 font-anton text-lg tracking-[0.12em] text-match">
                SPAR
              </div>
            )}
            {drag.x < -30 && !leaving && (
              <div className="absolute right-5 top-8 rotate-12 rounded border-2 border-blood px-3 py-1 font-anton text-lg tracking-[0.12em] text-blood">
                NOPE
              </div>
            )}

            <div className="mt-4 flex items-end justify-between gap-2">
              <div>
                <h2 className="text-balance font-anton text-[2.6rem] leading-[0.82] tracking-tight text-paper">
                  {current.name}
                </h2>
                <p className="mt-1.5 font-mono text-[10px] tracking-[0.2em] text-cream/60">
                  {current.major} · {current.year}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-anton text-[2.4rem] leading-[0.8] text-flame">
                  {current.gpa}
                </div>
                <div className="mt-1 font-mono text-[8px] tracking-[0.2em] text-cream/50">
                  GPA · FALLING
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2.5">
              <div className="flex-1 rounded-lg bg-black/30 px-3 py-2.5 ring-1 ring-white/10">
                <div className="font-mono text-[8px] tracking-[0.2em] text-cream/50">
                  RECORD
                </div>
                <div className="mt-1 font-anton text-2xl leading-none text-paper">
                  {current.record}
                </div>
              </div>
              <div className="flex-1 rounded-lg bg-black/30 px-3 py-2.5 ring-1 ring-white/10">
                <div className="font-mono text-[8px] tracking-[0.2em] text-cream/50">
                  FAILED
                </div>
                <div className="mt-1 font-anton text-2xl leading-none text-blood">
                  {current.failed}
                </div>
              </div>
            </div>

            <p className="mt-4 text-pretty font-body text-[13px] leading-snug text-cream/85">
              {current.bio}
            </p>

            <div className="absolute bottom-24 right-5 -rotate-12 rounded border-2 border-flame px-3 py-1 font-anton text-lg tracking-[0.12em] text-flame [animation:stampin_0.45s_cubic-bezier(0.34,1.56,0.64,1)_0.6s_both]">
              SPAR WANTED
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-1/2 text-center [animation:rise_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.15s_both]">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-cream/55 ring-1 ring-white/10">
              SWIPE TO SPAR
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex items-center justify-center gap-6 [animation:rise_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.3s_both]">
          <button
            onClick={() => fling("left")}
            className="grid size-14 place-items-center rounded-full bg-card text-blood ring-1 ring-white/15 transition-transform duration-200 active:scale-90"
          >
            <span className="font-anton text-2xl leading-none">NO</span>
            <span className="mt-0.5 font-mono text-[8px] tracking-[0.15em] text-cream/40">
              PASS
            </span>
          </button>
          <button
            onClick={() => fling("right")}
            className="grid size-20 -rotate-2 place-items-center rounded-full bg-flame shadow-[0_0_34px_rgba(255,77,36,0.45)] ring-1 ring-black/30 transition-transform duration-200 active:scale-95"
          >
            <span className="font-anton text-3xl leading-none text-ink">SPAR</span>
            <span className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-ink/60">
              MATCH
            </span>
          </button>
          <button
            onClick={() => setDeckIndex((i) => Math.max(0, i - 1))}
            className="grid size-14 place-items-center rounded-full bg-card text-paper ring-1 ring-white/15 transition-transform duration-200 active:scale-90"
          >
            <span className="font-anton text-2xl leading-none">?</span>
            <span className="mt-0.5 font-mono text-[8px] tracking-[0.15em] text-cream/40">
              REPLAY
            </span>
          </button>
        </div>

        {/* Match + stats */}
        <div className="mt-auto pt-6 [animation:rise_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.45s_both]">
          {lastMatch && (
            <div
              key={lastMatch.name + matches.length}
              className="-rotate-1 rounded-2xl bg-match p-4 text-ink shadow-[4px_4px_0_#000] ring-1 ring-black/20 [animation:matchpop_0.45s_cubic-bezier(0.34,1.56,0.64,1)_both]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold tracking-[0.22em]">
                  MATCH CONFIRMED
                </span>
                <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] tracking-[0.15em] text-match">
                  TONIGHT · 9PM
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                <img
                  src={fighterMarcus}
                  alt="Your sparring partner"
                  loading="lazy"
                  width={816}
                  height={816}
                  className="size-12 rounded-full object-cover"
                />
                <div className="leading-tight">
                  <div className="font-anton text-lg leading-none">
                    {lastMatch.name.split(" ")[0]} · {lastMatch.gpa} GPA
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-[0.05em] text-ink/70">
                    GYM 2 · gloves up in 6
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 rounded-xl bg-card px-3 py-3 ring-1 ring-white/10">
              <div className="font-mono text-[8px] tracking-[0.2em] text-cream/50">
                YOUR RECORD
              </div>
              <div className="mt-1 font-anton text-xl text-paper">9-4</div>
            </div>
            <div className="flex-1 rounded-xl bg-card px-3 py-3 ring-1 ring-white/10">
              <div className="font-mono text-[8px] tracking-[0.2em] text-cream/50">
                RAGE STREAK
              </div>
              <div className="mt-1 font-anton text-xl text-match">5</div>
            </div>
            <div className="flex-1 rounded-xl bg-card px-3 py-3 ring-1 ring-white/10">
              <div className="font-mono text-[8px] tracking-[0.2em] text-cream/50">
                LAST FAIL
              </div>
              <div className="mt-1 font-anton text-xl text-blood">CALC II</div>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[9px] tracking-[0.12em] text-cream/35">
            FUMBLEFISTS IS SATIRE — ALL SPARRING IS CONSENSUAL &amp; SUPERVISED.
          </p>
        </div>
      </div>
    </div>
  );
}
