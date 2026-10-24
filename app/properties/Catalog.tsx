"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, SlidersHorizontal, X } from "lucide-react";
import { searchCatalog, type CatalogResult } from "@/app/actions/properties";
import SearchBar from "@/components/SearchBar";
import CatalogHeading from "@/components/CatalogHeading";
import FilterPanel, { DEFAULT_FILTERS, type Filters } from "@/components/FilterPanel";
import PropertyRow from "@/components/PropertyRow";
import EmptyState from "@/components/EmptyState";
import { PropertyGridSkeleton } from "@/components/Skeleton";
import { PROPERTY_TYPES } from "@/lib/constants";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { cn } from "@/lib/utils";

type Sort = "newest" | "price-asc" | "price-desc";

const SORTS: Array<{ value: Sort; label: string }> = [
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Termurah" },
  { value: "price-desc", label: "Termahal" },
];

export default function Catalog() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    q: params.get("q") ?? "",
    type: params.get("type") ?? "",
    min: params.get("min") ?? "",
    max: params.get("max") ?? "",
  }));
  const [sort, setSort] = useState<Sort>("newest");
  const [page, setPage] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);

  const [data, setData] = useState<CatalogResult | null>(null);
  const [items, setItems] = useState<CatalogResult["items"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const requestId = useRef(0);

  // Ambil data dari database (lewat server action) setiap filter/urutan/halaman berubah.
  useEffect(() => {
    const id = ++requestId.current;
    const delay = setTimeout(async () => {
      setLoading(true);
      setError(null);
      const res = await searchCatalog({
        q: filters.q || undefined,
        type: filters.type || undefined,
        min: filters.min ? Number(filters.min) : undefined,
        max: filters.max ? Number(filters.max) : undefined,
        facilityIds: filters.facilities.length ? filters.facilities : undefined,
        status: filters.status || undefined,
        sort,
        page,
      });
      if (id !== requestId.current) return; // abaikan respons lama
      if (!res.ok || !res.data) {
        setError(res.message ?? "Gagal memuat properti");
      } else {
        const d = res.data;
        setData(d);
        setItems((prev) => (d.page === 1 ? d.items : [...prev, ...d.items]));
      }
      setLoading(false);
    }, 250);
    return () => clearTimeout(delay);
  }, [filters, sort, page, retry]);

  const changeFilters = (next: Filters) => {
    setPage(1);
    setFilters(next);
  };
  const reset = () => changeFilters(DEFAULT_FILTERS);

  const hasMore = data ? items.length < data.total : false;
  const firstLoad = loading && items.length === 0;
  const activeCount =
    (filters.type ? 1 : 0) +
    (filters.min || filters.max ? 1 : 0) +
    (filters.status ? 1 : 0) +
    filters.facilities.length;

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-14">
          <CatalogHeading />
          <div className="mt-8 max-w-2xl">
            <SearchBar compact query={filters.q} onQueryChange={(q) => changeFilters({ ...filters, q })} />
          </div>
          <div className="-mx-5 mt-6 overflow-x-auto px-5">
            <div className="flex w-max gap-2" role="group" aria-label="Tipe properti">
              {["", ...PROPERTY_TYPES].map((t) => {
                const on = filters.type === t;
                return (
                  <button
                    key={t || "all"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => changeFilters({ ...filters, type: t })}
                    className={cn(
                      "whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                      on ? "border-brand-700 bg-brand-700 text-white" : "border-brand-700/20 bg-white text-ink hover:border-brand-700",
                    )}
                  >
                    {t || "Semua"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel filters={filters} onChange={changeFilters} onReset={reset} facilities={data?.facilities ?? []} />
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="tnum text-sm text-muted" aria-live="polite">
              {firstLoad ? (
                "Memuat…"
              ) : data ? (
                <>
                  <strong className="font-display text-2xl font-normal text-ink">{data.total}</strong> properti ditemukan
                </>
              ) : (
                ""
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setPanelOpen(true)} className={cn(btnOutline, "px-4 py-2.5 lg:hidden")}>
                <SlidersHorizontal className="h-4 w-4" /> Saring
                {activeCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs text-brand-900">
                    {activeCount}
                  </span>
                )}
              </button>
              <div className="flex overflow-hidden rounded-md border border-line text-sm" role="group" aria-label="Urutkan">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    aria-pressed={sort === s.value}
                    onClick={() => {
                      setPage(1);
                      setSort(s.value);
                    }}
                    className={cn(
                      "border-r border-line px-3.5 py-2.5 font-medium transition-colors last:border-r-0",
                      sort === s.value ? "bg-brand-700 text-white" : "bg-white text-muted hover:bg-brand-50",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {firstLoad ? (
            <PropertyGridSkeleton />
          ) : error ? (
            <EmptyState
              icon={<AlertTriangle className="h-6 w-6" />}
              title="Properti tidak dapat dimuat"
              description={error}
              action={
                <button onClick={() => setRetry((n) => n + 1)} className={btnPrimary}>
                  Coba lagi
                </button>
              }
            />
          ) : items.length === 0 ? (
            <EmptyState
              title="Belum ada properti yang cocok"
              description="Coba ubah kata kunci atau longgarkan filter harga dan fasilitas."
              action={
                <button onClick={reset} className={btnPrimary}>
                  Atur ulang filter
                </button>
              }
            />
          ) : (
            <>
              <div className={cn("space-y-5 transition-opacity", loading && "opacity-60")}>
                {items.map((p) => (
                  <PropertyRow key={p.id} property={p} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-10 text-center">
                  <button type="button" disabled={loading} onClick={() => setPage((n) => n + 1)} className={btnOutline + " px-8"}>
                    {loading ? "Memuat…" : "Muat lebih banyak"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label="Saring properti">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-display text-xl text-ink">Saring</span>
            <button onClick={() => setPanelOpen(false)} aria-label="Tutup filter" className="rounded-md p-2 hover:bg-brand-50">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FilterPanel filters={filters} onChange={changeFilters} onReset={reset} facilities={data?.facilities ?? []} />
          </div>
          <div className="border-t border-line p-4">
            <button onClick={() => setPanelOpen(false)} className={btnPrimary + " w-full"}>
              Tampilkan {data?.total ?? 0} properti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
