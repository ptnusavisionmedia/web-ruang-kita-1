/** Data awal katalog. Dimuat ke database SQLite sekali saja, saat tabel properti masih kosong (lihat lib/db.ts). */
import type { FacilityRow, RoomRow } from "@/types/database";

export interface StaticProperty {
  slug: string;
  name: string;
  type: string;
  area: string;
  city: string;
  address: string;
  description: string;
  rules: string[];
  images: string[];
  facilityNames: string[];
  rooms: Array<Omit<RoomRow, "property_id" | "created_at" | "updated_at" | "status" | "id"> & { id: string }>;
}

export const FACILITIES: FacilityRow[] = [
  { id: "fac-1", name: "WiFi", icon: "wifi" },
  { id: "fac-2", name: "AC", icon: "snowflake" },
  { id: "fac-3", name: "Kamar mandi dalam", icon: "bath" },
  { id: "fac-4", name: "Parkir", icon: "car" },
  { id: "fac-5", name: "Dapur bersama", icon: "cooking-pot" },
  { id: "fac-6", name: "Laundry", icon: "shirt" },
  { id: "fac-7", name: "Kasur & lemari", icon: "bed-double" },
  { id: "fac-8", name: "Keamanan 24 jam", icon: "shield-check" },
  { id: "fac-9", name: "Listrik termasuk", icon: "zap" },
  { id: "fac-10", name: "TV", icon: "tv" },
];

