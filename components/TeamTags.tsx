import type { Sede } from "@/lib/participants";

const SEDE_STYLES: Record<Sede, string> = {
  Milano: "border-accenture-purple/50 bg-accenture-purple/15 text-accenture-purpleSoft",
  Roma: "border-accenture-magenta/50 bg-accenture-magenta/15 text-accenture-magenta",
  Remoto: "border-white/25 bg-white/10 text-white/80",
};

/** Etichetta della sede di una squadra. */
export function SedeTag({ sede, size = "sm" }: { sede: Sede; size?: "sm" | "lg" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase ${
        size === "lg"
          ? "px-4 py-1.5 text-xs tracking-[0.3em]"
          : "px-2 py-0.5 text-[9px] tracking-[0.2em]"
      } ${SEDE_STYLES[sede]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {sede}
    </span>
  );
}

/** Contrassegno di chi ha la licenza Claude Code. */
export function ClaudeCodeTag({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 font-semibold uppercase text-emerald-200 ${
        size === "lg"
          ? "px-3 py-1 text-[10px] tracking-[0.2em]"
          : "px-2 py-0.5 text-[9px] tracking-[0.15em]"
      }`}
    >
      Claude Code
    </span>
  );
}
