import type { Metadata } from "next";
import Link from "next/link";
import Background from "@/components/Background";
import PodiumReveal, { type PodiumEntry } from "@/components/PodiumReveal";
import { PRIZES } from "@/lib/brief";
import { loadAdminPairs } from "@/lib/db";

export const metadata: Metadata = {
  title: "Podio · Hagenthon",
  description: "Il podio dell'Hagenthon: i primi 3 gruppi e i relativi premi.",
};

// I dati dipendono dal DB: niente cache statica.
export const dynamic = "force-dynamic";

/** Totale coppia = somma dei tre voti (agentico + giuria + speech), i mancanti valgono 0. */
function total(p: {
  voteAgentic: number | null;
  voteJury: number | null;
  voteSpeech: number | null;
}): number {
  return (p.voteAgentic ?? 0) + (p.voteJury ?? 0) + (p.voteSpeech ?? 0);
}

export default function PodioPage() {
  // Primi 3 per somma dei tre voti.
  const top3 = loadAdminPairs()
    .filter((p) => total(p) > 0)
    .sort((a, b) => total(b) - total(a))
    .slice(0, 3);

  const entries: PodiumEntry[] = top3.map((p, i) => {
    const prize = PRIZES[i];
    return {
      rank: (i + 1) as 1 | 2 | 3,
      members: p.members,
      prizeLabel: prize.label,
      prizeAmount: prize.amount,
      prizeNote: prize.note,
    };
  });

  return (
    <>
      <Background intensity={1.25} />
      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <span className="text-base">{"←"}</span>
            Estrazione
          </Link>
          <span className="font-display text-xl font-bold tracking-tight">
            Hagenthon
            <span className="acn-mark ml-[2px]">{">"}</span>
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accenture-purpleLight">
            Hagenthon
          </div>
          <h1 className="mt-3 mb-10 font-display text-4xl font-black leading-none sm:text-6xl">
            <span className="text-gradient-anim animate-shimmer">Il Podio</span>
          </h1>

          {entries.length < 3 ? (
            <p className="mt-8 text-white/40">
              Servono almeno 3 coppie con valutazione per comporre il podio.
            </p>
          ) : (
            <PodiumReveal entries={entries} />
          )}
        </div>

        <footer className="mt-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/25">
          <span>Hagenthon</span>
          <span className="text-accenture-purple">{">"}</span>
          <span>Accenture Application Engineering</span>
        </footer>
      </main>
    </>
  );
}
