"use client";

import { motion, type Variants } from "framer-motion";

export type Finalist = {
  pairIndex: number;
  members: [string, string];
};

// Comparsa a cascata: le coppie entrano una dopo l'altra al caricamento.
const list: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.5, staggerChildren: 0.28 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)", scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { type: "spring", stiffness: 210, damping: 22 },
  },
};

export default function Top5Reveal({ finalists }: { finalists: Finalist[] }) {
  return (
    <motion.ul
      variants={list}
      initial="hidden"
      animate="show"
      className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-4"
    >
      {finalists.map((p) => (
        <motion.li
          key={p.pairIndex}
          variants={item}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-center backdrop-blur-sm transition hover:border-accenture-purple/50"
        >
          <span className="font-display text-xl font-bold text-white sm:text-2xl">
            {p.members[0]}
            <span className="mx-3 text-accenture-purple">{"×"}</span>
            {p.members[1]}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
