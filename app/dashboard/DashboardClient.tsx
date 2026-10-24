"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, CalendarDays, Receipt, Wallet } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import PropertyImage from "@/components/PropertyImage";
import SaveButton from "@/components/SaveButton";
import { useToast } from "@/components/Toast";
import { BOOKING_STATUS_LABEL, PAYMENT_METHODS, PAYMENT_STATUS_LABEL, PAYMENT_TYPES } from "@/lib/constants";
import { KEYS, readList, useStoredList, writeList, type LocalBooking, type LocalPayment } from "@/lib/local-store";
import { btnPrimary } from "@/lib/ui";
import { formatDate, formatRupiah, formatShortDate, seedOf, shortCode } from "@/lib/utils";
import type { Property } from "@/types";

function SectionHead({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-5 flex items-baseline justify-between border-b border-ink/15 pb-3">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {count !== undefined && <span className="tnum text-sm text-muted">{count} item</span>}
    </div>
  );
}

/** Dashboard tanpa akun/database: semua data berasal dari localStorage di perangkat ini. */
export default function DashboardClient({ properties }: { properties: Property[] }) {
  const bookings = useStoredList<LocalBooking>(KEYS.bookings);
  const payments = useStoredList<LocalPayment>(KEYS.payments);
  const savedIds = useStoredList<string>(KEYS.saved);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const toast = useToast();

  if (!bookings || !payments || !savedIds) return null;

  const byId = new Map(properties.map((p) => [p.id, p]));
  const saved = savedIds.map((id) => byId.get(id)).filter((p): p is Property => !!p);
  const active = bookings.filter((b) => b.status === "pending");
  const paidIds = new Set(payments.filter((p) => p.status === "paid").map((p) => p.bookingId));
  const awaiting = active.filter((b) => !paidIds.has(b.id)).length;

  function cancel() {
    writeList(
      KEYS.bookings,
      readList<LocalBooking>(KEYS.bookings).map((b) => (b.id === cancelId ? { ...b, status: "cancelled" as const } : b)),
    );
    setCancelId(null);
    toast("Booking dibatalkan");
  }

  const kpis = [
    { label: "Booking aktif", value: active.length },
    { label: "Menunggu pembayaran", value: awaiting },
    { label: "Properti tersimpan", value: saved.length },
  ];

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-4xl space-y-14 px-5 py-10 md:py-14">
        <section>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">Aktivitas Anda.</h1>
          <p className="mt-3 text-muted">Data ditampilkan dari perangkat ini dan tidak disimpan di server.</p>
          <dl className="mt-8 grid divide-y divide-line overflow-hidden rounded-md border border-line bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {kpis.map((k) => (
              <div key={k.label} className="p-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{k.label}</dt>
                <dd className="tnum mt-2 font-display text-5xl text-brand-700">{k.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <SectionHead title="Jadwal survei" count={bookings.length} />
          {bookings.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="h-6 w-6" />}
              title="Belum ada jadwal survei"
              description="Pilih properti dan jadwalkan survei pertama Anda."
              action={<Link href="/properties" className={btnPrimary}>Cari properti</Link>}
            />
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-md border border-line bg-white">
              {bookings.map((b) => {
                const seed = seedOf(b.propertyId);
                return (
                  <li key={b.id} className="grid items-center gap-4 p-5 sm:grid-cols-[1.4fr_1fr_auto]">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-brand-50">
                        <PropertyImage src={b.coverImage} alt={b.propertyName} seed={seed} view={seed % 4} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{b.propertyName}</p>
                        <p className="truncate text-sm text-muted">{b.roomName}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-ink">{formatDate(b.date)}</p>
                      <p className="tnum text-muted">{b.time.slice(0, 5)} WIB · {shortCode(b.id)}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                      <StatusBadge label={BOOKING_STATUS_LABEL[b.status]} />
                      {b.status === "pending" && (
                        <button type="button" onClick={() => setCancelId(b.id)} className="text-sm font-medium text-muted hover:text-ink hover:underline">
                          Batalkan
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <SectionHead title="Status pembayaran" count={active.length} />
          {active.length === 0 ? (
            <EmptyState icon={<Wallet className="h-6 w-6" />} title="Belum ada tagihan" description="Tagihan muncul setelah Anda membuat booking." />
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-md border border-line bg-white">
              {active.map((b) => {
                const pay = payments.find((x) => x.bookingId === b.id);
                const paid = paidIds.has(b.id);
                return (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="font-semibold text-ink">{b.propertyName}</p>
                      <p className="text-sm text-muted">
                        {pay ? `${PAYMENT_TYPES[pay.type]} · ${PAYMENT_METHODS[pay.method]}` : "Belum dibayar"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge label={paid ? "Berhasil" : "Menunggu"} />
                      {!paid && (
                        <Link href={`/payment?booking=${b.id}`} className="text-sm font-semibold text-brand-700 underline-offset-4 hover:underline">
                          {pay ? "Lihat" : "Bayar sekarang"}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <SectionHead title="Properti tersimpan" count={saved.length} />
          {saved.length === 0 ? (
            <EmptyState icon={<Bookmark className="h-6 w-6" />} title="Belum ada properti tersimpan" description="Tekan Simpan Properti pada halaman detail untuk menyimpannya di sini." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {saved.map((p) => {
                const seed = seedOf(p.id);
                return (
                  <article key={p.id} className="group overflow-hidden rounded-md border border-line bg-white">
                    <div className="aspect-[16/9] overflow-hidden bg-brand-50">
                      <PropertyImage src={p.coverImage} alt={p.name} seed={seed} view={seed % 4} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">{p.type}</p>
                      <h3 className="mt-1 text-lg font-semibold text-ink">{p.name}</h3>
                      <p className="tnum mt-1 text-sm text-muted">{formatRupiah(p.price)} / bulan</p>
                      <div className="mt-4 flex gap-3">
                        <Link href={`/properties/${p.slug}`} className={btnPrimary + " flex-1"}>Lihat detail</Link>
                        <div className="flex-1"><SaveButton propertyId={p.id} initialSaved /></div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <SectionHead title="Riwayat transaksi" count={payments.length} />
          {payments.length === 0 ? (
            <EmptyState icon={<Receipt className="h-6 w-6" />} title="Belum ada transaksi" description="Riwayat pembayaran Anda akan tampil di sini." />
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-md border border-line bg-white">
              {payments.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-semibold text-ink">{PAYMENT_TYPES[t.type]}</p>
                    <p className="tnum text-sm text-muted">
                      {t.transactionId} · {formatShortDate(t.createdAt)} · {PAYMENT_METHODS[t.method]}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="tnum font-display text-xl text-ink">{formatRupiah(t.amount)}</span>
                    <StatusBadge label={PAYMENT_STATUS_LABEL[t.status]} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Modal open={cancelId !== null} title="Batalkan booking?" confirmLabel="Ya, batalkan" cancelLabel="Tidak" onClose={() => setCancelId(null)} onConfirm={cancel}>
        Jadwal survei ini akan dibatalkan.
      </Modal>
    </div>
  );
}
