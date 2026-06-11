import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Pair } from "@/lib/pairing";

const DB_DIR = join(process.cwd(), "data");
const DB_PATH = join(DB_DIR, "hagenthon.db");

// Singleton: sopravvive all'hot-reload di Next in dev (modulo ricaricato spesso).
const globalForDb = globalThis as unknown as { __hagenthonDb?: Database.Database };

function init(): Database.Database {
  mkdirSync(DB_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      position INTEGER NOT NULL,
      name     TEXT    NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pairs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      pair_index   INTEGER NOT NULL,
      member_a     TEXT    NOT NULL,
      member_b     TEXT    NOT NULL,
      github_url   TEXT,
      vote_agentic REAL,
      vote_jury    REAL,
      vote_speech  REAL
    );
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Migrazione per DB creati prima dell'aggiunta dei campi admin.
  const cols = new Set(
    (db.prepare("PRAGMA table_info(pairs)").all() as { name: string }[]).map(
      (c) => c.name
    )
  );
  for (const col of [
    "github_url TEXT",
    "vote_agentic REAL",
    "vote_jury REAL",
    "vote_speech REAL",
  ]) {
    const name = col.split(" ")[0];
    if (!cols.has(name)) db.exec(`ALTER TABLE pairs ADD COLUMN ${col}`);
  }

  return db;
}

function getDb(): Database.Database {
  if (!globalForDb.__hagenthonDb) {
    globalForDb.__hagenthonDb = init();
  }
  return globalForDb.__hagenthonDb;
}

export type DrawState = {
  names: string[];
  pairs: Pair[];
  updatedAt: string;
};

/**
 * Salva l'estrazione corrente. Snapshot a singola sessione:
 * sovrascrive completamente lo stato precedente in modo atomico.
 */
export function saveState(names: string[], pairs: Pair[]): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM participants").run();
    db.prepare("DELETE FROM pairs").run();

    const insName = db.prepare(
      "INSERT INTO participants (position, name) VALUES (?, ?)"
    );
    names.forEach((name, i) => insName.run(i, name));

    const insPair = db.prepare(
      "INSERT INTO pairs (pair_index, member_a, member_b) VALUES (?, ?, ?)"
    );
    pairs.forEach((p, i) => insPair.run(i, p.members[0], p.members[1]));

    db.prepare(
      "INSERT INTO meta (key, value) VALUES ('updated_at', ?) " +
        "ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    ).run(new Date().toISOString());
  });
  tx();
}

/** Carica l'estrazione corrente, o null se il DB è vuoto. */
export function loadState(): DrawState | null {
  const db = getDb();
  const names = db
    .prepare("SELECT name FROM participants ORDER BY position")
    .all() as { name: string }[];

  if (names.length === 0) return null;

  const rows = db
    .prepare("SELECT pair_index, member_a, member_b FROM pairs ORDER BY pair_index")
    .all() as { pair_index: number; member_a: string; member_b: string }[];

  const meta = db
    .prepare("SELECT value FROM meta WHERE key = 'updated_at'")
    .get() as { value: string } | undefined;

  return {
    names: names.map((r) => r.name),
    pairs: rows.map((r) => ({
      id: r.pair_index,
      members: [r.member_a, r.member_b] as [string, string],
    })),
    updatedAt: meta?.value ?? "",
  };
}

/** Informazioni admin associate a una coppia. Tutti i campi sono opzionali. */
export type PairMeta = {
  githubUrl: string | null;
  voteAgentic: number | null;
  voteJury: number | null;
  voteSpeech: number | null;
};

/** Coppia arricchita con membri + dati admin, identificata dall'indice nell'estrazione corrente. */
export type AdminPair = {
  pairIndex: number;
  members: [string, string];
} & PairMeta;

/** Carica le coppie correnti con i relativi dati admin. */
export function loadAdminPairs(): AdminPair[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT pair_index, member_a, member_b, github_url, vote_agentic, vote_jury, vote_speech
       FROM pairs ORDER BY pair_index`
    )
    .all() as {
    pair_index: number;
    member_a: string;
    member_b: string;
    github_url: string | null;
    vote_agentic: number | null;
    vote_jury: number | null;
    vote_speech: number | null;
  }[];

  return rows.map((r) => ({
    pairIndex: r.pair_index,
    members: [r.member_a, r.member_b] as [string, string],
    githubUrl: r.github_url,
    voteAgentic: r.vote_agentic,
    voteJury: r.vote_jury,
    voteSpeech: r.vote_speech,
  }));
}

/**
 * Aggiorna i dati admin di una singola coppia (per indice).
 * Ritorna false se l'indice non esiste.
 */
export function updatePairMeta(pairIndex: number, meta: PairMeta): boolean {
  const db = getDb();
  const res = db
    .prepare(
      `UPDATE pairs
       SET github_url = ?, vote_agentic = ?, vote_jury = ?, vote_speech = ?
       WHERE pair_index = ?`
    )
    .run(
      meta.githubUrl,
      meta.voteAgentic,
      meta.voteJury,
      meta.voteSpeech,
      pairIndex
    );
  return res.changes > 0;
}

/** Svuota completamente il database (usato da "Ricomincia da capo"). */
export function clearState(): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM participants").run();
    db.prepare("DELETE FROM pairs").run();
    db.prepare("DELETE FROM meta").run();
  });
  tx();
}
