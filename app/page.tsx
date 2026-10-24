import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import PropertyImage from "@/components/PropertyImage";
import DataNotice from "@/components/DataNotice";
import DoorArch from "@/components/DoorArch";
import IconTile from "@/components/IconTile";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { Skeleton } from "@/components/Skeleton";
import { IconCalendar, IconChat, IconSearch, IconShield, IconTag, IconHeadset, IconWallet } from "@/components/icons";
import { fetchHomeStats, fetchPopularProperties } from "@/lib/data";
import { btnGold, btnOutline, btnPrimary } from "@/lib/ui";

export const metadata = { title: "RuangKita — Cari dan booking kos, apartemen, rumah" };

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=75";

const steps = [
  { icon: IconSearch, title: "Cari kamar", text: "Saring berdasarkan lokasi, harga, dan fasilitas." },
  { icon: IconCalendar, title: "Jadwalkan survei", text: "Pilih tanggal dan jam, lihat kamarnya langsung." },
  { icon: IconWallet, title: "Booking dan bayar", text: "Amankan kamar dengan pembayaran yang tercatat." },
];

const perks = [
  { icon: IconShield, title: "Properti terverifikasi", text: "Setiap listing diperiksa sebelum tampil di katalog." },
  { icon: IconTag, title: "Harga transparan", text: "Tanpa biaya tersembunyi. Harga yang tampil adalah harga yang dibayar." },
  { icon: IconHeadset, title: "Bantuan responsif", text: "Tim kami siap membantu dari survei sampai hari check-in." },
];

const quickFaq = [
  "Apakah survei dikenakan biaya?",
  "Bagaimana cara membayar booking?",
  "Bisakah saya membatalkan jadwal survei?",
];

async function Stats() {
  await connection();
  let stats: Awaited<ReturnType<typeof fetchHomeStats>> | null = null;
  try {
    stats = await fetchHomeStats();
  } catch (e) {
    console.error("Stats", e);
  }
  if (!stats) return null;
  const items = [
    { n: stats.properties, label: "Properti aktif" },
    { n: stats.rooms, label: "Kamar tersedia" },
    { n: stats.cities, label: "Kota" },
  ];
  return (
    <dl className="grid grid-cols-3 divide-x divide-ink/15 border-y border-ink/15">
      {items.map((s) => (
        <div key={s.label} className="px-2 py-7 sm:px-8">
          <dd className="tnum font-display text-5xl leading-none text-brand-700 sm:text-7xl">{s.n}</dd>
          <dt className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-xs">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

async function loadFeatured() {
  try {
    return { items: await fetchPopularProperties(3), error: null };
  } catch (e) {
    console.error("Featured", e);
    return { items: [], error: "Gagal memuat properti." };
  }
}

async function Featured() {
  await connection();
  const { items, error } = await loadFeatured();
  if (error) return <DataNotice error={error} />;
  if (items.length === 0) return <DataNotice error="Belum ada properti yang tersedia." />;
  return (
    <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
      {items.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 pb-0 pt-12 md:pt-16">
          <SectionLabel>Kos · Apartemen · Rumah</SectionLabel>
          <h1 className="mt-6 font-display text-[3rem] leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-[6.25rem]">
            Temukan tempat tinggal yang terasa seperti <em className="text-brand-700">rumah.</em>
          </h1>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <div className="flex flex-col justify-between gap-8">
              <p className="max-w-md text-lg leading-relaxed text-muted">
                Cari kamar, jadwalkan survei, lalu booking dan bayar dalam satu tempat. Tanpa perantara berbelit, tanpa biaya tersembunyi.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/properties" className={btnPrimary + " px-7 py-3.5"}>
                  Cari properti <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/cara-kerja" className={btnOutline + " px-7 py-3.5"}>
                  Cara kerja
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[16/10] overflow-hidden rounded-md bg-brand-100">
                <PropertyImage src={HERO_IMAGE} alt="Ruang tamu hangat dengan lantai kayu" seed={2} view={0} />
              </div>
              {/* penanda sudut ala gambar arsitek */}
              <span className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-accent-500" aria-hidden />
              <span className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-accent-500" aria-hidden />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl px-5">
          <div className="translate-y-1/2">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="mx-auto max-w-6xl px-5 pt-28">
        <Suspense fallback={<Skeleton className="h-36 w-full" />}>
          <Stats />
        </Suspense>
      </section>

      {/* PILIHAN TERBARU */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel index="01">Pilihan terbaru</SectionLabel>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">Baru dan tersedia.</h2>
            </div>
            <Link href="/properties" className="group inline-flex items-center gap-2 border-b-2 border-accent-500 pb-1 text-sm font-semibold text-brand-800">
              Lihat semua properti
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12">
          <Suspense
            fallback={
              <div className="grid gap-8 md:grid-cols-3" role="status" aria-label="Memuat properti">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="aspect-[4/3.4] w-full" />
                ))}
              </div>
            }
          >
            <Featured />
          </Suspense>
        </div>
      </section>

      {/* CARA KERJA (ringkas) */}
      <section className="grain relative bg-brand-800 text-white">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="02" dark>Cara kerja</SectionLabel>
              <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight tracking-tight md:text-6xl">Tiga langkah, tanpa ribet.</h2>
            </div>
            <Link href="/cara-kerja" className={btnGold}>
              Lihat cara kerja lengkap <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-md bg-white/15 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="bg-brand-800 p-8">
                <div className="flex items-center justify-between">
                  <IconTile icon={s.icon} dark />
                  <span className="tnum font-display text-5xl text-white/20">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/65">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <SectionLabel index="03">Kenapa RuangKita</SectionLabel>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight text-ink md:text-6xl">
            Mencari hunian seharusnya tidak melelahkan.
          </h2>
        </Reveal>
        <div className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {perks.map((p) => (
            <div key={p.title} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <IconTile icon={p.icon} />
              <h3 className="mt-6 text-xl font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BANTUAN (ringkas) */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <SectionLabel index="04">Bantuan</SectionLabel>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-5xl">Masih ada yang ingin ditanyakan?</h2>
            <Link href="/bantuan" className={btnPrimary + " mt-8"}>
              <IconChat size={20} className="text-white" /> Buka pusat bantuan
            </Link>
          </div>
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {quickFaq.map((q) => (
              <li key={q}>
                <Link href="/bantuan" className="group flex items-center justify-between gap-6 py-5 text-lg text-ink transition-colors hover:text-brand-700">
                  {q}
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grain relative overflow-hidden rounded-md bg-brand-900 px-8 py-16 md:px-16 md:py-20">
          <DoorArch className="absolute -right-6 bottom-0 hidden h-[115%] text-white md:block" stroke="#ffffff" />
          <div className="relative max-w-xl">
            <SectionLabel dark>Mulai sekarang</SectionLabel>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-white md:text-6xl">Siap menemukan kamar yang cocok?</h2>
            <p className="mt-5 text-lg text-white/70">Mulai cari hari ini. Survei gratis, tanpa komitmen.</p>
            <Link href="/properties" className={btnGold + " mt-9 px-7 py-3.5"}>
              Cari properti <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
