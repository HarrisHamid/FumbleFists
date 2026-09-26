import { Link, createFileRoute } from "@tanstack/react-router";

import fighterJade from "@/assets/fighter-jade.jpg";
import fighterKofi from "@/assets/fighter-kofi.jpg";
import fighterMara from "@/assets/fighter-mara.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FumbleFists — Failed an Exam? Throw Hands." },
      {
        name: "description",
        content:
          "The spar club for students who bombed their exams. Swipe on fellow failures, match, and blow off steam in the ring. Consensual. Supervised. Cathartic.",
      },
      { property: "og:title", content: "FumbleFists — Failed an Exam? Throw Hands." },
      {
        property: "og:description",
        content:
          "The spar club for students who bombed their exams. Swipe on fellow failures, match, and blow off steam in the ring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const STEPS = [
  {
    n: "01",
    title: "FAIL AN EXAM",
    body: "Orga. Thermo. Calc II. The worse the grade, the better the match pool.",
  },
  {
    n: "02",
    title: "SWIPE THE WOUNDED",
    body: "Browse fellow failures by major, GPA, record, and rage bio. Left to pass, right to spar.",
  },
  {
    n: "03",
    title: "THROW HANDS",
    body: "Match confirmed. Gloves on, gym booked, steam blown off. Loser buys nuggets.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-ink bg-[radial-gradient(circle_at_50%_-10%,#33251a_0%,#17100a_58%)] font-body text-paper">
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="grid size-10 -rotate-3 place-items-center rounded-md bg-flame shadow-[3px_3px_0_#000]">
            <span className="font-anton text-lg leading-none text-ink">FF</span>
          </div>
          <div className="leading-none">
            <div className="font-display text-2xl tracking-[0.08em]">FUMBLEFISTS</div>
            <div className="mt-1 font-mono text-[8px] tracking-[0.28em] text-cream/50">
              SPAR CLUB · EST. FAIL
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-4 font-mono text-[10px] tracking-[0.2em]">
          <Link to="/history" className="hidden text-cream/60 transition-colors hover:text-paper sm:inline">
            HISTORY
          </Link>
          <Link
            to="/profile"
            className="rounded-md bg-flame px-3 py-2 font-bold text-ink shadow-[3px_3px_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            JOIN THE CLUB
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-16 pt-12 md:grid-cols-2 md:pt-16">
        <div>
          <div className="inline-block -rotate-2 rounded border-2 border-blood px-3 py-1 font-anton text-sm tracking-[0.15em] text-blood [animation:stampin_0.45s_cubic-bezier(0.34,1.56,0.64,1)_0.4s_both]">
            0% PASSING · 100% PUNCHING
          </div>
          <h1 className="mt-5 text-balance font-anton text-[3.4rem] leading-[0.85] tracking-tight sm:text-7xl">
            FAILED THE EXAM?
            <br />
            <span className="text-flame">THROW HANDS.</span>
          </h1>
          <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-cream/80">
            FumbleFists matches you with other students who just bombed the same
            midterm. Swipe on their records, majors, and GPAs — then meet in the
            ring and punch the GPA grief out. Consensual. Supervised. Deeply
            cathartic.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/spar"
              className="-rotate-1 rounded-lg bg-flame px-7 py-4 font-anton text-xl tracking-wide text-ink shadow-[5px_5px_0_#000] transition-transform hover:-rotate-2 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              START SWIPING
            </Link>
            <Link
              to="/profile"
              className="rounded-lg bg-card px-6 py-4 font-mono text-[11px] tracking-[0.2em] text-paper ring-1 ring-white/15 transition-colors hover:bg-secondary"
            >
              SET UP PROFILE
            </Link>
          </div>
          <p className="mt-6 font-mono text-[9px] tracking-[0.12em] text-cream/35">
            SATIRE. ALL SPARRING IS CONSENSUAL &amp; SUPERVISED.
          </p>
        </div>

        {/* Card fan */}
        <div className="relative mx-auto h-[420px] w-full max-w-[360px]">
          <div className="absolute left-0 top-8 w-56 -rotate-[10deg] overflow-hidden rounded-2xl ring-1 ring-white/15 [animation:fumble_3s_ease-in-out_infinite_alternate]">
            <img src={fighterKofi} alt="Kofi, Mech Eng, failed Thermo" className="aspect-[4/5] w-full object-cover" width={736} height={912} />
            <div className="bg-card px-3 py-2 font-anton text-sm">KOFI · 3.1 GPA</div>
          </div>
          <div className="absolute right-0 top-8 w-56 rotate-[9deg] overflow-hidden rounded-2xl ring-1 ring-white/15 [animation:fumble_3.4s_ease-in-out_infinite_alternate]">
            <img src={fighterMara} alt="Mara, Molecular Bio, failed OChem" className="aspect-[4/5] w-full object-cover" width={736} height={912} />
            <div className="bg-card px-3 py-2 font-anton text-sm">MARA · 4-0</div>
          </div>
          <div className="absolute left-1/2 top-0 w-60 -translate-x-1/2 overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-2 ring-flame">
            <img src={fighterJade} alt="Jade, Biochem, failed Orga" className="aspect-[4/5] w-full object-cover" width={736} height={912} />
            <div className="bg-card px-3 py-2">
              <div className="font-anton text-sm">JADE · 14-3</div>
              <div className="font-mono text-[8px] tracking-[0.2em] text-blood">FAILED: ORGA</div>
            </div>
            <div className="absolute right-3 top-3 -rotate-12 rounded border-2 border-match px-2 py-0.5 font-anton text-xs text-match">
              SPAR
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="font-anton text-3xl tracking-tight sm:text-4xl">
            HOW THE CLUB WORKS
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl bg-card p-5 ring-1 ring-white/10 transition-transform hover:-translate-y-1"
              >
                <div className="font-anton text-3xl text-flame">{s.n}</div>
                <div className="mt-2 font-anton text-lg tracking-wide">{s.title}</div>
                <p className="mt-2 text-[13px] leading-snug text-cream/75">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-5 py-16 text-center">
        <h2 className="text-balance font-anton text-4xl leading-[0.9] sm:text-5xl">
          YOUR GPA IS ALREADY DEAD.
          <br />
          <span className="text-match">YOUR HANDS AREN'T.</span>
        </h2>
        <Link
          to="/spar"
          className="mt-8 inline-block -rotate-1 rounded-lg bg-flame px-8 py-4 font-anton text-xl tracking-wide text-ink shadow-[5px_5px_0_#000] transition-transform hover:-rotate-2 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          FIND A SPARRING PARTNER
        </Link>
      </section>

      <footer className="border-t border-white/10 py-6 text-center font-mono text-[9px] tracking-[0.15em] text-cream/35">
        FUMBLEFISTS · EST. FAIL · SATIRE — ALL SPARRING IS CONSENSUAL &amp; SUPERVISED
      </footer>
    </div>
  );
}
