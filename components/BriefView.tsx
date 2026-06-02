"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  AGENTIC_CAPABILITIES,
  CRITERIA,
  DEMONSTRATE,
  EXPECTED_RESULTS,
  FINAL_MESSAGE,
  GENERAL_RULES,
  NOT_ALLOWED,
  THEMES,
} from "@/lib/brief";

const NAV = [
  { id: "panoramica", label: "Panoramica" },
  { id: "regole", label: "Regole" },
  { id: "deliverable", label: "Risultato atteso" },
  { id: "temi", label: "I 3 temi" },
  { id: "valutazione", label: "Valutazione" },
];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-7">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accenture-purpleLight">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

/** Lista con marker on-brand. */
function Bullets({
  items,
  tone = "purple",
}: {
  items: string[];
  tone?: "purple" | "rose" | "white";
}) {
  const dot =
    tone === "rose"
      ? "text-rose-400"
      : tone === "white"
        ? "text-white/40"
        : "text-accenture-purple";
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-white/70">
          <span className={`mt-[2px] shrink-0 font-bold ${dot}`}>
            {tone === "rose" ? "×" : "›"}
          </span>
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default function BriefView() {
  const [active, setActive] = useState(THEMES[0].id);
  const theme = THEMES.find((t) => t.id === active) ?? THEMES[0];

  return (
    <div className="mx-auto w-full max-w-4xl pb-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-10 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accenture-purple" />
          Brief per i partecipanti
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
          Hackathon <span className="text-gradient">Agentic Coding</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-white/65 sm:text-lg">
          8 ore, team da 2 persone, una soluzione funzionante che usa l'agentic
          coding per un problema concreto di inclusione digitale. Scegliete un
          tema, definite un problema specifico, costruite un prototipo e
          preparate la demo finale.
        </p>
      </motion.section>

      {/* Sub-nav sticky */}
      <nav className="sticky top-0 z-30 -mx-4 mb-12 border-b border-white/5 bg-black/70 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Panoramica */}
      <section id="panoramica" className="scroll-mt-24">
        <SectionTitle eyebrow="Obiettivo della giornata" title="La soluzione dovrà dimostrare" />
        <div className="grid gap-3 sm:grid-cols-2">
          {DEMONSTRATE.map((d, i) => (
            <div
              key={i}
              className="border-gradient rounded-xl p-[1px]"
            >
              <div className="flex h-full items-center gap-3 rounded-[11px] bg-accenture-ink/70 px-4 py-3.5">
                <span className="font-display text-sm font-bold text-accenture-purpleLight">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium text-white/85">{d}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-xl border border-accenture-purple/20 bg-accenture-purple/5 px-5 py-4 text-sm leading-relaxed text-white/70">
          <span className="font-semibold text-white">L'AI è uno strumento di supporto:</span>{" "}
          il team resta responsabile delle scelte, del codice, degli output e della
          qualità finale della soluzione.
        </p>
      </section>

      {/* Regole */}
      <section id="regole" className="mt-16 scroll-mt-24">
        <SectionTitle eyebrow="Come si gioca" title="Regole generali" />
        <Bullets items={GENERAL_RULES} />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-3 font-display text-lg font-semibold text-white">
              Almeno una capability agentica concreta
            </h3>
            <Bullets items={AGENTIC_CAPABILITIES} />
          </div>
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-5">
            <h3 className="mb-3 font-display text-lg font-semibold text-rose-100">
              Non sono ammessi progetti che consistono solo in
            </h3>
            <Bullets items={NOT_ALLOWED} tone="rose" />
          </div>
        </div>
      </section>

      {/* Deliverable / risultato atteso */}
      <section id="deliverable" className="mt-16 scroll-mt-24">
        <SectionTitle eyebrow="Consegna" title="Risultato atteso" />
        <div className="space-y-4">
          {EXPECTED_RESULTS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-start gap-4">
                <span className="font-display text-2xl font-bold text-accenture-purple/70 tabular-nums">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-white/65">{item.desc}</p>
                  {item.bullets && (
                    <div className="mt-3">
                      <Bullets items={item.bullets} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* I 3 temi */}
      <section id="temi" className="mt-16 scroll-mt-24">
        <SectionTitle eyebrow="Scegline uno" title="I 3 temi" />

        {/* Tabs */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row">
          {THEMES.map((t) => {
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`group relative flex flex-1 items-center gap-3 overflow-hidden rounded-xl border px-4 py-3.5 text-left transition ${
                  isActive
                    ? "border-accenture-purple/60 bg-accenture-purpleDark/30 shadow-glow"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                <span
                  className={`font-display text-xl font-bold tabular-nums ${
                    isActive ? "text-accenture-purpleLight" : "text-white/30"
                  }`}
                >
                  {t.number}
                </span>
                <span
                  className={`font-display text-sm font-semibold leading-tight ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                >
                  {t.title}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="border-gradient rounded-2xl p-[1px] shadow-glow"
          >
            <div className="space-y-7 rounded-[15px] bg-accenture-ink/80 p-6 backdrop-blur sm:p-8">
              <header>
                <span className="font-display text-sm font-bold uppercase tracking-[0.25em] text-accenture-purpleLight">
                  Tema {theme.number}
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                  {theme.title}
                </h3>
              </header>

              <div>
                <p className="text-base leading-relaxed text-white/80">
                  {theme.objective}
                </p>
                <p className="mt-3 text-sm italic leading-relaxed text-white/50">
                  {theme.focus}
                </p>
              </div>

              <div className="rounded-xl border border-accenture-purple/25 bg-accenture-purple/[0.06] p-5">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accenture-purpleLight">
                  La challenge
                </h4>
                <p className="leading-relaxed text-white/80">{theme.challenge}</p>
              </div>

              <div className="grid gap-7 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    Esempi di soluzioni possibili
                  </h4>
                  <Bullets items={theme.examples} />
                </div>
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    Vincoli specifici
                  </h4>
                  <Bullets items={theme.constraints} />
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Deliverable specifici
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {theme.deliverables.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <span className="font-display text-sm font-bold text-accenture-purpleLight">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h5 className="mt-1.5 font-display text-sm font-semibold leading-snug text-white">
                        {d.title}
                      </h5>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                        {d.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-5">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                  Cosa evitare
                </h4>
                <Bullets items={theme.avoid} tone="rose" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Valutazione */}
      <section id="valutazione" className="mt-16 scroll-mt-24">
        <SectionTitle eyebrow="Come si vince" title="Criteri di valutazione" />
        <p className="mb-6 text-white/60">
          La giuria valuterà i progetti considerando sia il risultato finale sia
          il processo seguito dal team.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CRITERIA.map((c, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-accenture-purple/40"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-lg font-bold text-accenture-purpleLight tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-base font-semibold text-white">
                  {c.title}
                </h3>
              </div>
              <p className="mt-2 pl-9 text-sm leading-relaxed text-white/60">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Messaggio finale */}
      <section className="mt-16">
        <div className="border-gradient rounded-2xl p-[1px] shadow-glow">
          <div className="rounded-[15px] bg-gradient-to-br from-accenture-purpleDark/40 to-black p-8 text-center sm:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accenture-purpleLight">
              Messaggio finale
            </span>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-white sm:text-xl">
              Non cercate di costruire il prodotto perfetto. Concentratevi su un
              problema specifico, un utente chiaro e una dimostrazione concreta del
              miglioramento.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
              Una buona soluzione non è quella più grande, ma quella che riesce a
              mostrare in modo semplice:
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {FINAL_MESSAGE.map((f, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80"
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-relaxed text-white/70">
              L'obiettivo è dimostrare che l'AI, usata con controllo umano e buon
              metodo, può aiutare a costruire servizi digitali più inclusivi,
              comprensibili e accessibili.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
