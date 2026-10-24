"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import AuthButton from "./AuthButton";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/cara-kerja", label: "Cara Kerja" },
  { href: "/properties", label: "Cari Properti" },
  { href: "/bantuan", label: "Bantuan" },
];

const isActive = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

const spring = { type: "spring", stiffness: 380, damping: 32 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  // Mengecil + bayangan saat di-scroll; sembunyi saat scroll turun, muncul saat scroll naik.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > prev && y > 160 && !open);
  });

  const activeHref = links.find((l) => isActive(l.href, pathname))?.href ?? null;

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease }}
        className={cn(
          "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          scrolled
            ? "border-line bg-white/80 backdrop-blur-lg"
            : "border-transparent bg-white",
        )}
      >
        <motion.div
          initial={false}
          animate={{ height: scrolled ? 56 : 68 }}
          transition={{ duration: 0.3, ease }}
          className="mx-auto flex max-w-6xl items-center justify-between px-5"
        >
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Logo priority className={cn("transition-[height] duration-300", scrolled ? "h-7" : "h-9")} />
          </motion.div>

          <nav
            className="relative hidden items-center gap-1 md:flex"
            aria-label="Navigasi utama"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((l, i) => {
              const active = activeHref === l.href;
              return (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 * i + 0.1 }}
                  className="relative"
                  onMouseEnter={() => setHovered(l.href)}
                >
                  {hovered === l.href && (
                    <motion.span
                      layoutId="nav-hover"
                      transition={spring}
                      className="absolute inset-0 rounded-md bg-brand-50"
                      aria-hidden
                    />
                  )}
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200",
                      active || hovered === l.href ? "text-brand-700" : "text-muted",
                    )}
                  >
                    {l.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={spring}
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent-500"
                        aria-hidden
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AuthButton />
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-brand-50 md:hidden"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              key="mobile-menu"
              aria-label="Menu seluler"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="overflow-hidden border-t border-line bg-white md:hidden"
            >
              <ul className="px-5 py-3">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.3, delay: 0.05 * i + 0.05 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-3 text-sm font-medium hover:bg-brand-50",
                        activeHref === l.href ? "text-brand-700" : "text-ink",
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Progres scroll halaman */}
        <motion.div
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-accent-500"
          aria-hidden
        />
      </motion.header>
    </MotionConfig>
  );
}
