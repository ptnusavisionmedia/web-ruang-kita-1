"use client";

import { useEffect, type ReactNode } from "react";

export default function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  loading = false,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !loading && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={() => !loading && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-lg bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-3xl text-ink">{title}</h2>
        <div className="mt-3 text-sm leading-relaxed text-muted">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {loading ? "Memproses…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
