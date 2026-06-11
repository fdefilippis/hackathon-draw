"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/** Wordmark "Hagenthon" con il chevron Accenture e la firma Application Engineering. */
export default function BrandHeader({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex items-center justify-between gap-4"
    >
      <Link href="/" className="flex items-baseline gap-2">
        <span
          className={`font-display font-bold tracking-tight ${
            compact ? "text-xl" : "text-2xl"
          }`}
        >
          Hagenthon
          <span className="acn-mark ml-[2px] align-baseline">{">"}</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 sm:gap-2 sm:text-xs">
          <Link
            href="/brief"
            className="rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white"
          >
            Brief
          </Link>
          <Link
            href="/training"
            className="rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white"
          >
            Training
          </Link>
        </nav>
        <div className="hidden text-right leading-tight sm:block">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accenture-purpleLight">
            Accenture
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
            Application Engineering
          </div>
        </div>
      </div>
    </motion.header>
  );
}
