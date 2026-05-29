"use client";

import { motion } from "framer-motion";

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
      <div className="flex items-baseline gap-2">
        <span
          className={`font-display font-bold tracking-tight ${
            compact ? "text-xl" : "text-2xl"
          }`}
        >
          Hagenthon
          <span className="acn-mark ml-[2px] align-baseline">{">"}</span>
        </span>
      </div>
      <div className="text-right leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accenture-purpleLight">
          Accenture
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
          Application Engineering
        </div>
      </div>
    </motion.header>
  );
}
