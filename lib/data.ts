import "server-only";
import { FACILITIES, PROPERTIES, type StaticProperty } from "@/lib/static-data";
import type { FacilityRow, RoomRow } from "@/types/database";
import type { Property, PropertyDetail, RoomStatus } from "@/types";

/** Data properti berasal dari lib/static-data.ts (tanpa database). */

export const PAGE_SIZE = 9;

export function roomStatusOf(available: number, total: number): RoomStatus {
  if (total === 0 || available === 0) return "Penuh";
  return available === 1 ? "Segera Penuh" : "Tersedia";
}

const facilityByName = new Map(FACILITIES.map((f) => [f.name, f]));
const NOW = "2026-01-01T00:00:00Z";

function roomsOf(p: StaticProperty): RoomRow[] {
  return p.rooms.map((r) => ({
    ...r,
    property_id: p.slug,
    status: r.available ? "available" : "booked",
    created_at: NOW,
    updated_at: NOW,
  }));
}

function toProperty(p: StaticProperty): Property {
  const rooms = roomsOf(p);
  const open = rooms.filter((r) => r.available);
  const prices = (open.length ? open : rooms).map((r) => r.price_monthly);
  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    type: p.type,
    area: p.area,
    city: p.city,
    address: p.address,
    price: prices.length ? Math.min(...prices) : 0,
    status: roomStatusOf(open.length, rooms.length),
    roomsAvailable: open.length,
    coverImage: p.images[0] ?? null,
    facilities: p.facilityNames.map((n) => facilityByName.get(n)).filter((f): f is FacilityRow => !!f),
  };
}

export async function fetchFacilities(): Promise<FacilityRow[]> {
  return FACILITIES;
}

export interface SearchParams {
  q?: string;
  type?: string;
  min?: number;
  max?: number;
  facilityIds?: string[];
  status?: "" | "Tersedia" | "Penuh";
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
}

export async function searchProperties(params: SearchParams) {
  const page = Math.max(1, params.page ?? 1);
  const q = params.q?.trim().toLowerCase();

  let items = PROPERTIES.map(toProperty).filter((p) => {
    if (q && ![p.name, p.city, p.area, p.address].some((v) => v.toLowerCase().includes(q))) return false;
    if (params.type && p.type !== params.type) return false;
    if (params.min !== undefined && p.price < params.min) return false;
    if (params.max !== undefined && p.price > params.max) return false;
    if (params.facilityIds?.length && !params.facilityIds.every((id) => p.facilities.some((f) => f.id === id))) return false;
    if (params.status === "Tersedia" && p.roomsAvailable === 0) return false;
    if (params.status === "Penuh" && p.roomsAvailable > 0) return false;
    return true;
  });

  if (params.sort === "price-asc") items = items.sort((a, b) => a.price - b.price);
  else if (params.sort === "price-desc") items = items.sort((a, b) => b.price - a.price);

  const from = (page - 1) * PAGE_SIZE;
  return { items: items.slice(from, from + PAGE_SIZE), total: items.length, page, pageSize: PAGE_SIZE };
}

export async function fetchPopularProperties(limit = 3): Promise<Property[]> {
  return PROPERTIES.map(toProperty).filter((p) => p.roomsAvailable > 0).slice(0, limit);
}

export async function fetchPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
  const p = PROPERTIES.find((x) => x.slug === slug);
  if (!p) return null;
  return {
    ...toProperty(p),
    description: p.description,
    rules: p.rules,
    images: p.images,
    rooms: roomsOf(p).sort((a, b) => a.price_monthly - b.price_monthly),
    owner: { name: "Pengelola RuangKita", role: "Pengelola" },
  };
}

/** Semua properti (ringkas), dipakai dashboard untuk mencocokkan data tersimpan di browser. */
export async function fetchAllProperties(): Promise<Property[]> {
  return PROPERTIES.map(toProperty);
}

/** Angka ringkas untuk beranda, dihitung dari data contoh. */
export async function fetchHomeStats() {
  const items = PROPERTIES.map(toProperty);
  return {
    properties: items.length,
    rooms: items.reduce((sum, r) => sum + r.roomsAvailable, 0),
    cities: new Set(items.map((r) => r.city)).size,
  };
}
