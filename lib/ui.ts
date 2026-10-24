/** Kelas bersama untuk tombol dan kolom isian agar konsisten di semua halaman. */
const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const btnPrimary = `${base} bg-brand-700 text-white hover:bg-brand-800`;
export const btnGold = `${base} bg-accent-500 text-brand-900 hover:bg-accent-400`;
export const btnOutline = `${base} border border-brand-700/30 text-brand-800 hover:border-brand-700 hover:bg-brand-50`;
export const btnGhost = `${base} text-brand-800 hover:bg-brand-50`;

export const field =
  "w-full rounded-md border border-line bg-white px-4 py-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand-700 focus:ring-4 focus:ring-brand-100";
