import { z } from "zod";
import type { ActionResult } from "@/types";

export function todayJakarta() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}

export const BOOKING_TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] as const;

const NAME_MIN = 3;

const clean = (s: string) => s.replace(/[\u0000-\u001f\u007f<>]/g, "").trim();

export const bookingSchema = z.object({
  propertyId: z.string().min(1, "Properti tidak valid"),
  roomId: z.string().min(1, "Pilih kamar"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pilih tanggal survei")
    .refine((d) => d >= todayJakarta(), "Tanggal tidak boleh sebelum hari ini"),
  time: z.enum(BOOKING_TIMES, { message: "Pilih waktu survei" }),
  name: z.string().transform(clean).pipe(z.string().min(NAME_MIN, `Nama lengkap minimal ${NAME_MIN} karakter`).max(100)),
  whatsapp: z
    .string()
    .transform((s) => s.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^(\+62|62|0)8\d{7,12}$/, "Masukkan nomor WhatsApp yang valid, contoh 081234567890")),
  email: z.string().trim().toLowerCase().email("Masukkan alamat email yang valid").max(200),
  notes: z.string().transform(clean).pipe(z.string().max(500, "Catatan maksimal 500 karakter")).optional(),
});

/** Input mentah dari client (belum tervalidasi). */
export type BookingInput = {
  propertyId: string;
  roomId: string;
  date: string;
  time: string;
  name: string;
  whatsapp: string;
  email: string;
  notes?: string;
};

export const paymentSchema = z.object({
  bookingId: z.string().uuid(),
  type: z.enum(["booking_fee", "rent_deposit"]),
  method: z.enum(["bank_transfer", "e_wallet", "virtual_account"]),
});

export type PaymentInput = z.input<typeof paymentSchema>;

/** Ubah ZodError menjadi { namaField: pesanPertama }. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function invalid<T = undefined>(error: z.ZodError): ActionResult<T> {
  return { ok: false, message: "Periksa kembali data yang ditandai", fieldErrors: fieldErrorsFrom(error) };
}