export const PROPERTIES: StaticProperty[] = [
  {
    slug: "melati-residence",
    name: "Melati Residence",
    type: "Kos Putri",
    area: "Dago",
    city: "Bandung",
    address: "Jl. Dago Asri No. 12, Coblong, Bandung",
    description: "Kos putri bernuansa tenang di kawasan Dago, hanya 10 menit dari kampus ITB dan Unpad. Kamar luas dengan jendela besar, sirkulasi udara baik, dan lingkungan yang aman.",
    rules: ["Tamu lawan jenis tidak diperkenankan masuk kamar", "Jam malam pukul 23.00 untuk pintu gerbang utama", "Dilarang merokok di dalam kamar", "Menjaga kebersihan dan ketenangan bersama"],
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=75",
    ],
    facilityNames: ["WiFi", "AC", "Kamar mandi dalam", "Kasur & lemari", "Laundry", "Keamanan 24 jam"],
    rooms: [
      { id: "melati-residence-r1", name: "Kamar Standar A2", description: "Jendela besar, kasur dan lemari tersedia.", price_monthly: 1850000, size: "3 × 4 m", floor: "Lantai 2", available: true },
      { id: "melati-residence-r2", name: "Kamar Standar A3", description: "Menghadap taman belakang.", price_monthly: 1850000, size: "3 × 4 m", floor: "Lantai 2", available: true },
      { id: "melati-residence-r3", name: "Kamar Deluxe B1", description: "Lebih luas, dengan meja kerja.", price_monthly: 2100000, size: "4 × 4 m", floor: "Lantai 3", available: true },
    ],
  },
  {
    slug: "kenanga-house",
    name: "Kenanga House",
    type: "Kos Campur",
    area: "Tebet",
    city: "Jakarta Selatan",
    address: "Jl. Tebet Barat Dalam VI No. 7, Jakarta Selatan",
    description: "Hunian modern di Tebet dengan akses mudah ke stasiun dan pusat kota. Listrik sudah termasuk dan area parkir motor luas. Cocok untuk pekerja dan mahasiswa.",
    rules: ["Jam malam pukul 23.00 untuk pintu gerbang utama", "Dilarang merokok di dalam kamar", "Menjaga kebersihan dan ketenangan bersama"],
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=75",
    ],
    facilityNames: ["WiFi", "AC", "Kamar mandi dalam", "Kasur & lemari", "Parkir", "Listrik termasuk"],
    rooms: [
      { id: "kenanga-house-r1", name: "Kamar 101", description: "Lantai dasar, dekat area parkir.", price_monthly: 2300000, size: "3,5 × 4 m", floor: "Lantai 1", available: true },
      { id: "kenanga-house-r2", name: "Kamar 102", description: "Lantai dasar.", price_monthly: 2300000, size: "3,5 × 4 m", floor: "Lantai 1", available: true },
    ],
  },
  {
    slug: "teratai-suites",
    name: "Teratai Suites",
    type: "Apartemen",
    area: "Kemang",
    city: "Jakarta Selatan",
    address: "Jl. Kemang Raya No. 45, Jakarta Selatan",
    description: "Studio apartemen fully furnished dengan pemandangan kota. Dilengkapi dapur kecil, ruang kerja, dan akses kolam renang.",
    rules: ["Minimal sewa 6 bulan", "Dilarang membawa hewan peliharaan", "Tamu menginap wajib lapor ke resepsionis"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=75",
    ],
    facilityNames: ["WiFi", "AC", "Kamar mandi dalam", "Dapur bersama", "Parkir", "Keamanan 24 jam", "TV"],
    rooms: [
      { id: "teratai-suites-r1", name: "Studio 12A", description: "Studio furnished pemandangan kota.", price_monthly: 5400000, size: "28 m²", floor: "Lantai 12", available: true },
      { id: "teratai-suites-r2", name: "Studio 12C", description: "Studio furnished sudut.", price_monthly: 5600000, size: "30 m²", floor: "Lantai 12", available: true },
    ],
  },
  {
    slug: "anggrek-putra",
    name: "Anggrek Putra",
    type: "Kos Putra",
    area: "Condongcatur",
    city: "Yogyakarta",
    address: "Jl. Anggajaya II No. 3, Sleman, Yogyakarta",
    description: "Kos putra sederhana dan bersih, dekat UPN dan UIN. Harga terjangkau dengan parkir luas dan area jemur.",
    rules: ["Jam malam pukul 23.00 untuk pintu gerbang utama", "Dilarang merokok di dalam kamar"],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=75",
    ],
    facilityNames: ["WiFi", "Kasur & lemari", "Parkir", "Laundry"],
    rooms: [
      { id: "anggrek-putra-r1", name: "Kamar 5", description: "Kamar sederhana lantai dasar.", price_monthly: 950000, size: "3 × 3 m", floor: "Lantai 1", available: true },
      { id: "anggrek-putra-r2", name: "Kamar 6", description: "Sudah terisi.", price_monthly: 950000, size: "3 × 3 m", floor: "Lantai 1", available: false },
    ],
  },
  {
    slug: "sakura-living",
    name: "Sakura Living",
    type: "Kos Putri",
    area: "Setiabudi",
    city: "Jakarta Selatan",
    address: "Jl. Setiabudi Utara No. 18, Jakarta Selatan",
    description: "Kos putri premium dengan dapur bersama yang bersih dan ruang santai di lantai atas. Dekat perkantoran Kuningan dan halte TransJakarta.",
    rules: ["Tamu lawan jenis tidak diperkenankan masuk kamar", "Jam malam pukul 23.00 untuk pintu gerbang utama", "Dilarang merokok di dalam kamar"],
    images: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=75",
    ],
    facilityNames: ["WiFi", "AC", "Kamar mandi dalam", "Kasur & lemari", "Dapur bersama", "Laundry", "Keamanan 24 jam"],
    rooms: [
      { id: "sakura-living-r1", name: "Kamar S3", description: "Dekat dapur bersama.", price_monthly: 2750000, size: "4 × 4 m", floor: "Lantai 3", available: true },
      { id: "sakura-living-r2", name: "Kamar S5", description: "Menghadap jalan, tenang.", price_monthly: 2750000, size: "4 × 4 m", floor: "Lantai 3", available: true },
    ],
  },
  {
    slug: "bukit-hijau",
    name: "Rumah Bukit Hijau",
    type: "Rumah",
    area: "Lowokwaru",
    city: "Malang",
    address: "Jl. Bukit Hijau Blok C No. 9, Malang",
    description: "Rumah dua kamar tidur dengan halaman kecil di lingkungan perumahan yang asri. Dekat kampus UB dan pusat kuliner.",
    rules: ["Minimal sewa 12 bulan", "Perawatan taman menjadi tanggung jawab penyewa", "Dilarang mengubah struktur bangunan"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=75",
    ],
    facilityNames: ["WiFi", "Kamar mandi dalam", "Dapur bersama", "Parkir", "Listrik termasuk"],
    rooms: [
      { id: "bukit-hijau-r1", name: "Rumah utuh 2 KT", description: "Rumah dua kamar tidur dengan halaman.", price_monthly: 4200000, size: "72 m²", floor: "1 lantai", available: true },
    ],
  },
  {
    slug: "lotus-tower",
    name: "Lotus Tower",
    type: "Apartemen",
    area: "Gubeng",
    city: "Surabaya",
    address: "Jl. Raya Gubeng No. 88, Surabaya",
    description: "Apartemen studio di pusat Surabaya, tersambung langsung dengan mal dan stasiun. Fasilitas gym, kolam renang, dan keamanan 24 jam.",
    rules: ["Minimal sewa 6 bulan", "Dilarang merokok di area unit", "Maksimal dua penghuni per unit"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=75",
    ],
    facilityNames: ["WiFi", "AC", "Kamar mandi dalam", "Dapur bersama", "Parkir", "Keamanan 24 jam", "TV"],
    rooms: [
      { id: "lotus-tower-r1", name: "Studio 8B", description: "Studio di lantai 8.", price_monthly: 3900000, size: "24 m²", floor: "Lantai 8", available: true },
      { id: "lotus-tower-r2", name: "Studio 8D", description: "Sudah terisi.", price_monthly: 3900000, size: "24 m²", floor: "Lantai 8", available: false },
    ],
  },
  {
    slug: "dahlia-kost",
    name: "Dahlia Kost",
    type: "Kos Putri",
    area: "Jatinangor",
    city: "Sumedang",
    address: "Jl. Raya Jatinangor No. 140, Sumedang",
    description: "Kos putri dekat kampus Unpad Jatinangor dengan suasana kekeluargaan. Saat ini seluruh kamar terisi.",
    rules: ["Tamu lawan jenis tidak diperkenankan masuk kamar", "Jam malam pukul 23.00 untuk pintu gerbang utama"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=75",
    ],
    facilityNames: ["WiFi", "Kasur & lemari", "Laundry", "Keamanan 24 jam"],
    rooms: [
      { id: "dahlia-kost-r1", name: "Kamar 1", description: "Sudah terisi.", price_monthly: 1100000, size: "3 × 3 m", floor: "Lantai 1", available: false },
    ],
  },
];
