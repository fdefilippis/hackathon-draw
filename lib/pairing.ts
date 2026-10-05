import { findParticipant, PARTICIPANTS, type Sede } from "@/lib/participants";

/**
 * Squadra estratta: una coppia o, solo se inevitabile, un terzetto.
 * Unica eccezione: chi è l'unico partecipante da remoto gareggia da solo.
 */
export type Pair = {
  id: number;
  members: string[];
};

export const TARGET_PARTICIPANTS = PARTICIPANTS.length;
/**
 * Normalizza il testo incollato in una lista pulita di nomi.
 * - separa per riga
 * - rimuove spazi superflui
 * - scarta righe vuote
 * - elimina eventuali numerazioni iniziali (es. "1. Mario", "1) Mario", "- Mario")
 */
export function parseParticipants(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) =>
      line
        .replace(/^\s*[-*•]\s+/, "")
        .replace(/^\s*\d+[.)]\s*/, "")
        .trim()
    )
    .filter((line) => line.length > 0);
}

/** Fisher–Yates: shuffle uniforme e immutabile. */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Composizione delle squadre di una sede: quante coppie e quanti terzetti. */
export type SedePlan = {
  sede: Sede;
  people: number;
  licensed: number;
  pairs: number;
  triples: number;
  /** L'unico partecipante da remoto gareggia da solo. */
  solo: boolean;
};

/**
 * Calcola come dividere una sede in squadre, ciascuna con almeno una
 * licenza Claude Code. Le squadre possibili sono al massimo quante le licenze:
 * con t terzetti le squadre sono (n - t) / 2, quindi servono
 * t >= n - 2k terzetti, oltre a uno se n è dispari.
 * Ritorna null se nemmeno con i terzetti si riesce (3t > n).
 */
export function planSede(sede: Sede, people: number, licensed: number): SedePlan | null {
  const base = { sede, people, licensed, pairs: 0, triples: 0, solo: false };
  if (people === 0) return base;
  if (people === 1 && sede === "Remoto") return { ...base, solo: true };
  const triples = Math.max(people % 2, people - 2 * licensed);
  if (licensed === 0 || triples * 3 > people) return null;
  const teams = (people - triples) / 2;
  return { ...base, pairs: teams - triples, triples };
}

type Grouped = { sede: Sede; licensed: string[]; others: string[] }[];

/** Raggruppa i nomi per sede, separando chi ha la licenza Claude Code. */
function groupBySede(names: readonly string[]): Grouped {
  const groups = new Map<Sede, { licensed: string[]; others: string[] }>();
  for (const name of names) {
    const p = findParticipant(name);
    if (!p) throw new Error(`${name} non è in anagrafica.`);
    const g = groups.get(p.sede) ?? { licensed: [], others: [] };
    (p.claudeCode ? g.licensed : g.others).push(name);
    groups.set(p.sede, g);
  }
  return [...groups].map(([sede, g]) => ({ sede, ...g }));
}

/**
 * Genera le squadre: mai miste tra sedi, ognuna con almeno una licenza
 * Claude Code, terzetti solo nel numero minimo indispensabile.
 * Presuppone una lista che ha superato `validate`.
 */
export function makePairs(participants: readonly string[]): Pair[] {
  const teams: string[][] = [];

  for (const { sede, licensed, others } of groupBySede(participants)) {
    const plan = planSede(sede, licensed.length + others.length, licensed.length);
    if (!plan) throw new Error(`Impossibile formare le squadre di ${sede}.`);
    if (plan.solo) {
      teams.push([...licensed, ...others]);
      continue;
    }

    // Ogni squadra parte da una licenza; il resto si distribuisce a caso.
    const count = plan.pairs + plan.triples;
    const anchors = shuffle(licensed);
    const rest = shuffle([...anchors.slice(count), ...others]);
    const sizes = shuffle([
      ...Array<number>(plan.pairs).fill(2),
      ...Array<number>(plan.triples).fill(3),
    ]);

    let next = 0;
    sizes.forEach((size, i) => {
      const team = [anchors[i], ...rest.slice(next, next + size - 1)];
      next += size - 1;
      teams.push(shuffle(team));
    });
  }

  return shuffle(teams).map((members, id) => ({ id, members }));
}

export type Validation = {
  ok: boolean;
  count: number;
  duplicates: string[];
  message: string;
  tone: "neutral" | "warning" | "error" | "success";
};

export function validate(names: string[]): Validation {
  const count = names.length;

  // Duplicati case-insensitive
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const n of names) {
    const key = n.toLowerCase();
    if (seen.has(key)) {
      duplicates.push(n);
    } else {
      seen.set(key, n);
    }
  }

  const fail = (message: string, tone: Validation["tone"] = "error"): Validation => ({
    ok: false,
    count,
    duplicates,
    message,
    tone,
  });

  if (count === 0) {
    return fail("Incolla la lista dei partecipanti per iniziare.", "neutral");
  }

  if (duplicates.length > 0) {
    return fail(`Nomi duplicati: ${[...new Set(duplicates)].join(", ")}`);
  }

  const unknown = names.filter((n) => !findParticipant(n));
  if (unknown.length > 0) {
    return fail(`Non presenti in anagrafica (sede e licenza ignote): ${unknown.join(", ")}`);
  }

  const plans: SedePlan[] = [];
  for (const { sede, licensed, others } of groupBySede(names)) {
    const people = licensed.length + others.length;
    const plan = planSede(sede, people, licensed.length);
    if (!plan) {
      return fail(
        people === 1
          ? `${sede}: un solo partecipante, non può fare squadra.`
          : licensed.length === 0
            ? `${sede}: nessuna licenza Claude Code tra i ${people} partecipanti.`
            : `${sede}: ${people} partecipanti e ${licensed.length} licenze Claude Code, non bastano neanche con i terzetti.`
      );
    }
    plans.push(plan);
  }

  const teamsOf = (p: SedePlan) => p.pairs + p.triples + (p.solo ? 1 : 0);
  const teams = plans.reduce((sum, p) => sum + teamsOf(p), 0);
  const detail = plans
    .map((p) => {
      const note = p.solo ? " (da solo)" : p.triples > 0 ? ` (${p.triples} da 3)` : "";
      return `${p.sede} ${teamsOf(p)}${note}`;
    })
    .join(" · ");
  const summary = `${count} partecipanti · ${teams} squadre: ${detail}.`;

  if (count !== TARGET_PARTICIPANTS) {
    return {
      ok: true,
      count,
      duplicates,
      message: `${summary} (L'evento ne prevede ${TARGET_PARTICIPANTS}, ma si può procedere.)`,
      tone: "warning",
    };
  }

  return {
    ok: true,
    count,
    duplicates,
    message: `${summary} Tutto pronto.`,
    tone: "success",
  };
}
