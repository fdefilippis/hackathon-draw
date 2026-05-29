"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import Background from "@/components/Background";
import BrandHeader from "@/components/BrandHeader";
import IntroScreen from "@/components/IntroScreen";
import InputScreen from "@/components/InputScreen";
import DrawingScreen from "@/components/DrawingScreen";
import ResultsScreen from "@/components/ResultsScreen";
import { makePairs, type Pair } from "@/lib/pairing";

type Step = "intro" | "input" | "drawing" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("intro");
  const [names, setNames] = useState<string[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);

  const startDraw = useCallback((list: string[]) => {
    setNames(list);
    setPairs(makePairs(list));
    setStep("drawing");
  }, []);

  const regenerate = useCallback(() => {
    setPairs(makePairs(names));
    setStep("drawing");
  }, [names]);

  const restart = useCallback(() => {
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
