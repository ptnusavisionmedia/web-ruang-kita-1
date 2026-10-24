"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Building2, Check, CreditCard, Smartphone, Wallet } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import PaymentSummary from "@/components/PaymentSummary";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { BOOKING_FEE, PAYMENT_METHODS, PAYMENT_TYPES } from "@/lib/constants";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { cn, formatRupiah } from "@/lib/utils";
import { KEYS, readList, useStoredList, writeList, type LocalBooking, type LocalPayment } from "@/lib/local-store";
import type { PaymentDbMethod, PaymentType } from "@/types/database";

const METHODS: Array<{ id: PaymentDbMethod; desc: string; icon: typeof Building2 }> = [
  { id: "bank_transfer", desc: "BCA, Mandiri, BNI, BRI", icon: Building2 },
  { id: "e_wallet", desc: "GoPay, OVO, DANA", icon: Smartphone },
  { id: "virtual_account", desc: "Nomor VA unik per transaksi", icon: CreditCard },
];

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-brand-700/15 pt-8">
      <legend className="float-left mb-5 flex w-full items-baseline gap-3">
        <span className="font-display text-2xl text-accent-600">{n}</span>
        <span className="text-lg font-semibold text-ink">{title}</span>
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Radio({ checked, children, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { checked: boolean }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-md border bg-white p-4 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-600",
        checked ? "border-brand-700 shadow-[0_0_0_1px_var(--color-brand-700)]" : "border-line hover:border-brand-700/50",
      )}
    >
      <input type="radio" className="sr-only" checked={checked} {...props} />
      {children}
      <span
        className={cn(
          "ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
          checked ? "border-brand-700 bg-brand-700 text-white" : "border-line",
        )}
        aria-hidden
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
    </label>
  );
}

type Result = { id: string; amount: number; status: "pending" | "paid"; transactionId: string; method: PaymentDbMethod; type: PaymentType };

export default function PaymentClient() {
  const bookings = useStoredList<LocalBooking>(KEYS.bookings);
  const wanted = useSearchParams().get("booking");
  if (bookings === null) return null;
  const booking = bookings.find((b) => b.status !== "cancelled" && (wanted ? b.id === wanted : true));
  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24">
        <EmptyState
          icon={<Wallet className="h-6 w-6" />}
          title="Belum ada booking untuk dibayar"
          description="Jadwalkan survei terlebih dahulu, lalu lanjutkan ke pembayaran."
          action={<Link href="/properties" className={btnPrimary}>Cari properti</Link>}
        />
      </div>
    );
  }
  return <PaymentFlow booking={booking} />;
}

