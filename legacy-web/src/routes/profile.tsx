import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { loadProfile, saveProfile } from "@/lib/storage";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Set Up Your Fighter Profile — FumbleFists" },
      {
        name: "description",
        content:
          "Register your record, major, GPA, and the exam that broke you. Then get matched.",
      },
      { property: "og:title", content: "Set Up Your Fighter Profile — FumbleFists" },
      {
        property: "og:description",
        content: "Register your record, major, GPA, and the exam that broke you.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/profile" }],
  }),
  component: ProfilePage,
});

const inputCls =
  "w-full rounded-lg bg-black/30 px-3 py-3 font-body text-sm text-paper ring-1 ring-white/15 placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-flame";

function ProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    const existing = typeof window !== "undefined" ? loadProfile() : null;
    return (
      existing ?? {
        name: "",
        major: "",
        year: "CLASS OF 27",
        gpa: "",
        failed: "",
        bio: "",
      }
    );
  });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({ ...form, name: form.name.toUpperCase(), major: form.major.toUpperCase(), failed: form.failed.toUpperCase() });
    setSaved(true);
    window.setTimeout(() => navigate({ to: "/spar" }), 900);
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
            SKIP →
          </Link>
        </header>

        <div className="[animation:rise_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both]">
          <div className="inline-block -rotate-2 rounded border-2 border-flame px-3 py-1 font-anton text-xs tracking-[0.15em] text-flame">
            NEW FIGHTER INTAKE
          </div>
          <h1 className="mt-4 font-anton text-4xl leading-[0.9] tracking-tight">
            WHO ARE WE
            <br />
            <span className="text-flame">THROWING IN?</span>
          </h1>
          <p className="mt-3 text-[13px] leading-snug text-cream/75">
            Your card is what other failures swipe on. Make the rage honest.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-7 space-y-4 rounded-2xl bg-card p-5 ring-1 ring-white/10 [animation:rise_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.15s_both]"
        >
          <div>
            <label className="mb-1.5 block font-mono text-[9px] tracking-[0.22em] text-cream/50">
              FIGHTER NAME
            </label>
            <input required value={form.name} onChange={set("name")} placeholder="e.g. Alex Rivera" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.22em] text-cream/50">
                MAJOR
              </label>
              <input required value={form.major} onChange={set("major")} placeholder="Comp Sci" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.22em] text-cream/50">
                CLASS
              </label>
              <select value={form.year} onChange={set("year")} className={inputCls}>
                <option>CLASS OF 26</option>
                <option>CLASS OF 27</option>
                <option>CLASS OF 28</option>
                <option>CLASS OF 29</option>
                <option>GRAD STUDENT</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.22em] text-cream/50">
                GPA (FALLING)
              </label>
              <input required value={form.gpa} onChange={set("gpa")} placeholder="2.4" inputMode="decimal" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.22em] text-cream/50">
                EXAM YOU FAILED
              </label>
              <input required value={form.failed} onChange={set("failed")} placeholder="CALC II" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[9px] tracking-[0.22em] text-cream/50">
              RAGE BIO
            </label>
            <textarea
              required
              value={form.bio}
              onChange={set("bio")}
              rows={3}
              placeholder="Channel the F. What happened, and what are you going to punch about it?"
              className={inputCls + " resize-none"}
            />
          </div>
          <button
            type="submit"
            className="w-full -rotate-1 rounded-lg bg-flame py-4 font-anton text-xl tracking-wide text-ink shadow-[5px_5px_0_#000] transition-transform hover:-rotate-2 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {saved ? "CARD PRINTED ✓" : "PRINT MY CARD"}
          </button>
          <p className="text-center font-mono text-[9px] tracking-[0.12em] text-cream/35">
            STORED ON THIS DEVICE ONLY · SATIRE · CONSENSUAL SPARRING ONLY
          </p>
        </form>
      </div>
    </div>
  );
}
