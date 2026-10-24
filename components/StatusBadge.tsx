import { cn } from "@/lib/utils";

type Tone = "success" | "pending" | "neutral";

const toneByLabel: Record<string, Tone> = {
  Tersedia: "success",
  Berhasil: "success",
  Terjadwal: "success",
  Selesai: "success",
  "Segera Penuh": "pending",
  Menunggu: "pending",
  "Menunggu konfirmasi": "pending",
  Penuh: "neutral",
  Dibatalkan: "neutral",
  Gagal: "neutral",
  Kedaluwarsa: "neutral",
};

const styles: Record<Tone, string> = {
  success: "bg-brand-100 text-brand-800",
  pending: "border border-accent-300 bg-accent-50 text-accent-700",
  neutral: "bg-surface text-muted border border-line",
};

export default function StatusBadge({ label, className }: { label: string; className?: string }) {
  const tone = toneByLabel[label] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        styles[tone],
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "success" ? "bg-brand-600" : tone === "pending" ? "bg-accent-500" : "bg-muted",
        )}
      />
      {label}
    </span>
  );
}
