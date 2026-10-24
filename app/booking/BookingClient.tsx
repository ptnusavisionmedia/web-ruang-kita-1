"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { IconPin } from "@/components/icons";
import type { CreatedBooking } from "@/app/actions/bookings";
import BookingForm from "@/components/BookingForm";
import PropertyImage from "@/components/PropertyImage";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { KEYS, readList, writeList, type LocalBooking } from "@/lib/local-store";
import { cn, formatDate, formatRupiah, seedOf, shortCode } from "@/lib/utils";
import type { PropertyDetail } from "@/types";

const STEPS = ["Jadwal survei", "Data kontak", "Konfirmasi"];

export default function BookingClient({
  property,
  minDate,
  defaultName,
  defaultEmail,
}: {
  property: PropertyDetail;
  minDate: string;
  defaultName: string;
  defaultEmail: string;
}) {
  const [done, setDone] = useState<CreatedBooking | null>(null);
  const rooms = property.rooms.filter((r) => r.available && r.status === "available");
  const seed = seedOf(property.id);
  const current = done ? 3 : 1;

  // Tanpa database: booking disimpan di browser agar tampil di dashboard dan bisa dibayar.
  function save(b: CreatedBooking, roomId: string) {
    const room = property.rooms.find((r) => r.id === roomId);
    const entry: LocalBooking = {
      id: b.id,
      propertyId: property.id,
      propertySlug: property.slug,
      propertyName: property.name,
      area: property.area,
      city: property.city,
      coverImage: property.coverImage,
      roomName: b.roomName,
      price: Number(room?.price_monthly ?? property.price),
      date: b.date,
      time: b.time,
      name: b.name,
      email: b.email,
      whatsapp: b.whatsapp,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.bookings, [entry, ...readList<LocalBooking>(KEYS.bookings)]);
    setDone(b);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] min-h-[calc(100vh-4rem)] lg:grid-cols-[420px_minmax(0,1fr)]">
      {/* PANEL KIRI */}
      <aside className="grain relative bg-brand-800 text-white">
        <div className="lg:sticky lg:top-16">
          <div className="aspect-[16/10] overflow-hidden lg:aspect-[4/3]">
            <PropertyImage src={property.coverImage} alt={property.name} seed={seed} view={seed % 4} />
          </div>
          <div className="px-7 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">{property.type}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight">{property.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
              <IconPin size={20} className="text-white" /> {[property.area, property.city].filter(Boolean).join(", ")}
            </p>
            <p className="tnum mt-5 text-white/80">
              Mulai <span className="text-xl font-semibold text-white">{formatRupiah(property.price)}</span> / bulan
            </p>

            <ol className="mt-9 space-y-5 border-t border-white/15 pt-8">
              {STEPS.map((s, i) => {
                const n = i + 1;
                const complete = n < current || (done && n <= 3);
                const active = n === current;
                return (
                  <li key={s} className="flex items-center gap-4">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                        complete ? "border-accent-500 bg-accent-500 text-brand-900" : active ? "border-white text-white" : "border-white/25 text-white/45",
                      )}
                    >
                      {complete ? <Check className="h-4 w-4" strokeWidth={3} /> : n}
                    </span>
                    <span className={cn("text-sm", active || complete ? "font-medium text-white" : "text-white/50")}>{s}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </aside>

      {/* KONTEN KANAN */}
      <div className="bg-paper px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-xl">
          {done ? (
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white">
                <Check className="h-7 w-7" strokeWidth={2.5} />
              </span>
              <h1 className="mt-6 font-display text-4xl leading-tight text-ink md:text-5xl">Survei Anda sudah dijadwalkan.</h1>
              <p className="mt-4 text-muted">
                Konfirmasi akan dikirim ke WhatsApp <span className="tnum font-medium text-ink">{done.whatsapp}</span>.
              </p>

              <div className="relative mt-9 rounded-md border border-line bg-white">
                <div className="grid grid-cols-2 gap-6 p-7">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Kode booking</p>
                    <p className="tnum mt-1 font-display text-2xl text-brand-700">{shortCode(done.id)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Kamar</p>
                    <p className="mt-1 font-semibold text-ink">{done.roomName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs uppercase tracking-wider text-muted">Jadwal</p>
                    <p className="mt-1 font-semibold text-ink">{formatDate(done.date)}, {done.time.slice(0, 5)} WIB</p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-line bg-paper [clip-path:inset(50%_0_0_50%)]" aria-hidden />
                  <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-line bg-paper [clip-path:inset(50%_50%_0_0)]" aria-hidden />
                  <div className="perforation mx-5" />
                </div>
                <p className="p-7 pt-5 text-sm text-muted">Tunjukkan kode ini ke pengelola saat tiba di lokasi.</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={`/payment?booking=${done.id}`} className={btnPrimary}>
                  Lanjut ke pembayaran <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard" className={btnOutline}>Lihat dashboard</Link>
              </div>
            </div>
          ) : (
            <>
              <p className="eyebrow">Booking survei</p>
              <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">Jadwalkan survei Anda.</h1>
              <p className="mb-10 mt-4 text-muted">Isi data singkat di bawah. Survei gratis dan tanpa komitmen.</p>
              <BookingForm
                propertyId={property.id}
                rooms={rooms}
                minDate={minDate}
                defaultName={defaultName}
                defaultEmail={defaultEmail}
                onSuccess={save}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
