"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminPair = {
  pairIndex: number;
  members: [string, string];
  githubUrl: string | null;
  voteAgentic: number | null;
  voteJury: number | null;
  voteSpeech: number | null;
};

type RowState = {
  githubUrl: string;
  voteAgentic: string;
  voteJury: string;
  voteSpeech: string;
};

type SaveState = "idle" | "saving" | "error";
type Mode = "view" | "edit";

function toRow(p: AdminPair): RowState {
  return {
    githubUrl: p.githubUrl ?? "",
    voteAgentic: p.voteAgentic?.toString() ?? "",
    voteJury: p.voteJury?.toString() ?? "",
    voteSpeech: p.voteSpeech?.toString() ?? "",
  };
}

/** Una coppia ha dati se ha almeno un voto o il link repo. */
function hasData(p: AdminPair): boolean {
  return (
    p.githubUrl !== null ||
    p.voteAgentic !== null ||
    p.voteJury !== null ||
    p.voteSpeech !== null
  );
}

/** Somma dei voti presenti; null se nessun voto è stato inserito. */
function totalOf(p: AdminPair): number | null {
  const votes = [p.voteAgentic, p.voteJury, p.voteSpeech].filter(
    (v): v is number => v !== null
  );
  if (votes.length === 0) return null;
  return votes.reduce((a, b) => a + b, 0);
}

