"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { ContactSection } from "@/components/ui/ContactSection";

import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Floating3DParticles } from "@/components/ui/floating-3d-particles";
import { AboutMe } from "@/components/ui/about-me";
import { MoreThanCode } from "@/components/MoreThanCode";
import ExpandableCertifications from "@/components/expandable-card-demo-standard";
import { SkillsShowcase } from "@/components/skills-showcase";
import { ProjectsShowcase } from "@/components/projects-showcase";
import LeetCodeStats from "@/components/leetcode-stats";
import { GamesSection } from "@/components/ui/games-section";

import {
  Home as HomeIcon,
  User,
  Briefcase,
  Code2,
  Gamepad2,
  Mail,
} from "lucide-react";

const navItems = [
  { name: "Home", link: "#home", icon: <HomeIcon size={16} /> },
  { name: "About", link: "#about", icon: <User size={16} /> },
  { name: "Work", link: "#work", icon: <Briefcase size={16} /> },
  { name: "Code", link: "#leetcode", icon: <Code2 size={16} /> },
  { name: "Fun", link: "#fun", icon: <Gamepad2 size={16} /> },
  { name: "Contact", link: "#contact", icon: <Mail size={16} /> },
];

/* ------------------------------------------------------------------ */
/* WELCOME INTRO — cycles through "welcome" in many languages and     */
/* finishes on "नमस्ते" (Namaste) before the portfolio opens.          */
/* The LAST item in this array is always the final greeting.          */
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
const GREETING_INTERVAL_MS = 320; // time each greeting stays on screen
const NAMASTE_HOLD_MS = 1500; // how long "नमस्ते" is held before the exit animation
const EXIT_MS = 1100; // exit animation length before the portfolio opens

