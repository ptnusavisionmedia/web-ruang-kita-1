"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { IconBuilding, IconPin, IconSearch, IconWallet } from "@/components/icons";
import { PROPERTY_TYPES } from "@/lib/constants";

const PRICE_RANGES = [
  { label: "Semua harga", value: "" },
  { label: "Di bawah Rp 1,5 jt", value: "0-1500000" },
  { label: "Rp 1,5 – 3 jt", value: "1500000-3000000" },
  { label: "Rp 3 – 6 jt", value: "3000000-6000000" },
  { label: "Di atas Rp 6 jt", value: "6000000-" },
];

const control = "w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-muted/70";

/** Mode compact: pencarian teks untuk katalog. Mode default: kotak pencarian besar di hero. */
export default function SearchBar({
  compact = false,
  query,
  onQueryChange,
}: {
  compact?: boolean;
  query?: string;
  onQueryChange?: (v: string) => void;
}) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  if (compact) {
    return (
      <label className="flex items-center gap-3 rounded-md border border-line bg-white px-5 py-3.5 transition-colors focus-within:border-brand-700 focus-within:ring-4 focus-within:ring-brand-100">
        <IconSearch size={22} className="text-brand-700" />
        <input
          type="search"
          value={query ?? ""}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Cari nama properti, kota, atau area"
          className={control}
          aria-label="Cari properti"
        />
      </label>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    if (type) params.set("type", type);
    if (price) {
      const [min, max] = price.split("-");
      if (min && min !== "0") params.set("min", min);
      if (max) params.set("max", max);
    }
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  }

  const cell = "flex items-center gap-3 px-5 py-4 md:border-r md:border-line";
  const label = "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted";

  return (
    <form
      onSubmit={onSubmit}
      className="grid overflow-hidden rounded-lg border border-line bg-white md:grid-cols-[1.3fr_1fr_1fr_auto]"
    >
      <label className={`${cell} border-b border-line md:border-b-0`}>
        <IconPin size={26} className="shrink-0 text-brand-700" />
        <span className="flex w-full flex-col gap-0.5">
          <span className={label}>Lokasi</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kota atau area" className={control} />
        </span>
      </label>
      <label className={`${cell} border-b border-line md:border-b-0`}>
        <IconBuilding size={26} className="shrink-0 text-brand-700" />
        <span className="flex w-full flex-col gap-0.5">
          <span className={label}>Tipe</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className={control}>
            <option value="">Semua tipe</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </span>
      </label>
      <label className={`${cell} border-b border-line md:border-b-0`}>
        <IconWallet size={26} className="shrink-0 text-brand-700" />
        <span className="flex w-full flex-col gap-0.5">
          <span className={label}>Harga / bulan</span>
          <select value={price} onChange={(e) => setPrice(e.target.value)} className={control}>
            {PRICE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </span>
      </label>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-brand-700 px-9 py-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
      >
        <IconSearch size={20} className="text-white" />
        Cari Kamar
      </button>
    </form>
  );
}
