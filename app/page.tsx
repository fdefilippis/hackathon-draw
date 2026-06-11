"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Background from "@/components/Background";
import BrandHeader from "@/components/BrandHeader";
import IntroScreen from "@/components/IntroScreen";
import InputScreen from "@/components/InputScreen";
import DrawingScreen from "@/components/DrawingScreen";
import ResultsScreen from "@/components/ResultsScreen";
import { makePairs, type Pair } from "@/lib/pairing";

type Step = "intro" | "input" | "drawing" | "results";

/** Salva l'estrazione corrente nel DB. Degradazione morbida: l'app prosegue anche se fallisce. */
async function persist(names: string[], pairs: Pair[]): Promise<void> {
  try {
    await fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names, pairs }),
    });
  } catch (err) {
    console.error("Salvataggio stato fallito", err);
  }
}

export default function Home() {
  const [step, setStep] = useState<Step>("intro");
  const [names, setNames] = useState<string[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);

  // Ripristino dell'ultima estrazione salvata al caricamento.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/state");
        if (!res.ok) return;
        const { state } = (await res.json()) as {
          state: { names: string[]; pairs: Pair[] } | null;
        };
        if (!cancelled && state && state.pairs.length > 0) {
          setNames(state.names);
          setPairs(state.pairs);
          setStep("results");
        }
      } catch (err) {
        console.error("Ripristino stato fallito", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startDraw = useCallback((list: string[]) => {
    const nextPairs = makePairs(list);
    setNames(list);
    setPairs(nextPairs);
    setStep("drawing");
    void persist(list, nextPairs);
  }, []);

  const regenerate = useCallback(() => {
    const nextPairs = makePairs(names);
    setPairs(nextPairs);
    setStep("drawing");
    void persist(names, nextPairs);
  }, [names]);

  const restart = useCallback(async () => {
    try {
      await fetch("/api/state", { method: "DELETE" });
    } catch (err) {
      console.error("Pulizia DB fallita", err);
    }
    setNames([]);
    setPairs([]);
    setStep("intro");
  }, []);

  // Sfondo più intenso durante l'estrazione e i risultati
  const intensity = step === "drawing" || step === "results" ? 1.25 : 0.85;

  return (
    <>
      <Background intensity={intensity} />
      <main className="vignette relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <BrandHeader compact={step !== "intro"} />

        <div className="flex flex-1 flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <IntroScreen key="intro" onStart={() => setStep("input")} />
            )}
            {step === "input" && (
              <InputScreen
                key="input"
                onDraw={startDraw}
                onBack={() => setStep("intro")}
              />
            )}
            {step === "drawing" && (
              <DrawingScreen
                key="drawing"
                pairs={pairs}
                allNames={names}
                onComplete={() => setStep("results")}
              />
            )}
            {step === "results" && (
              <ResultsScreen
                key="results"
                pairs={pairs}
                onRegenerate={regenerate}
                onRestart={restart}
              />
            )}
          </AnimatePresence>
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
