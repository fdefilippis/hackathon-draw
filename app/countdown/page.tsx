"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Background from "@/components/Background";

/** Orario di ritrovo: oggi alle 15:30 (ora locale). */
const TARGET_H = 15;
const TARGET_M = 30;

function targetDate(): Date {
  const t = new Date();
  t.setHours(TARGET_H, TARGET_M, 0, 0);
  return t;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

type Remaining = { h: string; m: string; s: string; done: boolean };

function computeRemaining(target: Date): Remaining {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { h: "00", m: "00", s: "00", done: true };
  const totalSec = Math.floor(diff / 1000);
  return {
    h: pad(Math.floor(totalSec / 3600)),
    m: pad(Math.floor((totalSec % 3600) / 60)),
    s: pad(totalSec % 60),
    done: false,
  };
}

export default function CountdownPage() {
  const targetRef = useRef<Date>(targetDate());
  const [time, setTime] = useState<Remaining>(() =>
    computeRemaining(targetRef.current)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(computeRemaining(targetRef.current));
    }, 250);
    return () => clearInterval(id);
  }, []);

  // Aggiorna il titolo della tab con il tempo residuo.
  useEffect(() => {
    document.title = time.done
      ? "È ora! · 15:30"
      : `${time.h}:${time.m}:${time.s} · 15:30`;
  }, [time]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  // Tasto "F" per lo schermo intero.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen]);

  return (
    <>
      <Background intensity={time.done ? 1.4 : 1} />
      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <span className="text-base">{"←"}</span>
            Estrazione
          </Link>
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-accenture-purple/60 hover:text-white"
          >
            Schermo intero
            <span className="text-white/40">(F)</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {time.done ? (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="font-display text-6xl font-black leading-none sm:text-8xl md:text-9xl"
            >
              <span className="text-gradient-anim animate-shimmer">È ORA!</span>
              <span className="ml-3">🚀</span>
            </motion.div>
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 text-xs font-semibold uppercase tracking-[0.5em] text-white/45 sm:text-sm"
              >
                Si riparte tra
              </motion.p>

              <div className="flex items-start justify-center gap-2 sm:gap-6">
                <TimeUnit value={time.h} label="ore" />
                <Separator />
                <TimeUnit value={time.m} label="min" />
                <Separator />
                <TimeUnit value={time.s} label="sec" />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-10 text-base text-white/55 sm:text-xl"
              >
                Ritrovo alle{" "}
                <b className="font-bold text-accenture-purpleLight">15:30</b>
              </motion.p>
            </>
          )}
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

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4">
      <span className="font-display text-[22vw] font-black leading-none tabular-nums text-white drop-shadow-[0_0_60px_rgba(161,0,255,0.25)] sm:text-[16vw] md:text-[14rem]">
        {value}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 sm:text-sm">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="animate-pulse self-center pt-[6vw] font-display text-[14vw] font-black leading-none text-white/25 sm:pt-0 sm:text-[10vw] md:text-9xl">
      :
    </span>
  );
}
