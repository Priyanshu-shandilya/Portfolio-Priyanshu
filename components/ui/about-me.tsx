"use client";

import { motion, useReducedMotion } from "motion/react";
import { Code2, Rocket, Sparkles } from "lucide-react";

const PURPLE = "#7C5CE0";

// Small label above the heading (e.g. "01 · About me")
const SECTION_NUMBER = "01";

const highlights = [
  {
    icon: Code2,
    title: "Full stack development",
    description:
      "End-to-end web apps with React, Next.js, Node.js, and MongoDB.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted workflow",
    description:
      "Modern AI tooling to ship faster without cutting corners on quality.",
  },
  {
    icon: Rocket,
    title: "Product mindset",
    description:
      "Scalable, user-first experiences built to solve real problems.",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const AboutMe = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 px-5 py-20 text-[#1A1A1A] sm:px-8 md:py-28 lg:py-32">
      <motion.div
        variants={container}
        initial={reduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto max-w-6xl"
      >
        {/* Label + headline */}

        <motion.div variants={fadeUp}>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8A8A8A] sm:text-[13px]">
            {SECTION_NUMBER} · About me
          </p>

          <h2 className="mt-5 font-serif text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            I&apos;m Priyanshu, a full stack{" "}
            <em className="italic" style={{ color: PURPLE }}>
              developer.
            </em>
          </h2>
        </motion.div>

        {/* Intro + side card + second paragraph */}

        <motion.div
          variants={fadeUp}
          className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10"
        >
          <p className="text-lg leading-[1.75] sm:text-xl lg:col-span-7 lg:text-[21px]">
            I enjoy turning ideas into{" "}
            <span style={{ color: PURPLE }}>
              clean, functional, and visually engaging products
            </span>{" "}
            — working across the stack, from designing intuitive interfaces to
            building reliable backend systems, and always exploring new tools
            to build things faster and better.
          </p>

          <div className="rounded-2xl border border-[#E4E1DA] bg-[#FBFAF8] p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.18)] sm:p-7 lg:col-span-5 lg:self-start">
            <p className="text-[15px] leading-relaxed text-[#3A3A3A]">
              Ideas in. Products out.
              <br />
              Built across the whole stack.
            </p>
          </div>

          <p className="text-base leading-[1.8] text-[#666] sm:text-lg lg:col-span-7 lg:col-start-6">
            I care about scalable, user-first experiences that solve real
            problems, and I&apos;d rather ship something small and solid than
            something big and fragile.
          </p>

          <p
            className="text-[15px] lg:col-span-12"
            style={{ color: PURPLE }}
          >
            Ideas → interfaces → systems → shipped ✦
          </p>
        </motion.div>

        {/* Highlights */}

        <motion.div
          variants={fadeUp}
          className="mt-14 grid divide-y divide-[#E4E1DA] border-t border-[#E4E1DA] sm:mt-16 md:grid-cols-3 md:gap-10 md:divide-y-0 lg:mt-20"
        >
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="py-7 md:pb-0 md:pt-10"
              >
                <span
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E1DA] bg-[#FBFAF8]"
                  style={{ color: PURPLE }}
                >
                  <Icon size={18} aria-hidden="true" />
                </span>

                <h3 className="font-serif text-2xl font-medium leading-snug tracking-tight sm:text-[26px]">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[#6B6B6B]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutMe;