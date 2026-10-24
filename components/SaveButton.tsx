"use client";

import { useEffect, useState } from "react";
import { IconBookmark } from "@/components/icons";
import { KEYS, readList, writeList } from "@/lib/local-store";
import { useToast } from "./Toast";

export default function SaveButton({
  propertyId,
  initialSaved = false,
  variant = "button",
}: {
  propertyId: string;
  initialSaved?: boolean;
  variant?: "button" | "icon" | "icon-outline";
}) {
  const [saved, setSaved] = useState(initialSaved);
  const pending = false;
  const toast = useToast();

  // Simpanan disimpan di browser (tanpa akun / database).
  useEffect(() => {
    setSaved(readList<string>(KEYS.saved).includes(propertyId));
  }, [propertyId]);

  function onClick() {
    const list = readList<string>(KEYS.saved);
    const next = !list.includes(propertyId);
    writeList(KEYS.saved, next ? [...list, propertyId] : list.filter((id) => id !== propertyId));
    setSaved(next);
    toast(next ? "Properti disimpan" : "Properti dihapus dari simpanan", next ? "success" : "info");
  }

  if (variant === "icon-outline") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={saved}
        aria-label={saved ? "Hapus dari simpanan" : "Simpan properti"}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-brand-700 transition-colors hover:border-brand-700 hover:bg-brand-50 disabled:opacity-60"
      >
        <IconBookmark size={20} filled={saved} />
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={saved}
        aria-label={saved ? "Hapus dari simpanan" : "Simpan properti"}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-sm hover:bg-white disabled:opacity-60"
      >
        <IconBookmark size={20} filled={saved} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={saved}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-brand-700/30 px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:border-brand-700 hover:bg-brand-50 disabled:opacity-60"
    >
      <IconBookmark size={20} filled={saved} />
      {saved ? "Tersimpan" : "Simpan Properti"}
    </button>
  );
}
