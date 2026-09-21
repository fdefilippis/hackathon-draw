import type { Metadata } from "next";
import Link from "next/link";
import Background from "@/components/Background";
import Top5Reveal from "@/components/Top5Reveal";
import { loadAdminPairs } from "@/lib/db";

export const metadata: Metadata = {
  title: "I 5 finalisti · Hagenthon",
  description: "I 5 team finalisti dell'Hagenthon, senza punteggi né classifica.",
};

// I dati dipendono dal DB: niente cache statica.
export const dynamic = "force-dynamic";

/** Mescola una copia dell'array (Fisher–Yates) per non suggerire alcun ordine. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Totale coppia = somma dei tre voti (agentico + giuria + speech), i mancanti valgono 0. */
function total(p: {
  voteAgentic: number | null;
  voteJury: number | null;
  voteSpeech: number | null;
}): number {
  return (p.voteAgentic ?? 0) + (p.voteJury ?? 0) + (p.voteSpeech ?? 0);
}

export default function Top5Page() {
  // Top 5 per somma dei tre voti (coppie senza alcun voto escluse), poi mescolate:
  // niente numeri, niente punteggi, nessun ordine che riveli la posizione.
  const finalists = shuffle(
    loadAdminPairs()
      .filter((p) => total(p) > 0)
      .sort((a, b) => total(b) - total(a))
      .slice(0, 5)
  );

  return (
    <>
      <Background intensity={1.1} />
      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <span className="text-base">{"←"}</span>
            Estrazione
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-display text-xl font-bold tracking-tight">
              Hagenthon
              <span className="acn-mark ml-[2px]">{">"}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accenture-purpleLight">
            Hagenthon
          </div>
          <h1 className="mt-3 font-display text-4xl font-black leading-none sm:text-6xl">
            <span className="text-gradient-anim animate-shimmer">I 5 finalisti</span>
          </h1>
          <p className="mt-4 text-sm text-white/50 sm:text-base">
            In ordine casuale, senza punteggi.
          </p>

          {finalists.length === 0 ? (
            <p className="mt-12 text-white/40">
              Nessun finalista disponibile: inserisci le valutazioni dal
              pannello admin.
            </p>
          ) : (
            <Top5Reveal
              finalists={finalists.map((p) => ({
                pairIndex: p.pairIndex,
                members: p.members,
              }))}
            />
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
