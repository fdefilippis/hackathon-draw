"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import type { Pair } from "@/lib/pairing";

type Mode = "intro" | "shuffling" | "revealed";

const SHUFFLE_MS = 2300;
const REVEAL_MS = 2700;
const INTRO_MS = 2200;

function fireConfetti() {
  const colors = ["#A100FF", "#BE82FF", "#FF50A0", "#7500C0", "#FFFFFF"];
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.55 },
    colors,
    startVelocity: 42,
    scalar: 1.05,
    ticks: 220,
  });
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
    colors,
  });
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 },
    colors,
  });
}

export default function DrawingScreen({
  pairs,
  allNames,
  onComplete,
}: {
  pairs: Pair[];
  allNames: string[];
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("intro");
  const [flashA, setFlashA] = useState("");
  const [flashB, setFlashB] = useState("");

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const flashInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (flashInterval.current) {
      clearInterval(flashInterval.current);
      flashInterval.current = null;
    }
  }, []);

  const rnd = useMemo(
    () => () => allNames[Math.floor(Math.random() * allNames.length)] ?? "",
    [allNames]
  );

  // Sequenza della cerimonia
  useEffect(() => {
    clearTimers();

    if (mode === "intro") {
      timers.current.push(setTimeout(() => setMode("shuffling"), INTRO_MS));
      return clearTimers;
    }

    if (index >= pairs.length) {
      timers.current.push(setTimeout(onComplete, 900));
      return clearTimers;
    }

    if (mode === "shuffling") {
      flashInterval.current = setInterval(() => {
        setFlashA(rnd());
        setFlashB(rnd());
      }, 75);
      timers.current.push(
        setTimeout(() => setMode("revealed"), SHUFFLE_MS)
      );
      return clearTimers;
    }

    if (mode === "revealed") {
      fireConfetti();
      timers.current.push(
        setTimeout(() => {
          if (index + 1 >= pairs.length) {
            setIndex(index + 1); // trigger completamento al prossimo run
          } else {
            setIndex(index + 1);
            setMode("shuffling");
          }
        }, REVEAL_MS)
      );
      return clearTimers;
    }

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, index, pairs.length]);

  const current = pairs[Math.min(index, pairs.length - 1)];
  const total = pairs.length;
  const teamNumber = Math.min(index + 1, total);
  const progress = mode === "intro" ? 0 : (index + (mode === "revealed" ? 1 : 0)) / total;

  const headline =
    mode === "intro"
      ? "Estrazione in corso…"
      : mode === "shuffling"
        ? "La prossima coppia è…"
        : `Squadra ${String(teamNumber).padStart(2, "0")}`;

  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center">
      {/* Progress + skip */}
      <div className="absolute left-0 right-0 top-4 flex items-center justify-between px-1">
        <div className="font-display text-sm font-semibold tabular-nums text-white/60">
          {mode === "intro" ? (
            <span className="text-white/40">Preparazione…</span>
          ) : (
            <>
              <span className="text-white">
                {String(Math.min(index + (mode === "revealed" ? 1 : 0), total)).padStart(2, "0")}
              </span>
              <span className="text-white/30"> / {total} squadre</span>
            </>
          )}
        </div>
        <button
          onClick={() => {
            clearTimers();
            onComplete();
          }}
          className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/40 transition hover:border-white/25 hover:text-white/80"
        >
          Salta {"»"}
        </button>
      </div>

      {/* Barra di avanzamento */}
      <div className="absolute left-0 right-0 top-12 h-[3px] overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-accenture-purple via-accenture-purpleLight to-accenture-magenta"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Headline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={headline + (mode === "revealed" ? index : "")}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accenture-purpleLight">
            Hagenthon · Estrazione
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {mode === "revealed" ? (
              <span className="text-gradient">{headline}</span>
            ) : (
              <span className="text-white">{headline}</span>
            )}
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Palco della coppia */}
      <div className="relative flex w-full max-w-5xl items-center justify-center">
        {/* anelli pulsanti durante lo shuffle */}
        {mode === "shuffling" && (
          <>
            <span className="absolute h-72 w-72 animate-pulseRing rounded-full border border-accenture-purple/40" />
            <span
              className="absolute h-72 w-72 animate-pulseRing rounded-full border border-accenture-magenta/30"
              style={{ animationDelay: "1.2s" }}
            />
          </>
        )}

        <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
          <NameCard
            label="A"
            mode={mode}
            value={mode === "revealed" ? current?.members[0] ?? "" : flashA}
          />

          <div className="flex shrink-0 items-center justify-center py-2">
            <motion.div
              animate={
                mode === "revealed"
                  ? { scale: [0.6, 1.25, 1], rotate: [0, 8, 0] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.6 }}
              className="font-display text-3xl font-bold text-accenture-purpleLight sm:text-4xl"
            >
              <span className="opacity-60">+</span>
            </motion.div>
          </div>

          <NameCard
            label="B"
            mode={mode}
            value={mode === "revealed" ? current?.members[1] ?? "" : flashB}
          />
        </div>
      </div>

      {mode === "intro" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center text-white/45"
        >
          {total} squadre stanno per nascere. Trattenete il respiro.
        </motion.p>
      )}
    </section>
  );
}

function NameCard({
  value,
  mode,
  label,
}: {
  value: string;
  mode: Mode;
  label: string;
}) {
  const revealed = mode === "revealed";
  return (
    <motion.div
      animate={
        revealed
          ? { scale: 1, opacity: 1, y: 0 }
          : { scale: 0.98, opacity: 0.92 }
      }
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`relative flex h-40 flex-1 items-center justify-center overflow-hidden rounded-2xl border px-6 text-center backdrop-blur transition-colors duration-300 sm:h-48 ${
        revealed
          ? "border-accenture-purple/60 bg-gradient-to-br from-accenture-purpleDark/50 to-black shadow-glowStrong"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <span className="absolute left-4 top-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-white/25">
        {label}
      </span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={revealed ? { opacity: 0, y: 18, filter: "blur(8px)" } : false}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={revealed ? { opacity: 0 } : { opacity: 0, position: "absolute" }}
          transition={{ duration: revealed ? 0.45 : 0.05 }}
          className={`font-display font-bold leading-tight ${
            revealed
              ? "text-2xl text-white sm:text-3xl md:text-4xl"
              : "text-xl text-white/45 blur-[1px] sm:text-2xl"
          }`}
        >
          {value || "—"}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
