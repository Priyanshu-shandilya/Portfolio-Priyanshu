"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Noto_Serif_Devanagari,
  Playfair_Display,
  Inter,
} from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { FloatingNav } from "@/components/ui/floating-navbar";

import {
  Home as HomeIcon,
  User,
  Briefcase,
  Code2,
  Gamepad2,
  Mail,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* FONTS — self-hosted by next/font: no render-blocking @import,       */
/* no mid-animation font swap.                                         */
/* ------------------------------------------------------------------ */
const hindiFont = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "700"],
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const HINDI_FONT = `${hindiFont.style.fontFamily}, 'Playfair Display', serif`;

/* ------------------------------------------------------------------ */
/* LAZY CHUNKS — nothing below the hero is parsed/hydrated during the  */
/* intro. They are only rendered after the intro finishes.             */
/* ------------------------------------------------------------------ */
const Floating3DParticles = dynamic(
  () =>
    import("@/components/ui/floating-3d-particles").then(
      (m) => m.Floating3DParticles
    ),
  { ssr: false }
);
const AboutMe = dynamic(() =>
  import("@/components/ui/about-me").then((m) => m.AboutMe)
);
const MoreThanCode = dynamic(() =>
  import("@/components/MoreThanCode").then((m) => m.MoreThanCode)
);
const ExpandableCertifications = dynamic(
  () => import("@/components/expandable-card-demo-standard")
);
const SkillsShowcase = dynamic(() =>
  import("@/components/skills-showcase").then((m) => m.SkillsShowcase)
);
const ProjectsShowcase = dynamic(() =>
  import("@/components/projects-showcase").then((m) => m.ProjectsShowcase)
);
const LeetCodeStats = dynamic(() => import("@/components/leetcode-stats"));
const GamesSection = dynamic(() =>
  import("@/components/ui/games-section").then((m) => m.GamesSection)
);
const ContactSection = dynamic(() =>
  import("@/components/ui/ContactSection").then((m) => m.ContactSection)
);

const navItems = [
  { name: "Home", link: "#home", icon: <HomeIcon size={16} /> },
  { name: "About", link: "#about", icon: <User size={16} /> },
  { name: "Work", link: "#work", icon: <Briefcase size={16} /> },
  { name: "Code", link: "#leetcode", icon: <Code2 size={16} /> },
  { name: "Fun", link: "#fun", icon: <Gamepad2 size={16} /> },
  { name: "Contact", link: "#contact", icon: <Mail size={16} /> },
];

/* ------------------------------------------------------------------ */
/* WELCOME INTRO CONFIG — the LAST item is always the final greeting.  */
/* ------------------------------------------------------------------ */
type Greeting = { text: string; lang: string; dir?: "rtl" | "ltr" };

const GREETINGS: Greeting[] = [
  { text: "Welcome", lang: "en" },
  { text: "Bienvenue", lang: "fr" },
  { text: "Bienvenido", lang: "es" },
  { text: "Willkommen", lang: "de" },
  { text: "ようこそ", lang: "ja" },
  { text: "欢迎", lang: "zh" },
  { text: "환영합니다", lang: "ko" },
  { text: "Добро пожаловать", lang: "ru" },
  { text: "أهلاً وسهلاً", lang: "ar", dir: "rtl" },
  { text: "Benvenuto", lang: "it" },
  { text: "Bem-vindo", lang: "pt" },
  { text: "Καλώς ήρθατε", lang: "el" },
  { text: "Karibu", lang: "sw" },
  { text: "Hoş geldiniz", lang: "tr" },
  { text: "स्वागत है", lang: "hi" },
  { text: "नमस्ते", lang: "hi" }, // ← final greeting
];

const LAST_INDEX = GREETINGS.length - 1;
const GREETING_INTERVAL_MS = 260; // each greeting on screen
const NAMASTE_HOLD_MS = 1300; // hold "नमस्ते" before the curtain lifts
const EXIT_MS = 950; // curtain duration (keep in sync with CSS below)

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const photoReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

