"use client";

import { useCallback, useEffect, useState } from "react";

/** Penyimpanan di browser (localStorage). Menggantikan database: data hanya ada di perangkat ini. */

export interface LocalBooking {
  id: string;
  propertyId: string;
  propertySlug: string;
  propertyName: string;
  area: string;
  city: string;
  coverImage: string | null;
  roomName: string;
  price: number;
  date: string;
  time: string;
  name: string;
  email: string;
  whatsapp: string;
  status: "pending" | "cancelled";
  createdAt: string;
}

export interface LocalPayment {
  id: string;
  bookingId: string;
  type: "booking_fee" | "rent_deposit";
  method: "bank_transfer" | "e_wallet" | "virtual_account";
  amount: number;
  status: "pending" | "paid";
  transactionId: string;
  createdAt: string;
}

export const KEYS = {
  bookings: "ruangkita:bookings",
  payments: "ruangkita:payments",
  saved: "ruangkita:saved",
} as const;

export function readList<T>(key: string): T[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

export function writeList<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new Event("ruangkita:store"));
  } catch {
    // Penyimpanan penuh / diblokir: abaikan.
  }
}

/** Daftar dari localStorage yang ikut diperbarui saat ada perubahan. `null` sebelum dibaca di browser. */
export function useStoredList<T>(key: string) {
  const [list, setList] = useState<T[] | null>(null);
  const load = useCallback(() => setList(readList<T>(key)), [key]);
  useEffect(() => {
    load();
    window.addEventListener("ruangkita:store", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("ruangkita:store", load);
      window.removeEventListener("storage", load);
    };
  }, [load]);
  return list;
}
