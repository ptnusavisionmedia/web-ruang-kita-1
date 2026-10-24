import type { IconComponent } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Ubin persegi berisi ikon kustom. `dark` untuk latar hijau gelap. */
export default function IconTile({
  icon: Icon,
  size = "md",
  dark = false,
  className,
}: {
  icon: IconComponent;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  className?: string;
}) {
  const box = { sm: "size-11", md: "size-14", lg: "size-20" }[size];
  const px = { sm: 24, md: 30, lg: 44 }[size];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border",
        dark ? "border-white/15 bg-white/5 text-white" : "border-brand-700/15 bg-brand-50 text-brand-700",
        box,
        className,
      )}
    >
      <Icon size={px} />
    </span>
  );
}
