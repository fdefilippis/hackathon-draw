"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { parseParticipants, validate, TARGET_PARTICIPANTS } from "@/lib/pairing";

const SAMPLE = Array.from({ length: TARGET_PARTICIPANTS }, (_, i) => {
  const nomi = [
    "Giulia Rossi", "Marco Bianchi", "Sara Conti", "Luca Ferrari",
    "Elena Greco", "Andrea Russo", "Chiara Marino", "Davide Costa",
    "Martina Ricci", "Francesco Bruno", "Alice Gallo", "Matteo Fontana",
    "Sofia Esposito", "Lorenzo Caruso", "Aurora De Luca", "Simone Rizzo",
    "Beatrice Lombardi", "Tommaso Moretti", "Federica Barbieri", "Riccardo Villa",
    "Valentina Serra", "Alessandro Romano", "Ilaria Galli", "Giovanni Leone",
    "Camilla Martini", "Stefano Pellegrini", "Noemi Gentile", "Daniele Vitale",
    "Gaia Palumbo", "Antonio Sala", "Rebecca Negri", "Filippo Sartori",
    "Greta Donati", "Nicola Mancini", "Eleonora Fabbri", "Pietro Longo",
    "Vittoria Coppola", "Edoardo Riva", "Alessia Farina", "Cristian Testa",
  ];
  return nomi[i];
}).join("\n");

const toneStyles: Record<string, string> = {
  neutral: "text-white/50 border-white/10 bg-white/5",
  warning: "text-amber-200 border-amber-400/30 bg-amber-400/10",
  error: "text-rose-200 border-rose-400/30 bg-rose-400/10",
  success: "text-emerald-200 border-emerald-400/30 bg-emerald-400/10",
};

export default function InputScreen({
  onDraw,
  onBack,
}: {
  onDraw: (names: string[]) => void;
  onBack: () => void;
}) {
  const [raw, setRaw] = useState("");

  const names = useMemo(() => parseParticipants(raw), [raw]);
  const v = useMemo(() => validate(names), [names]);

  return (
    <motion.section
      key="input"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex min-h-[78vh] w-full max-w-3xl flex-col justify-center py-10"
    >
      <div className="mb-8 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Chi <span className="text-gradient">scende in campo?</span>
        </h2>
        <p className="mt-3 text-white/55">
          Incolla la lista dei partecipanti, un nome per riga.
        </p>
      </div>

      <div className="border-gradient rounded-2xl p-1 shadow-glow">
        <div className="rounded-xl bg-accenture-ink/80 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Lista partecipanti
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRaw(SAMPLE)}
                className="rounded-md px-3 py-1 text-xs font-medium text-accenture-purpleLight transition hover:bg-white/5"
              >
                Carica esempio (40)
              </button>
              {raw.length > 0 && (
                <button
                  onClick={() => setRaw("")}
                  className="rounded-md px-3 py-1 text-xs font-medium text-white/40 transition hover:bg-white/5 hover:text-white/70"
                >
                  Svuota
                </button>
              )}
            </div>
          </div>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            placeholder={"Giulia Rossi\nMarco Bianchi\nSara Conti\n..."}
            className="h-72 w-full resize-none bg-transparent px-5 py-4 font-sans text-base leading-relaxed text-white placeholder:text-white/25 focus:outline-none"
          />
        </div>
      </div>

      {/* Stato / validazione */}
      <div className="mt-5 flex flex-col items-center gap-4">
        <div
          className={`flex items-center gap-3 rounded-full border px-5 py-2 text-sm transition ${
            toneStyles[v.tone]
          }`}
        >
          <span className="font-display text-lg font-bold tabular-nums">
            {v.count}
          </span>
          <span className="h-4 w-px bg-current opacity-30" />
          <span>{v.message}</span>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Indietro
          </button>
          <button
            disabled={!v.ok}
            onClick={() => onDraw(names)}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accenture-purple px-8 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-300 enabled:hover:scale-[1.03] enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
          >
            Avvia l{"’"}estrazione
            <span className="text-base transition-transform duration-300 group-enabled:group-hover:translate-x-1">
              {"→"}
            </span>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
