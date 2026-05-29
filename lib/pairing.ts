export type Pair = {
  id: number;
  members: [string, string];
};

export const TARGET_PARTICIPANTS = 40;
export const TEAM_SIZE = 2;

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

/** Genera coppie casuali dai partecipanti. Richiede numero pari. */
export function makePairs(participants: readonly string[]): Pair[] {
  const shuffled = shuffle(participants);
  const pairs: Pair[] = [];
  for (let i = 0; i < shuffled.length - 1; i += TEAM_SIZE) {
    pairs.push({
      id: i / TEAM_SIZE,
      members: [shuffled[i], shuffled[i + 1]],
    });
  }
  return pairs;
}

export type Validation = {
  ok: boolean;
  count: number;
  duplicates: string[];
  isEven: boolean;
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

  const isEven = count % TEAM_SIZE === 0;

  if (count === 0) {
    return {
      ok: false,
      count,
      duplicates,
      isEven,
      message: "Incolla la lista dei partecipanti per iniziare.",
      tone: "neutral",
    };
  }

  if (duplicates.length > 0) {
    return {
      ok: false,
      count,
      duplicates,
      isEven,
      message: `Nomi duplicati: ${[...new Set(duplicates)].join(", ")}`,
      tone: "error",
    };
  }

  if (!isEven) {
    return {
      ok: false,
      count,
      duplicates,
      isEven,
      message: `Servono partecipanti in numero pari. Ora sono ${count}: aggiungine o togline uno.`,
      tone: "error",
    };
  }

  if (count !== TARGET_PARTICIPANTS) {
    return {
      ok: true,
      count,
      duplicates,
      isEven,
      message: `${count} partecipanti · ${count / TEAM_SIZE} squadre. (L'evento ne prevede ${TARGET_PARTICIPANTS}, ma si può procedere.)`,
      tone: "warning",
    };
  }

  return {
    ok: true,
    count,
    duplicates,
    isEven,
    message: `${count} partecipanti · ${count / TEAM_SIZE} squadre. Tutto pronto.`,
    tone: "success",
  };
}
