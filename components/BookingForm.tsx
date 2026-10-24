"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createBooking, type CreatedBooking } from "@/app/actions/bookings";
import { BOOKING_TIMES, bookingSchema, fieldErrorsFrom } from "@/lib/validation";
import { btnPrimary, field } from "@/lib/ui";
import { cn, formatRupiah } from "@/lib/utils";
import type { RoomRow } from "@/types/database";
import { useToast } from "./Toast";

type Errors = Partial<Record<"roomId" | "date" | "time" | "name" | "whatsapp" | "email" | "notes", string>>;

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 border-t border-brand-700/15 pt-8">
      <legend className="float-left mb-5 flex w-full items-baseline gap-3">
        <span className="font-display text-2xl text-accent-600">{n}</span>
        <span className="text-lg font-semibold text-ink">{title}</span>
      </legend>
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  );
}

export default function BookingForm({
  propertyId,
  rooms,
  minDate,
  defaultName = "",
  defaultEmail = "",
  onSuccess,
}: {
  propertyId: string;
  rooms: RoomRow[];
  minDate: string;
  defaultName?: string;
  defaultEmail?: string;
  onSuccess: (b: CreatedBooking, roomId: string) => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState({
    roomId: rooms[0]?.id ?? "",
    date: "",
    time: "",
    name: defaultName,
    whatsapp: "",
    email: defaultEmail,
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (k: keyof typeof values, v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const payload = { propertyId, ...values };

    // Validasi cepat di browser; server tetap memvalidasi ulang.
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrorsFrom(parsed.error) as Errors);
      toast("Periksa kembali data yang ditandai", "info");
      return;
    }

    startTransition(async () => {
      const res = await createBooking(payload);
      if (!res.ok || !res.data) {
        setErrors((res.fieldErrors ?? {}) as Errors);
        setFormError(res.message ?? "Booking gagal. Coba lagi.");
        return;
      }
      onSuccess(res.data, values.roomId);
    });
  }

  const err = (k: keyof Errors) =>
    errors[k] ? <p id={`${k}-err`} className="mt-1.5 text-xs text-red-700">{errors[k]}</p> : null;
  const invalid = (k: keyof Errors) => (errors[k] ? "!border-red-600" : "");
  const label = "mb-2 block text-sm font-medium text-ink";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      {formError && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</p>
      )}

      <Block n="01" title="Jadwal survei">
        <div>
          <label htmlFor="roomId" className={label}>Kamar</label>
          <select id="roomId" value={values.roomId} onChange={(e) => set("roomId", e.target.value)} className={cn(field, invalid("roomId"))}>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {formatRupiah(Number(r.price_monthly))} / bulan
              </option>
            ))}
          </select>
          {err("roomId")}
        </div>

        <div>
          <label htmlFor="date" className={label}>Tanggal</label>
          <input
            id="date"
            type="date"
            min={minDate}
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "date-err" : undefined}
            className={cn(field, invalid("date"))}
          />
          {err("date")}
        </div>

        <div>
          <p className={label} id="time-label">Waktu</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-labelledby="time-label">
            {BOOKING_TIMES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={values.time === t}
                onClick={() => set("time", t)}
                className={cn(
                  "tnum rounded-md border px-3 py-3 text-sm font-medium transition-colors",
                  values.time === t
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-line bg-white text-ink hover:border-brand-700",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {err("time")}
        </div>
      </Block>

      <Block n="02" title="Data kontak">
        <div>
          <label htmlFor="name" className={label}>Nama lengkap</label>
          <input
            id="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-err" : undefined}
            className={cn(field, invalid("name"))}
          />
          {err("name")}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="whatsapp" className={label}>Nomor WhatsApp</label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="08xxxxxxxxxx"
              value={values.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              aria-invalid={!!errors.whatsapp}
              aria-describedby={errors.whatsapp ? "whatsapp-err" : undefined}
              className={cn(field, "tnum", invalid("whatsapp"))}
            />
            {err("whatsapp")}
          </div>
          <div>
            <label htmlFor="email" className={label}>Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-err" : undefined}
              className={cn(field, invalid("email"))}
            />
            {err("email")}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className={label}>
            Catatan tambahan <span className="font-normal text-muted">(opsional)</span>
          </label>
          <textarea id="notes" rows={3} value={values.notes} onChange={(e) => set("notes", e.target.value)} className={cn(field, invalid("notes"))} />
          {err("notes")}
        </div>
      </Block>

      <button type="submit" disabled={pending} className={btnPrimary + " w-full py-4 text-base"}>
        {pending ? "Memproses…" : "Konfirmasi Booking"}
      </button>
    </form>
  );
}
