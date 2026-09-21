"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export type PodiumEntry = {
  rank: 1 | 2 | 3;
  members: [string, string];
  prizeLabel: string;
  prizeAmount: string;
  prizeNote: string;
};

// Aspetto per posizione: colore accento, medaglia e altezza del gradino.
const STYLE: Record<
  1 | 2 | 3,
  { medal: string; ring: string; glow: string; height: string; order: number }
> = {
  // `order` = posizione visiva sinistra→destra (2°, 1°, 3°).
  1: {
    medal: "🥇",
    ring: "border-amber-300/70",
    glow: "shadow-[0_0_60px_rgba(251,191,36,0.35)]",
    height: "h-64 sm:h-80",
    order: 2,
  },
  2: {
    medal: "🥈",
    ring: "border-slate-300/60",
    glow: "shadow-[0_0_45px_rgba(203,213,225,0.25)]",
    height: "h-52 sm:h-64",
    order: 1,
  },
  3: {
    medal: "🥉",
    ring: "border-orange-400/50",
    glow: "shadow-[0_0_40px_rgba(251,146,60,0.22)]",
    height: "h-44 sm:h-52",
    order: 3,
  },
};

// Ordine di rivelazione: prima il 3°, poi il 2°, infine il 1°.
const REVEAL_ORDER: (1 | 2 | 3)[] = [3, 2, 1];

const HINTS = [
  "Premi Invio per svelare il 3° posto 🥉",
  "Premi Invio per svelare il 2° posto 🥈",
  "Premi Invio per svelare il 1° posto 🥇",
  "🎉 Podio completo!",
];

export default function PodiumReveal({ entries }: { entries: PodiumEntry[] }) {
  // Quante posizioni sono già state rivelate (0..3).
  const [revealed, setRevealed] = useState(0);

  const revealNext = useCallback(() => {
    setRevealed((n) => Math.min(n + 1, REVEAL_ORDER.length));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        revealNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealNext]);

  // Una posizione è visibile quando il suo turno nella sequenza è già passato.
  const isVisible = (rank: 1 | 2 | 3) =>
    REVEAL_ORDER.indexOf(rank) < revealed;

  const byRank = (rank: 1 | 2 | 3) => entries.find((e) => e.rank === rank);

  // Ordina i gradini per posizione visiva (2°, 1°, 3°).
  const columns = ([2, 1, 3] as (1 | 2 | 3)[])
    .map((rank) => byRank(rank))
    .filter((e): e is PodiumEntry => Boolean(e));

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="flex w-full max-w-4xl items-end justify-center gap-4 sm:gap-8"
        onClick={revealNext}
        role="button"
        tabIndex={-1}
      >
        {columns.map((entry) => {
          const s = STYLE[entry.rank];
          const visible = isVisible(entry.rank);
          return (
            <div key={entry.rank} className="flex flex-1 flex-col items-center">
              {/* Nome + premio: compaiono al reveal */}
              <div className="mb-4 flex min-h-[7rem] flex-col items-center justify-end text-center">
                <AnimatePresence>
                  {visible && (
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    >
                      <div className="text-4xl sm:text-5xl">{s.medal}</div>
                      <div className="mt-2 font-display text-lg font-bold leading-tight text-white sm:text-2xl">
                        {entry.members[0]}
                        <span className="mx-2 text-accenture-purple">{"×"}</span>
                        {entry.members[1]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Gradino del podio */}
              <motion.div
                initial={false}
                animate={
                  visible
                    ? { opacity: 1, scaleY: 1 }
                    : { opacity: 0.25, scaleY: 0.55 }
                }
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                style={{ transformOrigin: "bottom" }}
                className={`flex w-full ${s.height} flex-col items-center justify-start rounded-t-2xl border ${s.ring} bg-white/[0.04] pt-5 backdrop-blur-sm ${
                  visible ? s.glow : ""
                }`}
              >
                <div className="font-display text-5xl font-black text-white/85 sm:text-7xl">
                  {entry.rank}
                </div>
                <AnimatePresence>
                  {visible && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-3 text-center"
                    >
                      <div className="font-display text-xl font-bold text-accenture-purpleLight sm:text-3xl">
                        {entry.prizeAmount}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
                        {entry.prizeNote}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 h-6 text-sm font-medium text-white/55 sm:text-base">
        {HINTS[revealed]}
      </p>
    </div>
  );
}
