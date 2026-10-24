import type { Metadata } from "next";
import { DM_Serif_Display, Instrument_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { ToastProvider } from "@/components/Toast";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "RuangKita — Cari dan booking kos, apartemen, rumah",
  description:
    "Temukan tempat tinggal yang terasa seperti rumah. Cari, jadwalkan survei, lalu booking dan bayar dalam satu tempat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${instrument.variable} ${dmSerif.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <ToastProvider>
          <Suspense fallback={<div className="h-16 border-b border-line" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
