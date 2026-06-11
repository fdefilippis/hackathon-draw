import type { Metadata } from "next";
import Link from "next/link";
import Background from "@/components/Background";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Pannello Admin · Hagenthon",
  description:
    "Pannello di gestione delle coppie: repository GitHub e valutazioni (agentico, giuria, speech).",
};

export default function AdminPage() {
  return (
    <>
      <Background intensity={0.7} />
      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <span className="text-base">{"←"}</span>
            Estrazione
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-display text-xl font-bold tracking-tight">
              Hagenthon
              <span className="acn-mark ml-[2px]">{">"}</span>
            </span>
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accenture-purpleLight">
                Accenture
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Application Engineering
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <AdminPanel />
        </div>

        <footer className="mt-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/25">
          <span>Hagenthon</span>
          <span className="text-accenture-purple">{">"}</span>
          <span>Accenture Application Engineering</span>
        </footer>
      </main>
    </>
  );
}
