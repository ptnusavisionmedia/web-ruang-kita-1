# RuangKita

Platform pencarian dan booking kos, apartemen, dan rumah. Dibangun dengan Next.js (App Router), TypeScript, Tailwind CSS, dan tanpa database.

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Beranda: hero, pencarian, statistik nyata, properti terbaru, ringkasan |
| `/cara-kerja` | Langkah lengkap, persiapan survei, rincian biaya |
| `/properties` | Katalog (Cari Properti) dengan filter dan pengurutan |
| `/bantuan` | Pusat bantuan: pencarian, kategori, kontak |
| `/properties/[slug]`, `/booking`, `/payment`, `/dashboard`, `/login` | Alur pengguna |

## Ikon kustom

Set ikon sendiri (34 ikon, hijau logo `#104437` + aksen emas `#D2A34F`) ada di `assets/icons/*.svg`
(pratinjau: `assets/icons/_preview.png`). Ikon dipakai sebagai komponen React dari `components/icons`.

```bash
npm run icons   # membuat ulang components/icons/index.tsx dari assets/icons/*.svg
```

Menambah ikon: simpan SVG baru (viewBox 32, garis `#104437`, aksen `#D2A34F`) di `assets/icons`, jalankan `npm run icons`,
lalu pakai `<IconNamaFile size={24} className="text-brand-700" />`.

## Struktur

```
app/                 routing (halaman) dan app/actions/ (Server Actions)
components/          komponen UI
lib/data.ts          pembacaan data katalog (server only)
lib/local-store.ts   penyimpanan booking/pembayaran/simpanan di browser
lib/validation.ts    skema Zod
proxy.ts             melindungi /dashboard (nama "middleware" di Next.js 16)
types/database.ts    tipe baris tabel
```

## Tanpa database

Aplikasi berjalan tanpa database dan tanpa akun, jadi bisa langsung di-deploy ke Vercel tanpa variabel environment.

- Katalog properti berasal dari `lib/static-data.ts`.
- Booking survei divalidasi di server, lalu disimpan di `localStorage` browser pengguna (`lib/local-store.ts`).
- Pembayaran adalah simulasi dan juga disimpan di browser. Properti tersimpan dan dashboard membaca data yang sama.
- Karena data ada di perangkat pengguna, data tidak ikut berpindah antar perangkat atau browser.
- `/login` dan `/reset-password` dialihkan ke beranda.
