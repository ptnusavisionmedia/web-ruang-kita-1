"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

type ToastKind = "success" | "info";
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, message, kind }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6"
        aria-live="polite"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-md bg-brand-900 px-4 py-3 text-sm text-white shadow-lg"
          >
            {t.kind === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-400" />
            ) : (
              <Info className="h-4 w-4 shrink-0 text-accent-400" />
            )}
            <span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Tutup notifikasi" className="text-white/60 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
