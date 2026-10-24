import type { ReactNode } from "react";
import { IconSearch } from "@/components/icons";

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-brand-700/25 bg-white px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        {icon ?? <IconSearch size={28} />}
      </div>
      <h3 className="mt-4 font-display text-2xl text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
