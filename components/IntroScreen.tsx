"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-[78vh] flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accenture-purple" />
        Accenture Application Engineering
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
      >
        <span className="text-gradient-anim animate-shimmer">Benvenuti</span>
        <br />
        <span className="text-white">
          all{"’"}Hagenthon
          <span className="acn-mark align-top text-accenture-purple">{">"}</span>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7 }}
        className="mt-7 max-w-2xl text-balance text-lg text-white/65 sm:text-xl"
      >
        40 menti. 20 squadre. Una sola notte per costruire qualcosa di
        straordinario. Pronti a scoprire le squadre?
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-12"
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accenture-purple px-10 py-4 text-base font-semibold text-white shadow-glow transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            Inizia l{"’"}estrazione
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
              {"→"}
            </span>
          </button>
          <Link
            href="/brief"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-medium text-white/80 backdrop-blur transition hover:border-accenture-purple/60 hover:text-white"
          >
            Brief & regolamento
          </Link>
          <Link
            href="/training"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-medium text-white/80 backdrop-blur transition hover:border-accenture-purple/60 hover:text-white"
          >
            Training Claude Code
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-white/35"
      >
        <span>Innovation</span>
        <span className="h-3 w-px bg-white/20" />
        <span>Engineering</span>
        <span className="h-3 w-px bg-white/20" />
        <span>AI</span>
      </motion.div>
    </motion.section>
  );
}
