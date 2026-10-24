"use server";

import { fetchPropertyBySlug } from "@/lib/data";
import { bookingSchema, invalid, type BookingInput } from "@/lib/validation";
import type { ActionResult } from "@/types";

export interface CreatedBooking {
  id: string;
  date: string;
  time: string;
  whatsapp: string;
  roomName: string;
  name: string;
  email: string;
}

/** Tanpa database: jadwal divalidasi di server, lalu disimpan di browser pengguna (lib/local-store.ts). */
export async function createBooking(input: BookingInput): Promise<ActionResult<CreatedBooking>> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const v = parsed.data;

  const property = await fetchPropertyBySlug(v.propertyId);
  if (!property) return { ok: false, message: "Properti tidak ditemukan." };
  const room = property.rooms.find((r) => r.id === v.roomId);
  if (!room) return { ok: false, message: "Kamar tidak ditemukan." };
  if (!room.available) {
    return { ok: false, message: "Maaf, kamar ini sudah tidak tersedia.", fieldErrors: { roomId: "Kamar tidak tersedia" } };
  }

  return {
    ok: true,
    data: { id: crypto.randomUUID(), date: v.date, time: v.time, whatsapp: v.whatsapp, roomName: room.name, name: v.name, email: v.email },
  };
}
