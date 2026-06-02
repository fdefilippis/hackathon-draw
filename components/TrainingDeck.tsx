"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES, type Slide } from "@/lib/training";

export default function TrainingDeck() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [isFs, setIsFs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        setDir(clamped >= cur ? 1 : -1);
        return clamped;
      });
    },
    [total]
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  const toggleFs = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFs();
        return;
      }
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total, toggleFs]);

  const slide = SLIDES[index];

  return (
    <div
      ref={containerRef}
      className={`flex w-full flex-col ${
        isFs ? "h-screen justify-center bg-black p-6 sm:p-10" : ""
      }`}
    >
      {/* Barra di avanzamento + contatore + fullscreen */}
      <div className="mb-4 flex items-center gap-4">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-accenture-purple via-accenture-purpleLight to-accenture-magenta"
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span className="font-display text-sm font-semibold tabular-nums text-white/50">
          <span className="text-white">{String(index + 1).padStart(2, "0")}</span>
          {" / "}
          {String(total).padStart(2, "0")}
        </span>
        <button
          onClick={toggleFs}
          aria-label={isFs ? "Esci da schermo intero" : "Schermo intero"}
          title={isFs ? "Esci da schermo intero (F)" : "Schermo intero (F)"}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/60 transition hover:border-white/30 hover:text-white"
        >
          {isFs ? <CompressIcon /> : <ExpandIcon />}
        </button>
      </div>

      {/* Palco slide */}
      <div
        className={`relative flex w-full items-stretch overflow-hidden rounded-2xl border border-white/10 bg-accenture-ink/50 backdrop-blur ${
          isFs ? "min-h-0 flex-1" : "min-h-[60vh] sm:min-h-[62vh]"
        }`}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full flex-col justify-center p-8 sm:p-12"
          >
            <SlideContent slide={slide} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controlli + dot navigation */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          onClick={prev}
          disabled={index === 0}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/70 transition enabled:hover:border-white/30 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <span>{"←"}</span> Indietro
        </button>

        <div className="hidden flex-1 items-center justify-center gap-1.5 sm:flex">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={`Vai alla slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-accenture-purple"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={index === total - 1}
          className="inline-flex items-center gap-2 rounded-full bg-accenture-purple px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition enabled:hover:scale-[1.03] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
        >
          Avanti <span>{"→"}</span>
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-white/30">
        Frecce ← → o barra spaziatrice per navigare · tasto F per lo schermo intero.
      </p>
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function CompressIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h3a2 2 0 0 0 2-2V3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M21 16h-3a2 2 0 0 0-2 2v3" />
    </svg>
  );
}

function SlideHeader({ slide }: { slide: Slide }) {
  return (
    <header className="mb-7">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accenture-purpleLight">
        {slide.kicker}
      </span>
      <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p className="mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
          {slide.subtitle}
        </p>
      )}
    </header>
  );
}

function SlideContent({ slide }: { slide: Slide }) {
  if (slide.layout === "cover") {
    return (
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-accenture-purple" />
          {slide.kicker}
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
          Usare <span className="text-gradient">Claude Code</span> nel modo giusto
        </h2>
        {slide.subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-balance text-base text-white/65 sm:text-lg">
            {slide.subtitle}
          </p>
        )}
        {slide.chips && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {slide.chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/75"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (slide.layout === "closing") {
    return (
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accenture-purpleLight">
          {slide.kicker}
        </span>
        <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          <span className="text-gradient">{slide.title}</span>
        </h2>
        {slide.subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-balance text-base text-white/70 sm:text-lg">
            {slide.subtitle}
          </p>
        )}
        {slide.chips && (
          <div className="mt-9 flex flex-wrap justify-center gap-2">
            {slide.chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-accenture-purple/40 bg-accenture-purple/10 px-4 py-1.5 text-sm font-medium text-white/90"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <SlideHeader slide={slide} />

      {slide.layout === "bullets" && slide.bullets && (
        <ul className="space-y-3.5">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accenture-purple/15 font-display text-sm font-bold text-accenture-purpleLight">
                {i + 1}
              </span>
              <span className="text-lg leading-relaxed text-white/85">{b}</span>
            </li>
          ))}
        </ul>
      )}

      {slide.layout === "cards" && slide.cards && (
        <div className="grid gap-4 sm:grid-cols-2">
          {slide.cards.map((c, i) => (
            <div
              key={i}
              className="border-gradient rounded-xl p-[1px]"
            >
              <div className="h-full rounded-[11px] bg-accenture-ink/70 p-5">
                <h3 className="font-display text-lg font-semibold text-white">
                  {c.title}
                </h3>
                <p className="mt-2 leading-relaxed text-white/65">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.layout === "steps" && slide.steps && (
        <div className="space-y-4">
          {slide.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-5">
              <span className="font-display text-3xl font-bold text-accenture-purple/60 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 border-l border-white/10 pl-5">
                <h3 className="font-display text-xl font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-1 leading-relaxed text-white/65">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.layout === "doDont" && (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-rose-400/25 bg-rose-400/5 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-rose-100">
              <span className="text-xl">✕</span> Da evitare
            </h3>
            <ul className="space-y-2.5">
              {slide.dontItems?.map((d, i) => (
                <li key={i} className="flex gap-3 text-white/70">
                  <span className="mt-0.5 shrink-0 font-bold text-rose-400">×</span>
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-emerald-100">
              <span className="text-xl">✓</span> Da fare
            </h3>
            <ul className="space-y-2.5">
              {slide.doItems?.map((d, i) => (
                <li key={i} className="flex gap-3 text-white/70">
                  <span className="mt-0.5 shrink-0 font-bold text-emerald-400">›</span>
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {slide.layout === "checklist" && slide.chips && (
        <div className="grid gap-3 sm:grid-cols-2">
          {slide.chips.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-400/15 text-sm font-bold text-emerald-300">
                ✓
              </span>
              <span className="font-medium text-white/85">{c}</span>
            </div>
          ))}
        </div>
      )}

      {/* Esempio prompt (vago vs specifico) */}
      {slide.example && (
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-rose-400/25 bg-rose-400/5 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
              Vago
            </span>
            <p className="mt-2 font-mono text-sm leading-relaxed text-white/75">
              {slide.example.bad}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Specifico
            </span>
            <p className="mt-2 font-mono text-sm leading-relaxed text-white/85">
              {slide.example.good}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