/* ------------------------------------------------------------------ */
/* WELCOME INTRO — CSS-driven (opacity/transform only → GPU composited) */
/* ------------------------------------------------------------------ */
function WelcomeIntro({
  onLeaveStart,
  onDone,
}: {
  onLeaveStart: () => void;
  onDone: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // keep callbacks in refs so the timer effect never re-runs because of them
  const leaveRef = useRef(onLeaveStart);
  const doneRef = useRef(onDone);
  leaveRef.current = onLeaveStart;
  doneRef.current = onDone;

  // 1) Warm up fonts BEFORE the sequence starts, so nothing swaps or stutters
  useEffect(() => {
    let cancelled = false;
    const start = () => !cancelled && setReady(true);

    const warm = Promise.all([
      document.fonts.load(
        `700 48px ${hindiFont.style.fontFamily}`,
        "नमस्ते स्वागत है"
      ),
      document.fonts.load("500 48px 'Playfair Display'", "Welcome"),
    ]).catch(() => undefined);

    // never wait more than 1.2s, even on slow networks
    Promise.race([
      warm,
      new Promise((r) => setTimeout(r, 1200)),
    ]).then(() => requestAnimationFrame(start));

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) The timeline
  useEffect(() => {
    if (!ready) return;

    if (reduceMotion && index < LAST_INDEX) {
      setIndex(LAST_INDEX);
      return;
    }

    let t: ReturnType<typeof setTimeout>;

    if (index < LAST_INDEX) {
      t = setTimeout(() => setIndex((i) => i + 1), GREETING_INTERVAL_MS);
    } else if (!leaving) {
      t = setTimeout(
        () => {
          setLeaving(true);
          leaveRef.current(); // hero starts revealing as the curtain lifts
        },
        reduceMotion ? 800 : NAMASTE_HOLD_MS
      );
    } else {
      t = setTimeout(() => doneRef.current(), reduceMotion ? 200 : EXIT_MS);
    }

    return () => clearTimeout(t);
  }, [ready, index, leaving, reduceMotion]);

  const current = GREETINGS[index];
  const isFinal = index === LAST_INDEX;

  return (
    <div
      className="intro-root fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white px-6"
      data-leaving={leaving}
    >
      {/* Pre-warm: lay out every script once (invisible) so the browser
          resolves system fallback fonts (CJK, Arabic, Greek…) up-front
          instead of stuttering the first time each one appears. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 opacity-0"
        style={{ fontFamily: HINDI_FONT }}
      >
        {GREETINGS.map((g) => (
          <span key={g.text} lang={g.lang} className="text-4xl">
            {g.text}
          </span>
        ))}
      </div>

      {/* ambient glow */}
      <div className="pointer-events-none absolute h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(124,92,224,0.16),transparent_70%)]" />

      {/* expanding ring on exit */}
      {leaving && !reduceMotion && (
        <div className="intro-ring pointer-events-none absolute h-64 w-64 rounded-full border border-[#7C5CE0]/40" />
      )}

      <div
        className="intro-content relative flex flex-col items-center text-center"
        style={{ opacity: ready ? undefined : 0 }}
      >
        {/* min-height stops layout shift between greetings */}
        <div className="flex min-h-[6rem] items-center justify-center sm:min-h-[7rem] md:min-h-[8rem]">
          <h1
            key={index}
            lang={current.lang}
            dir={current.dir ?? "ltr"}
            style={
              isFinal || current.lang === "hi"
                ? { fontFamily: HINDI_FONT }
                : undefined
            }
            className={
              isFinal
                ? "greet-final text-6xl font-bold leading-tight text-[#7C5CE0] sm:text-7xl md:text-8xl"
                : "greet font-elegant text-4xl leading-tight text-[#1A1A1A] sm:text-5xl md:text-6xl"
            }
          >
            {current.text}
          </h1>
        </div>

        {/* underline draws under the final greeting */}
        <div
          data-on={isFinal}
          className="intro-underline mt-2 h-[2px] w-24 rounded-full bg-[#7C5CE0]"
        />

        {/* single progress bar (one element instead of 16 dots) */}
        <div className="mt-8 h-[2px] w-32 overflow-hidden rounded-full bg-black/10">
          <div
            className="intro-progress h-full w-full origin-left rounded-full bg-[#7C5CE0]"
            style={{ transform: `scaleX(${(index + 1) / GREETINGS.length})` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [revealed, setRevealed] = useState(false); // curtain started lifting
  const [booted, setBooted] = useState(false); // intro fully gone
  const [showRest, setShowRest] = useState(false); // below-the-fold mounted
  const [showParticles, setShowParticles] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  // Lock scrolling while the intro is playing
  useEffect(() => {
    const lock = !booted;
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [booted]);

  // After the intro: mount the heavy sections when the browser is idle,
  // so the curtain/hero animations are never competing with hydration.
  useEffect(() => {
    if (!booted) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let id: number;
    if (w.requestIdleCallback) {
      id = w.requestIdleCallback(() => setShowRest(true), { timeout: 600 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setShowRest(true), 250);
    return () => clearTimeout(t);
  }, [booted]);

  // 3D particles: desktop only, and only after everything else is in
  useEffect(() => {
    if (showRest && !reduceMotion && window.innerWidth >= 1024) {
      const t = setTimeout(() => setShowParticles(true), 400);
      return () => clearTimeout(t);
    }
  }, [showRest, reduceMotion]);

  return (
    <main
      className={`${playfair.variable} ${inter.variable} relative min-h-screen overflow-hidden bg-white`}
    >
      <style>{`
        .font-elegant { font-family: var(--font-playfair), Georgia, serif; }
        .font-elegant-italic { font-family: var(--font-playfair), Georgia, serif; font-style: italic; }
        .font-body { font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif; }

        section[id] { scroll-margin-top: 6rem; }
        html { scroll-behavior: smooth; }

        /* ---------- INTRO (compositor-only: transform + opacity) ---------- */
        .intro-root {
          transform: translate3d(0, 0, 0);
          transition: transform ${EXIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1);
          contain: layout paint;
        }
        .intro-root[data-leaving="true"] {
          transform: translate3d(0, -100%, 0);
          will-change: transform;
        }
        .intro-content {
          transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 800ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .intro-root[data-leaving="true"] .intro-content {
          transform: scale3d(1.12, 1.12, 1);
          opacity: 0;
        }

        @keyframes greet-in {
          from { opacity: 0; transform: translate3d(0, 10px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .greet       { animation: greet-in 160ms ease-out both; }
        .greet-final { animation: greet-in 650ms cubic-bezier(0.22, 1, 0.36, 1) both; }

        .intro-underline {
          transform: scaleX(0);
          opacity: 0;
          transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 150ms,
                      opacity 300ms ease 150ms;
        }
        .intro-underline[data-on="true"] { transform: scaleX(1); opacity: 1; }

        .intro-progress { transition: transform ${GREETING_INTERVAL_MS}ms linear; }

        @keyframes ring-out {
          from { transform: scale3d(0.2, 0.2, 1); opacity: 0.6; }
          to   { transform: scale3d(4, 4, 1);     opacity: 0; }
        }
        .intro-ring { animation: ring-out 1100ms cubic-bezier(0.22, 1, 0.36, 1) both; will-change: transform, opacity; }

        @media (prefers-reduced-motion: reduce) {
          .intro-root, .intro-content { transition-duration: 1ms; }
          .greet, .greet-final, .intro-ring { animation: none; }
        }
      `}</style>

      {/* WELCOME INTRO — plain unmount, no AnimatePresence needed */}
      {!booted && (
        <WelcomeIntro
          onLeaveStart={() => setRevealed(true)}
          onDone={() => setBooted(true)}
        />
      )}

      {booted && <FloatingNav navItems={navItems} />}

      {showParticles && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <Floating3DParticles />
        </div>
      )}
      <div className="pointer-events-none fixed inset-0 z-0 bg-white/40" />

      {/* HOME */}
      <motion.section
        id="home"
        initial="hidden"
        animate={revealed ? "visible" : "hidden"}
        variants={heroContainer}
        className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-14 px-6 py-24 pt-32 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
      >
        <div className="flex flex-col items-center text-center lg:w-3/5 lg:items-start lg:text-left">
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 text-xs text-gray-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_2px_rgba(16,185,129,0.5)]" />
            Available for full-time opportunities
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-body mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gray-500"
          >
            Hello, I&apos;m Priyanshu
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-elegant text-5xl leading-[1.1] text-[#1A1A1A] sm:text-6xl md:text-7xl"
          >
            Building{" "}
            <span className="font-elegant-italic text-[#7C5CE0]">
              beautiful
            </span>
            <br />
            things with code
            <span className="text-[#7C5CE0]">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body mt-6 max-w-lg text-[15px] leading-relaxed text-gray-600 sm:text-base"
          >
            I craft full-stack products with React, Next.js, and Node —
            clean interfaces, reliable systems, and a product mindset from
            first line of code to launch.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <a href="#work">
              <ShimmerButton>View My Work</ShimmerButton>
            </a>
            <a href="#contact">
              <ShimmerButton>Contact Me</ShimmerButton>
            </a>
          </motion.div>
        </div>

        {/* RIGHT — circular photo */}
        <motion.div
          variants={photoReveal}
          className="relative flex w-full items-center justify-center lg:w-2/5"
        >
          <div className="relative">
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-[radial-gradient(circle,rgba(124,92,224,0.16),transparent_70%)]" />

            {/* rotating ring — only spins once the intro is over */}
            <div
              className={`absolute -inset-6 rounded-full border border-dashed border-black/10 ${
                booted ? "animate-[spin_30s_linear_infinite]" : ""
              }`}
            />

            <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:h-80 sm:w-80">
              {!imgFailed ? (
                <Image
                  src="/my-pic1.png"
                  alt="Priyanshu"
                  fill
                  sizes="320px"
                  priority
                  onError={() => setImgFailed(true)}
                  className="object-cover grayscale transition-[filter] duration-700 ease-out hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F2F0EC]">
                  <span className="font-elegant text-6xl text-[#7C5CE0]/40">
                    PS
                  </span>
                </div>
              )}
            </div>

            <div className="absolute -right-4 top-4 flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-xs text-gray-700">
              <span className="font-mono text-[#7C5CE0]">{"</>"}</span>
              Full Stack Dev
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Everything below the hero mounts only after the intro, when idle */}
      {showRest && (
        <>
          <section id="about">
            <AboutMe />
          </section>

          <MoreThanCode />

          <div className="relative">
            <div className="relative z-10">
              <ExpandableCertifications />
            </div>
          </div>

          <SkillsShowcase />

          <section id="work">
            <ProjectsShowcase />
          </section>

          {/* renders its own <section id="leetcode"> */}
          <LeetCodeStats />

          <section id="fun">
            <GamesSection />
          </section>

          <section id="contact">
            <ContactSection />
          </section>
        </>
      )}
    </main>
  );
}