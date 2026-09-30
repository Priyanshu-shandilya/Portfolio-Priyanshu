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
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";

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

const BOOT_DURATION_MS = 3400;

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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = booted ? "" : "hidden";
    if (booted) return;
    const timeout = setTimeout(() => setBooted(true), BOOT_DURATION_MS);
    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, [booted]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFFFFF]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,600;1,700&family=Inter:wght@400;500;600&display=swap');
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

      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFFFFF] px-6"
          >
            <Terminal className="w-full max-w-md border-black/10 bg-black/[0.02] backdrop-blur-xl">
              <TypingAnimation duration={30} className="text-gray-700">
                $ npm run dev
              </TypingAnimation>
              <AnimatedSpan className="text-emerald-600">
                ✔ Compiled successfully
              </AnimatedSpan>
              <TypingAnimation duration={30} className="text-gray-700">
                $ Loading portfolio...
              </TypingAnimation>
              <AnimatedSpan className="text-emerald-600">
                ✔ Done — welcome.
              </AnimatedSpan>
            </Terminal>
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