/** SIMULASI tanpa database dan tanpa payment gateway: tagihan hanya disimpan di browser. */
function PaymentFlow({ booking }: { booking: LocalBooking }) {
  const toast = useToast();
  const [type, setType] = useState<PaymentType>("booking_fee");
  const [method, setMethod] = useState<PaymentDbMethod>("e_wallet");
  const [agree, setAgree] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const pending = false;

  const summaryBooking = { id: booking.id, survey_date: booking.date, survey_time: booking.time, full_name: booking.name };
  const property = { id: booking.propertyId, name: booking.propertyName, area: booking.area, city: booking.city, coverImage: booking.coverImage };
  const options = {
    booking_fee: { amount: BOOKING_FEE, hint: "Mengamankan kamar selama 7 hari, dihitung sebagai bagian dari sewa." },
    rent_deposit: { amount: booking.price, hint: "Pembayaran sewa bulan pertama untuk mengunci kamar." },
  };
  const amount = options[type].amount;

  function pay() {
    const paid = method === "e_wallet";
    const rec: LocalPayment = {
      id: crypto.randomUUID(),
      bookingId: booking.id,
      type,
      method,
      amount,
      status: paid ? "paid" : "pending",
      transactionId:
        method === "virtual_account"
          ? `8808${Math.floor(1e10 + Math.random() * 9e10)}`
          : `RK${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.payments, [rec, ...readList<LocalPayment>(KEYS.payments)]);
    setConfirmOpen(false);
    setResult({ id: rec.id, amount, status: rec.status, transactionId: rec.transactionId, method, type });
    toast(paid ? "Pembayaran berhasil" : "Menunggu pembayaran Anda", paid ? "success" : "info");
  }

  function markPaid() {
    if (!result) return;
    writeList(
      KEYS.payments,
      readList<LocalPayment>(KEYS.payments).map((p) => (p.id === result.id ? { ...p, status: "paid" as const } : p)),
    );
    setResult({ ...result, status: "paid" });
    toast("Pembayaran berhasil (simulasi)");
  }

  if (result) {
    const ok = result.status === "paid";
    return (
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div>
          <p className="eyebrow">{ok ? "Pembayaran diterima" : "Menunggu pembayaran"}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
            {ok ? "Terima kasih, pembayaran berhasil." : "Selesaikan pembayaran Anda."}
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            {ok
              ? `${PAYMENT_TYPES[result.type]} sebesar ${formatRupiah(result.amount)} telah kami terima. Kamar Anda aman.`
              : `Transfer ${formatRupiah(result.amount)} melalui ${PAYMENT_METHODS[result.method]} menggunakan nomor di bawah ini.`}
          </p>

          <div className="mt-8 rounded-md border border-dashed border-brand-700/40 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {result.method === "virtual_account" ? "Nomor virtual account" : "Nomor referensi"}
            </p>
            <p className="tnum mt-2 font-display text-3xl tracking-wide text-brand-700 [overflow-wrap:anywhere]">{result.transactionId}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!ok && (
              <button onClick={markPaid} disabled={pending} className={btnPrimary}>
                Simulasikan pembayaran selesai
              </button>
            )}
            <Link href="/dashboard" className={ok ? btnPrimary : btnOutline}>
              Ke dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <PaymentSummary
          property={property}
          roomName={booking.roomName}
          booking={summaryBooking}
          kind={PAYMENT_TYPES[result.type]}
          method={PAYMENT_METHODS[result.method]}
          amount={result.amount}
          stamp={ok ? { text: "LUNAS", tone: "paid" } : { text: "MENUNGGU", tone: "pending" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
      <p className="eyebrow">Pembayaran</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">Amankan kamar Anda.</h1>
      <p className="mb-12 mt-4 max-w-lg text-muted">Pilih jenis dan metode pembayaran. Anda bisa meninjau ringkasannya di sebelah kanan.</p>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-10">
          <Block n="01" title="Jenis pembayaran">
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(options) as PaymentType[]).map((k) => (
                <Radio key={k} name="kind" checked={type === k} onChange={() => setType(k)}>
                  <span>
                    <span className="block font-medium text-ink">{PAYMENT_TYPES[k]}</span>
                    <span className="tnum block font-display text-xl text-brand-700">{formatRupiah(options[k].amount)}</span>
                    <span className="mt-1 block text-xs leading-snug text-muted">{options[k].hint}</span>
                  </span>
                </Radio>
              ))}
            </div>
          </Block>

          <Block n="02" title="Metode pembayaran">
            <div className="space-y-3">
              {METHODS.map((m) => (
                <Radio key={m.id} name="method" checked={method === m.id} onChange={() => setMethod(m.id)}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                    <m.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-medium text-ink">{PAYMENT_METHODS[m.id]}</span>
                    <span className="block text-sm text-muted">{m.desc}</span>
                  </span>
                </Radio>
              ))}
            </div>
          </Block>

          <Block n="03" title="Persetujuan">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/85">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-700" />
              Saya menyetujui syarat dan ketentuan sewa serta kebijakan pembatalan RuangKita.
            </label>
          </Block>

          <button type="button" disabled={!agree} onClick={() => setConfirmOpen(true)} className={btnPrimary + " w-full py-4 text-base"}>
            Bayar Sekarang · {formatRupiah(amount)}
          </button>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PaymentSummary property={property} roomName={booking.roomName} booking={summaryBooking} kind={PAYMENT_TYPES[type]} amount={amount} />
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Konfirmasi pembayaran"
        confirmLabel="Ya, Bayar"
        loading={pending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={pay}
      >
        Anda akan membayar <strong className="text-ink">{formatRupiah(amount)}</strong> untuk {PAYMENT_TYPES[type].toLowerCase()} melalui {PAYMENT_METHODS[method]}. Ini adalah simulasi, tidak ada uang yang ditarik.
      </Modal>
    </div>
  );
}