/** Formatta un voto: intero senza decimali, altrimenti con la virgola. */
function fmt(n: number | null): string {
  if (n === null) return "—";
  return Number.isInteger(n) ? String(n) : n.toString();
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white transition placeholder:text-white/25 focus:border-accenture-purple/60 focus:outline-none focus:ring-1 focus:ring-accenture-purple/40";

const labelCls =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40";

export default function AdminPanel() {
  const [pairs, setPairs] = useState<AdminPair[] | null>(null);
  const [rows, setRows] = useState<Record<number, RowState>>({});
  const [mode, setMode] = useState<Record<number, Mode>>({});
  const [status, setStatus] = useState<Record<number, SaveState>>({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin");
        if (!res.ok) throw new Error("fetch failed");
        const { pairs } = (await res.json()) as { pairs: AdminPair[] };
        if (cancelled) return;
        setPairs(pairs);
        setRows(Object.fromEntries(pairs.map((p) => [p.pairIndex, toRow(p)])));
        // Le coppie già compilate partono in lettura, le altre in modifica.
        setMode(
          Object.fromEntries(
            pairs.map((p) => [p.pairIndex, hasData(p) ? "view" : "edit"])
          )
        );
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Ordinamento per totale decrescente; le coppie senza voti vanno in fondo.
  const ordered = useMemo(() => {
    if (!pairs) return [];
    return [...pairs].sort((a, b) => {
      const ta = totalOf(a);
      const tb = totalOf(b);
      if (ta === null && tb === null) return a.pairIndex - b.pairIndex;
      if (ta === null) return 1;
      if (tb === null) return -1;
      if (tb !== ta) return tb - ta;
      return a.pairIndex - b.pairIndex;
    });
  }, [pairs]);

  // Indici (pairIndex) della top 5 fra le coppie che hanno almeno un voto.
  const topFive = useMemo(() => {
    const set = new Set<number>();
    let rank = 0;
    for (const p of ordered) {
      if (totalOf(p) === null) break;
      set.add(p.pairIndex);
      if (++rank >= 5) break;
    }
    return set;
  }, [ordered]);

  const setField = useCallback(
    (idx: number, field: keyof RowState, value: string) => {
      setRows((prev) => ({ ...prev, [idx]: { ...prev[idx], [field]: value } }));
      setStatus((prev) => ({ ...prev, [idx]: "idle" }));
    },
    []
  );

  const save = useCallback(
    async (idx: number) => {
      const row = rows[idx];
      if (!row) return;
      setStatus((prev) => ({ ...prev, [idx]: "saving" }));
      try {
        const res = await fetch("/api/admin", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pairIndex: idx,
            githubUrl: row.githubUrl,
            voteAgentic: row.voteAgentic,
            voteJury: row.voteJury,
            voteSpeech: row.voteSpeech,
          }),
        });
        if (!res.ok) throw new Error("save failed");
        // Aggiorna la sorgente di verità → ricalcola ordine e top 5.
        const num = (s: string) => {
          if (s.trim() === "") return null;
          const n = Number(s);
          return Number.isFinite(n) ? n : null;
        };
        setPairs((prev) =>
          (prev ?? []).map((p) =>
            p.pairIndex === idx
              ? {
                  ...p,
                  githubUrl: row.githubUrl.trim() || null,
                  voteAgentic: num(row.voteAgentic),
                  voteJury: num(row.voteJury),
                  voteSpeech: num(row.voteSpeech),
                }
              : p
          )
        );
        setStatus((prev) => ({ ...prev, [idx]: "idle" }));
        setMode((prev) => ({ ...prev, [idx]: "view" }));
      } catch {
        setStatus((prev) => ({ ...prev, [idx]: "error" }));
      }
    },
    [rows]
  );

  const edit = useCallback(
    (idx: number) => {
      const p = pairs?.find((x) => x.pairIndex === idx);
      if (p) setRows((prev) => ({ ...prev, [idx]: toRow(p) }));
      setStatus((prev) => ({ ...prev, [idx]: "idle" }));
      setMode((prev) => ({ ...prev, [idx]: "edit" }));
    },
    [pairs]
  );

  const cancel = useCallback(
    (idx: number) => {
      const p = pairs?.find((x) => x.pairIndex === idx);
      if (p) setRows((prev) => ({ ...prev, [idx]: toRow(p) }));
      setStatus((prev) => ({ ...prev, [idx]: "idle" }));
      setMode((prev) => ({ ...prev, [idx]: "view" }));
    },
    [pairs]
  );

  // Stato di caricamento
  if (pairs === null && !loadError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-sm uppercase tracking-[0.3em] text-white/40">
          Caricamento…
        </span>
      </div>
    );
  }

  // Nessuna estrazione presente
  if (loadError || (pairs && pairs.length === 0)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Nessuna coppia <span className="text-gradient">da gestire.</span>
        </h2>
        <p className="mt-3 max-w-md text-white/55">
          {loadError
            ? "Impossibile caricare i dati. Riprova più tardi."
            : "Esegui prima un'estrazione: le coppie compariranno qui per l'inserimento dei dati."}
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-accenture-purple px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.03] active:scale-95"
        >
          Vai all{"’"}estrazione
          <span className="text-base">{"→"}</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6"
    >
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accenture-purpleLight">
          Pannello giuria · {pairs!.length} squadre
        </span>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Classifica &amp; <span className="text-gradient">valutazioni</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence initial={false}>
          {ordered.map((p) => {
            const row = rows[p.pairIndex];
            const st = status[p.pairIndex] ?? "idle";
            const m: Mode = mode[p.pairIndex] ?? "edit";
            const total = totalOf(p);
            const rank = ordered.findIndex((x) => x.pairIndex === p.pairIndex);
            const isTop = topFive.has(p.pairIndex);

            return (
              <motion.div
                key={p.pairIndex}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className={
                  isTop
                    ? "border-gradient rounded-xl p-[1px] shadow-glow"
                    : "rounded-xl border border-white/10 p-[1px]"
                }
              >
                <div className="flex h-full flex-col rounded-[11px] bg-accenture-ink/80 p-5 backdrop-blur">
                  {/* Intestazione: rank + membri */}
                  <div className="mb-4 flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display text-base font-bold tabular-nums ${
                        isTop
                          ? "bg-accenture-purple text-white shadow-glow"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {total === null ? "—" : rank + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                          Squadra {String(p.pairIndex + 1).padStart(2, "0")}
                        </span>
                        {isTop && (
                          <span className="rounded-full bg-accenture-magenta/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-accenture-magenta">
                            Top 5
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate font-display text-lg font-semibold leading-snug text-white">
                        {p.members[0]}{" "}
                        <span className="text-accenture-purple">+</span>{" "}
                        {p.members[1]}
                      </p>
                    </div>
                    {m === "view" && (
                      <div className="shrink-0 text-right">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                          Totale
                        </div>
                        <div className="font-display text-2xl font-bold tabular-nums text-gradient">
                          {fmt(total)}
                        </div>
                      </div>
                    )}
                  </div>

                  {m === "view" ? (
                    /* ---------- LETTURA ---------- */
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Agentico", value: p.voteAgentic },
                          { label: "Giuria", value: p.voteJury },
                          { label: "Speech", value: p.voteSpeech },
                        ].map((v) => (
                          <div
                            key={v.label}
                            className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-center"
                          >
                            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                              {v.label}
                            </div>
                            <div className="mt-0.5 font-display text-lg font-bold tabular-nums text-white">
                              {fmt(v.value)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        {p.githubUrl ? (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-w-0 items-center gap-1.5 text-sm text-accenture-purpleLight transition hover:text-white"
                          >
                            <span>↗</span>
                            <span className="truncate">Repository</span>
                          </a>
                        ) : (
                          <span className="text-sm text-white/25">
                            Nessun repository
                          </span>
                        )}
                        <button
                          onClick={() => edit(p.pairIndex)}
                          className="shrink-0 rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
                        >
                          Modifica
                        </button>
                      </div>
                    </>
                  ) : (
                    /* ---------- MODIFICA ---------- */
                    <>
                      <div className="mb-4">
                        <label className={labelCls}>Repository GitHub</label>
                        <input
                          type="url"
                          inputMode="url"
                          placeholder="https://github.com/org/repo"
                          value={row.githubUrl}
                          onChange={(e) =>
                            setField(p.pairIndex, "githubUrl", e.target.value)
                          }
                          className={inputCls}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>Voto agentico</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="—"
                            value={row.voteAgentic}
                            onChange={(e) =>
                              setField(p.pairIndex, "voteAgentic", e.target.value)
                            }
                            className={`${inputCls} tabular-nums`}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Voto giuria</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="—"
                            value={row.voteJury}
                            onChange={(e) =>
                              setField(p.pairIndex, "voteJury", e.target.value)
                            }
                            className={`${inputCls} tabular-nums`}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Voto speech</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="—"
                            value={row.voteSpeech}
                            onChange={(e) =>
                              setField(p.pairIndex, "voteSpeech", e.target.value)
                            }
                            className={`${inputCls} tabular-nums`}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-end gap-3">
                        {st === "error" && (
                          <span className="mr-auto text-xs font-medium text-rose-300">
                            Errore, riprova
                          </span>
                        )}
                        {hasData(p) && (
                          <button
                            onClick={() => cancel(p.pairIndex)}
                            disabled={st === "saving"}
                            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/60 transition hover:border-white/30 hover:text-white disabled:opacity-50"
                          >
                            Annulla
                          </button>
                        )}
                        <button
                          onClick={() => save(p.pairIndex)}
                          disabled={st === "saving"}
                          className="inline-flex items-center gap-2 rounded-full bg-accenture-purple px-6 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {st === "saving" ? "Salvataggio…" : "Salva"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
