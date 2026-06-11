import { NextResponse } from "next/server";
import { loadAdminPairs, updatePairMeta, type PairMeta } from "@/lib/db";

// SQLite richiede il runtime Node, non Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ pairs: loadAdminPairs() });
}

type PatchBody = {
  pairIndex?: unknown;
  githubUrl?: unknown;
  voteAgentic?: unknown;
  voteJury?: unknown;
  voteSpeech?: unknown;
};

/** Normalizza un valore in stringa non vuota oppure null. */
function toText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

/** Normalizza un valore in numero finito oppure null. */
function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function PATCH(request: Request) {
  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido." }, { status: 400 });
  }

  const pairIndex = toNumber(body.pairIndex);
  if (pairIndex === null || !Number.isInteger(pairIndex)) {
    return NextResponse.json(
      { error: "pairIndex mancante o non valido." },
      { status: 400 }
    );
  }

  const meta: PairMeta = {
    githubUrl: toText(body.githubUrl),
    voteAgentic: toNumber(body.voteAgentic),
    voteJury: toNumber(body.voteJury),
    voteSpeech: toNumber(body.voteSpeech),
  };

  const ok = updatePairMeta(pairIndex, meta);
  if (!ok) {
    return NextResponse.json(
      { error: "Coppia non trovata. Esegui prima un'estrazione." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
