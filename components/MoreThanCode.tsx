"use client";
import React from "react";
import { motion } from "motion/react";

const stats = [
  { value: "1", label: "GenAI Projects" },
  { value: "1", label: "ML/Trading Project" },
  { value: "3", label: "Full-Stack Project" },
  { value: "500+", label: "LinkedIn Views (Open-Source)" },
];

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const MoreThanCode = () => {
  return (
    <section className="relative z-10 overflow-hidden bg-[#F7F5F0] px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="mx-auto max-w-6xl"
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          className="font-body mb-4 text-xs font-medium uppercase tracking-[0.4em] text-gray-400"
        >
          02 · A little context
        </motion.p>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="font-elegant text-4xl leading-[1.15] text-[#1A1A1A] sm:text-5xl md:text-6xl"
        >
          More than{" "}
          <span className="font-elegant-italic text-[#8B6FD1]">
            just code.
          </span>
        </motion.h2>

        {/* Two-column body: main description + side note */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <motion.p
            variants={fadeUp}
            className="font-body max-w-2xl text-lg leading-relaxed text-[#2A2A2A] lg:col-span-7"
          >
            I&apos;m an{" "}
            <span className="font-medium text-[#8B6FD1]">
              Full-Stack AI Developer
            </span>{" "}
            (B.Tech CSE — Full-Stack &amp; DevOps, 2026) focused on building Full-Stack AI systems
            that go beyond demos — from a multi-modal financial assistant
            with live market data, to a machine learning pipeline
            generating real-time trading signals.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="rounded-lg border border-black/10 bg-white/60 p-5 text-sm text-[#5A5A5A] lg:col-span-5"
          >
            <p className="font-body">
              Data in. Ideas out.
              <br />
              Always end-to-end.
            </p>
          </motion.div>
        </div>

        {/* Secondary note */}
        <motion.div
          variants={fadeUp}
          className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12"
        >
          <p className="font-body max-w-2xl text-base leading-relaxed text-[#5A5A5A] lg:col-span-7 lg:col-start-6">
            Across two internships and five independent projects,
            I&apos;ve worked end-to-end: designing the data pipeline,
            training and validating models, and shipping a deployed
            product. I care as much about reliability and edge cases as
            I do about the initial build — and I&apos;m currently looking
            for a full-time role where I can keep doing that.
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="font-body mt-6 text-sm text-[#8B6FD1] lg:col-span-5"
        >
          Coffee → code → models → repeat ✦
        </motion.p>

        {/* Stat row */}
        <motion.div
          variants={fadeUp}
          className="mt-16 grid grid-cols-2 gap-8 border-t border-black/10 pt-10 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-elegant text-4xl text-[#1A1A1A]">
                {stat.value}
              </p>
              <p className="font-body mt-1 text-sm text-[#7A7A7A]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MoreThanCode;