const HINDI_FONT = "'Noto Serif Devanagari', 'Playfair Display', serif";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const photoReveal = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const reduceMotion = useReducedMotion();

  // Lock scrolling while the intro is playing
  useEffect(() => {
    document.body.style.overflow = booted ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [booted]);

  // Intro sequence: greetings -> hold on Namaste -> exit animation -> open site
  useEffect(() => {
    if (booted) return;

    // Respect reduced-motion: skip straight to Namaste
    if (reduceMotion && greetingIndex < LAST_INDEX) {
      setGreetingIndex(LAST_INDEX);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (greetingIndex < LAST_INDEX) {
      timeout = setTimeout(
        () => setGreetingIndex((i) => i + 1),
        GREETING_INTERVAL_MS
      );
    } else if (!leaving) {
      timeout = setTimeout(
        () => setLeaving(true),
        reduceMotion ? 900 : NAMASTE_HOLD_MS
      );
    } else {
      timeout = setTimeout(() => setBooted(true), reduceMotion ? 300 : EXIT_MS);
    }

    return () => clearTimeout(timeout);
  }, [greetingIndex, leaving, booted, reduceMotion]);

  const current = GREETINGS[greetingIndex];
  const isFinal = greetingIndex === LAST_INDEX;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFFFFF]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,600;1,700&family=Inter:wght@400;500;600&family=Noto+Serif+Devanagari:wght@500;700&display=swap');
        .font-elegant { font-family: 'Playfair Display', serif; }
        .font-elegant-italic { font-family: 'Playfair Display', serif; font-style: italic; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

        /* Offsets scroll targets so section headings don't land underneath
           the fixed floating navbar when jumping to an anchor. */
        section[id] {
          scroll-margin-top: 6rem;
        }

        /* Smoothly animates the jump whenever any #anchor link (navbar,
           mobile menu, or hero buttons) is clicked, instead of snapping
           instantly to the section. */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* WELCOME INTRO */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            key="welcome-intro"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#FFFFFF] px-6"
          >
            {/* soft ambient glow */}
            <div className="pointer-events-none absolute h-[28rem] w-[28rem] rounded-full bg-[#7C5CE0]/10 blur-[100px]" />

            {/* expanding rings during the exit animation */}
            {leaving && !reduceMotion && (
              <>
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.6 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute h-64 w-64 rounded-full border border-[#7C5CE0]/40"
                />
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.5 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.12,
                  }}
                  className="pointer-events-none absolute h-64 w-64 rounded-full border border-[#7C5CE0]/25"
                />
              </>
            )}

            <motion.div
              animate={
                leaving && !reduceMotion
                  ? { scale: 1.12, opacity: 0, filter: "blur(6px)" }
                  : { scale: 1, opacity: 1, filter: "blur(0px)" }
              }
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={greetingIndex}
                  lang={current.lang}
                  dir={current.dir ?? "ltr"}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{
                    duration: isFinal ? 0.7 : 0.16,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={isFinal || current.lang === "hi" ? { fontFamily: HINDI_FONT } : undefined}
                  className={
                    isFinal
                      ? "text-6xl font-bold leading-tight text-[#7C5CE0] sm:text-7xl md:text-8xl"
                      : "font-elegant text-4xl leading-tight text-[#1A1A1A] sm:text-5xl md:text-6xl"
                  }
                >
                  {current.text}
                </motion.h1>
              </AnimatePresence>

              {/* underline draws in under the final "नमस्ते" */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  isFinal ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
                }
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                style={{ originX: 0.5 }}
                className="mt-4 h-[2px] w-24 rounded-full bg-[#7C5CE0]"
              />

              {/* small progress dots */}
              <div className="mt-8 flex items-center gap-1.5">
                {GREETINGS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === greetingIndex
                        ? "w-5 bg-[#7C5CE0]"
                        : i < greetingIndex
                        ? "w-1 bg-[#7C5CE0]/40"
                        : "w-1 bg-black/10"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {booted && <FloatingNav navItems={navItems} />}

      <div className="absolute inset-0 z-0">
        <Floating3DParticles />
      </div>
      <div className="absolute inset-0 z-0 bg-white/40" />

      {/* HOME — id lets the navbar's "Home" link and logo actually scroll here */}
      <motion.section
        id="home"
        initial="hidden"
        animate={booted ? "visible" : "hidden"}
        variants={heroContainer}
        className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-14 px-6 py-24 pt-32 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
      >
        <div className="flex flex-col items-center text-center lg:w-3/5 lg:items-start lg:text-left">
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 text-xs text-gray-700 backdrop-blur-sm"
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

        {/* RIGHT — circular photo, premium ring treatment */}
        <motion.div
          variants={photoReveal}
          className="relative flex w-full items-center justify-center lg:w-2/5"
        >
          <div className="relative">
            {/* ambient glow behind photo */}
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-[#7C5CE0]/10 blur-[80px]" />

            {/* thin rotating dashed ring */}
            <div className="absolute -inset-6 rounded-full border border-dashed border-black/10 animate-[spin_30s_linear_infinite]" />

            {/* photo */}
            <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:h-80 sm:w-80">
              {!imgFailed ? (
                <Image
                  src="/my-pic1.png"
                  alt="Priyanshu"
                  fill
                  sizes="320px"
                  onError={() => setImgFailed(true)}
                  className="object-cover grayscale transition-all duration-700 ease-out hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F2F0EC]">
                  <span className="font-elegant text-6xl text-[#7C5CE0]/40">
                    PS
                  </span>
                </div>
              )}
            </div>

            {/* floating chip */}
            <div className="absolute -right-4 top-4 flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-xs text-gray-700 backdrop-blur-md">
              <span className="font-mono text-[#7C5CE0]">{"</>"}</span>
              Full Stack Dev
            </div>
          </div>
        </motion.div>
      </motion.section>

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

      {/* WORK — wrapped here since ProjectsShowcase's own source isn't in this file */}
      <section id="work">
        <ProjectsShowcase />
      </section>

      {/* CODE — LeetCodeStats renders its own <section id="leetcode">, so the
          nav's "Code" link resolves without an extra wrapper here. */}
      <LeetCodeStats />

      {/* FUN — full-screen game hub, wired to the navbar's "Fun" link */}
      <section id="fun">
        <GamesSection />
      </section>

      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
}