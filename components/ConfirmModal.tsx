"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  // Chiusura con ESC.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !busy && onCancel()}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-gradient relative w-full max-w-md rounded-2xl p-[1px] shadow-glow"
          >
            <div className="rounded-[15px] bg-accenture-ink/95 p-7 backdrop-blur">
              <h3
                id="confirm-title"
                className="font-display text-2xl font-bold tracking-tight text-white"
              >
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{message}</p>

              <div className="mt-7 flex items-center justify-end gap-3">
                <button
                  onClick={onCancel}
                  disabled={busy}
                  className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-40"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/15 px-6 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25 active:scale-95 disabled:opacity-40"
                >
                  {busy ? "Attendi…" : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
