import { NextResponse } from "next/server";
import { clearState, loadState, saveState } from "@/lib/db";
import { validate, type Pair } from "@/lib/pairing";

// SQLite richiede il runtime Node, non Edge.
export const runtime = "nodejs";
// Stato sempre fresco, mai cache.
export const dynamic = "force-dynamic";

export function GET() {
  const state = loadState();
  return NextResponse.json({ state });
}

type SaveBody = {
  names?: unknown;
  pairs?: unknown;
};

export async function PUT(request: Request) {
  let body: SaveBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido." }, { status: 400 });
  }

  const names = Array.isArray(body.names)
    ? body.names.filter((n): n is string => typeof n === "string")
    : [];
  const pairs = Array.isArray(body.pairs) ? (body.pairs as Pair[]) : [];

  const v = validate(names);
  if (!v.ok) {
    return NextResponse.json({ error: v.message }, { status: 422 });
  }

  saveState(names, pairs);
  return NextResponse.json({ ok: true });
}

export function DELETE() {
  clearState();
  return NextResponse.json({ ok: true });
}
