"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import type { Pair } from "@/lib/pairing";
import ConfirmModal from "@/components/ConfirmModal";

export default function ResultsScreen({
  pairs,
  onRegenerate,
  onRestart,
}: {
  pairs: Pair[];
  onRegenerate: () => void;
  onRestart: () => void | Promise<void>;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleConfirmRestart = async () => {
    setClearing(true);
    try {
      await onRestart();
    } finally {
      setClearing(false);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    const colors = ["#A100FF", "#BE82FF", "#FF50A0", "#7500C0", "#FFFFFF"];
    const end = Date.now() + 1200;
    const tick = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return (
    <motion.section
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-[88vh] flex-col py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accenture-purpleLight">
          {pairs.length} squadre · {pairs.length * 2} sfidanti
        </span>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Team completati.
          <br className="sm:hidden" />{" "}
          <span className="text-gradient">Che la sfida abbia inizio.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pairs.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.04, duration: 0.4 }}
            className="border-gradient group rounded-xl p-[1px] transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex h-full flex-col rounded-[11px] bg-accenture-ink/80 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-white/30">
                  Squadra
                </span>
                <span className="font-display text-lg font-bold text-accenture-purpleLight tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="font-display text-lg font-semibold leading-snug text-white">
                  {p.members[0]}
                </p>
                <div className="flex items-center gap-2 text-accenture-purple">
                  <span className="h-px flex-1 bg-gradient-to-r from-accenture-purple/50 to-transparent" />
                  <span className="text-xs font-bold">+</span>
                </div>
                <p className="font-display text-lg font-semibold leading-snug text-white">
                  {p.members[1]}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + pairs.length * 0.04 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-2 rounded-full border border-accenture-purple/50 bg-accenture-purple/10 px-7 py-3 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-accenture-purple/20 active:scale-95"
        >
          <span className="text-base">{"↻"}</span>
          Rigenera estrazione
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-accenture-purple/40 px-7 py-3 text-sm font-medium text-accenture-purpleLight transition hover:border-accenture-purple/70 hover:text-white"
        >
          Pannello giuria
          <span className="text-base">{"→"}</span>
        </Link>
        <button
          onClick={() => setConfirmOpen(true)}
          className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
        >
          Ricomincia da capo
        </button>
      </motion.div>

      <ConfirmModal
        open={confirmOpen}
        busy={clearing}
        title="Ricominciare da capo?"
        message="Verranno cancellati definitivamente la lista dei partecipanti e le coppie salvate nel database. L'operazione non è reversibile."
        confirmLabel="Sì, svuota tutto"
        cancelLabel="Annulla"
        onConfirm={handleConfirmRestart}
        onCancel={() => setConfirmOpen(false)}
      />
    </motion.section>
  );
}
