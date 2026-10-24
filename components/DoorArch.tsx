import { cn } from "@/lib/utils";

/**
 * Motif dekoratif: lengkung pintu berlapis (diambil dari pintu emas pada logo).
 * Hanya hiasan, disembunyikan dari pembaca layar.
 */
export default function DoorArch({
  className,
  stroke = "currentColor",
  accent = "#d2a34f",
}: {
  className?: string;
  stroke?: string;
  accent?: string;
}) {
  return (
    <svg viewBox="0 0 400 520" fill="none" className={cn("pointer-events-none", className)} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${40 + i * 34} 500V${220 + i * 22}a${160 - i * 34} ${160 - i * 34} 0 0 1 ${320 - i * 68} 0V500`}
          stroke={stroke}
          strokeWidth="1.5"
          opacity={0.22 + i * 0.1}
        />
      ))}
      <path d="M176 500V300a24 24 0 0 1 48 0V500Z" fill={accent} opacity="0.95" />
      <path d="M20 500H380" stroke={stroke} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
