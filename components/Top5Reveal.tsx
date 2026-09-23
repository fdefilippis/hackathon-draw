"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export type Finalist = {
  pairIndex: number;
  members: [string, string];
};

export default function Top5Reveal({ finalists }: { finalists: Finalist[] }) {
  // Quanti finalisti sono già stati svelati (0..finalists.length).
  const [revealed, setRevealed] = useState(0);
  const total = finalists.length;
  const done = revealed >= total;

  const revealNext = useCallback(() => {
    setRevealed((n) => Math.min(n + 1, total));
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        revealNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealNext]);

  return (
    <div className="mt-12 flex w-full max-w-3xl flex-col items-center">
      <ul
        className="grid w-full grid-cols-1 gap-4"
        onClick={revealNext}
        role="button"
        tabIndex={-1}
      >
        {finalists.map((p, i) => {
          const visible = i < revealed;
          return (
            <li key={p.pairIndex} className="relative min-h-[5.25rem]">
              <AnimatePresence mode="wait">
                {visible ? (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, y: 28, filter: "blur(8px)", scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                    transition={{ type: "spring", stiffness: 210, damping: 22 }}
                    className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-center backdrop-blur-sm"
                  >
                    <span className="font-display text-xl font-bold text-white sm:text-2xl">
                      {p.members[0]}
                      <span className="mx-3 text-accenture-purple">{"×"}</span>
                      {p.members[1]}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    exit={{ opacity: 0 }}
                    className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-5"
                  >
                    <span className="font-display text-xl font-bold text-white/15 sm:text-2xl">
                      ?
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-sm text-white/40">
        {done
          ? "🎉 Tutti i finalisti svelati!"
          : `Clicca o premi Invio per svelare un finalista · ${revealed}/${total}`}
      </p>
    </div>
  );
}
