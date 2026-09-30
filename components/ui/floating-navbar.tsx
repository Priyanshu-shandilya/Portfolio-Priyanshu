"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const RESUME_URL = "/resume.pdf";

const ACCENTS = ["#A78BFA", "#2DD4BF", "#FBBF24"];

/* Shared keyboard focus style (visible on the dark glass) */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/* Glass sheen: a soft light falling from the top edge */
const SHEEN =
  "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10),rgba(255,255,255,0.02)_45%,transparent)]";

/* Black glass depth: outer shadow + top highlight + faint bottom edge */
const GLASS_SHADOW =
  "shadow-[0_14px_40px_-14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(255,255,255,0.04)]";

export const FloatingNav = ({
  navItems,
  resumeUrl = RESUME_URL,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.JSX.Element;
  }[];
  resumeUrl?: string;
  className?: string;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(navItems[0]?.name ?? "");
  const [scrolled, setScrolled] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  const clickLockRef = useRef(false);
  const unlockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll spy */

  useEffect(() => {
    const sections = navItems
      .map((item) => {
        try {
          return document.querySelector(item.link);
        } catch {
          return null;
        }
      })
      .filter((element): element is Element => element !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickLockRef.current) return;

        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          const matchingItem = navItems.find(
            (item) => item.link === `#${visibleEntry.target.id}`
          );

          if (matchingItem) {
            setActive(matchingItem.name);
          }
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navItems]);

  /* Slightly denser glass once content scrolls underneath */

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Navigation click */

  const handleNavClick = (name: string) => {
    clickLockRef.current = true;
    setActive(name);
    setMobileOpen(false);

    if (unlockTimeout.current) {
      clearTimeout(unlockTimeout.current);
    }

    unlockTimeout.current = setTimeout(() => {
      clickLockRef.current = false;
    }, 900);
  };

  /* Clear pending timeout on unmount */

  useEffect(() => {
    return () => {
      if (unlockTimeout.current) {
        clearTimeout(unlockTimeout.current);
      }
    };
  }, []);

  /* Mobile body scroll */

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Escape key */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Navbar */}

      <motion.nav
        initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-4 z-[5000] flex justify-center px-3",
          className
        )}
        aria-label="Main navigation"
      >
        <div
          className={cn(
            "relative flex w-full max-w-4xl items-center justify-between gap-2",
            "rounded-full px-2.5 py-2",
            "border border-white/[0.12]",
            "backdrop-blur-2xl backdrop-saturate-150",
            "transition-[background-color] duration-500",
            scrolled ? "bg-black/85" : "bg-black/70",
            GLASS_SHADOW
          )}
        >
          {/* Glass sheen */}

          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full",
              SHEEN
            )}
            aria-hidden="true"
          />

          {/* Logo */}

          <a
            href={navItems[0]?.link ?? "#home"}
            onClick={() => handleNavClick(navItems[0]?.name ?? "")}
            className={cn(
              "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center",
              "rounded-full border border-white/20",
              "bg-[linear-gradient(145deg,rgba(255,255,255,0.22),rgba(255,255,255,0.04))]",
              "text-[11px] font-semibold tracking-wider text-white",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
              "transition-colors duration-300 hover:border-white/40",
              FOCUS_RING
            )}
            aria-label="Homepage"
          >
            PS
          </a>

          {/* Desktop Navigation */}

          <div className="relative z-10 hidden items-center gap-0.5 sm:flex">
            {navItems.map((navItem, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              const isActive = active === navItem.name;

              return (
                <a
                  key={`${navItem.name}-${index}`}
                  href={navItem.link}
                  onClick={() => handleNavClick(navItem.name)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative isolate flex items-center gap-1.5",
                    "rounded-full px-3.5 py-2",
                    "text-[13px] font-medium",
                    "transition-colors duration-300",
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white",
                    FOCUS_RING
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className={cn(
                        "absolute inset-0 -z-10 rounded-full",
                        "border border-white/15 bg-white/[0.09]",
                        "shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                      )}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}

                  {navItem.icon && (
                    <span className="text-white/70">{navItem.icon}</span>
                  )}

                  {navItem.name}

                  {isActive && (
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{
                        backgroundColor: accent,
                        boxShadow: `0 0 8px ${accent}`,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop Resume */}

          <a
            href={resumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "relative z-10 hidden items-center gap-1.5",
              "rounded-full bg-white px-4 py-2",
              "text-[13px] font-semibold text-black",
              "shadow-[0_6px_20px_-6px_rgba(255,255,255,0.4)]",
              "transition-all duration-300",
              "hover:bg-white/90 active:scale-[0.97]",
              "sm:inline-flex",
              FOCUS_RING
            )}
          >
            <Download size={13} />
            Resume
          </a>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setMobileOpen((previous) => !previous)}
            className={cn(
              "relative z-10 flex h-9 w-9 items-center justify-center",
              "rounded-full border border-white/20 bg-white/[0.06]",
              "text-white/80 transition-colors duration-300",
              "hover:bg-white/10 hover:text-white",
              "sm:hidden",
              FOCUS_RING
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}

            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[4998] bg-black/30 backdrop-blur-sm sm:hidden"
            />

            {/* Menu Panel */}

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
              className={cn(
                "fixed inset-x-4 top-[4.5rem] z-[4999] overflow-hidden",
                "rounded-3xl border border-white/[0.12]",
                "bg-black/80 p-2.5",
                "backdrop-blur-2xl backdrop-saturate-150",
                GLASS_SHADOW,
                "sm:hidden"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 rounded-3xl",
                  SHEEN
                )}
                aria-hidden="true"
              />

              <div className="relative flex flex-col gap-1">
                {navItems.map((navItem, index) => {
                  const accent = ACCENTS[index % ACCENTS.length];
                  const isActive = active === navItem.name;

                  return (
                    <a
                      key={`mobile-${navItem.name}-${index}`}
                      href={navItem.link}
                      onClick={() => handleNavClick(navItem.name)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3",
                        "text-[15px] font-medium transition-colors duration-300",
                        isActive
                          ? "border border-white/10 bg-white/[0.08] text-white"
                          : "border border-transparent text-white/60 hover:bg-white/5 hover:text-white",
                        FOCUS_RING
                      )}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: accent,
                          opacity: isActive ? 1 : 0.35,
                          boxShadow: isActive ? `0 0 8px ${accent}` : "none",
                        }}
                      />

                      {navItem.icon && (
                        <span className="text-white/70">{navItem.icon}</span>
                      )}

                      {navItem.name}
                    </a>
                  );
                })}

                <div className="my-1.5 h-px bg-white/10" aria-hidden="true" />

                {/* Mobile Resume */}

                <a
                  href={resumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-center gap-2",
                    "rounded-2xl bg-white px-4 py-3",
                    "text-[15px] font-semibold text-black",
                    "transition-all duration-300",
                    "hover:bg-white/90 active:scale-[0.98]",
                    FOCUS_RING
                  )}
                >
                  <Download size={15} />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;