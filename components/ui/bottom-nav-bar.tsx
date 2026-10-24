"use client";

import { useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { IconHome, type IconComponent } from "@/components/icons";

import { cn } from "@/lib/utils";

export type BottomNavItem = {
  label: string;
  icon: IconComponent;
  /** Jika diisi, item menjadi tautan. Tanpa href, item hanya mengubah state aktif. */
  href?: string;
};

const defaultItems: BottomNavItem[] = [{ label: "Home", icon: IconHome }];

const MOBILE_LABEL_WIDTH = 72;

const MotionLink = motion.create(Link);

type BottomNavBarProps = {
  className?: string;
  items?: BottomNavItem[];
  /** Mode terkendali: indeks aktif ditentukan dari luar (mis. dari pathname). */
  activeIndex?: number;
  defaultIndex?: number;
  stickyBottom?: boolean;
};

export function BottomNavBar({
  className,
  items = defaultItems,
  activeIndex: controlledIndex,
  defaultIndex = 0,
  stickyBottom = false,
}: BottomNavBarProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex ?? internalIndex;

  return (
    <MotionConfig reducedMotion="user">
    <motion.nav
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      aria-label="Navigasi bawah"
      className={cn(
        "bg-white border border-line rounded-full flex items-center p-2 shadow-lg space-x-1 min-w-[320px] max-w-[95vw] h-[52px]",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-40 w-fit",
        className,
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        const itemClass = cn(
          "flex items-center gap-0 px-3 py-2 rounded-full transition-colors duration-200 relative h-10 min-w-[44px] min-h-[40px] max-h-[44px]",
          isActive ? "text-brand-700 gap-2" : "bg-transparent text-muted hover:bg-surface",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600",
        );

        const content = (
          <>
            {isActive && (
              <motion.span
                layoutId="bottom-nav-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-brand-100"
                aria-hidden
              />
            )}
            <Icon size={22} strokeWidth={2} aria-hidden className="relative transition-colors duration-200" />

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "8px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className="relative overflow-hidden flex items-center max-w-[72px]"
            >
              <span
                className={cn(
                  "font-medium text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis text-[clamp(0.625rem,0.5263rem+0.5263vw,1rem)] leading-[1.9]",
                  isActive ? "text-brand-700" : "opacity-0",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </>
        );

        return item.href ? (
          <MotionLink
            key={item.label}
            href={item.href}
            whileTap={{ scale: 0.97 }}
            className={itemClass}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setInternalIndex(idx)}
          >
            {content}
          </MotionLink>
        ) : (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.97 }}
            className={itemClass}
            onClick={() => setInternalIndex(idx)}
            aria-label={item.label}
            aria-pressed={isActive}
            type="button"
          >
            {content}
          </motion.button>
        );
      })}
    </motion.nav>
    </MotionConfig>
  );
}

export default BottomNavBar;
