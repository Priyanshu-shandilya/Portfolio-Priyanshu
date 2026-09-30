"use client";

import { motion, useReducedMotion } from "motion/react";

const experiences = [
  {
    role: "Software Development Intern",
    company: "Your Company Name",
    location: "Remote",
    start: "Jan 2025",
    end: "Present",
    current: true,
    summary:
      "Built and shipped features across the stack for a product used by real customers, working closely with design and backend teams.",
    highlights: [
      "Shipped a redesigned onboarding flow that cut signup drop-off by 18%",
      "Built internal tooling in Next.js and Node that the team still uses daily",
      "Paired with senior engineers on API design and code review",
    ],
    stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
  },
  {
    role: "Frontend Developer",
    company: "Previous Company",
    location: "Remote",
    start: "Jun 2024",
    end: "Dec 2024",
    current: false,
    summary:
      "Owned the frontend for a small product team, turning designs into fast, accessible interfaces.",
    highlights: [
      "Rebuilt the marketing site, improving Lighthouse performance score to 95+",
      "Introduced a shared component library adopted across two products",
    ],
    stack: ["TypeScript", "Tailwind CSS", "Figma"],
  },
  {
    role: "Open Source Contributor",
    company: "Independent",
    location: "Remote",
    start: "2023",
    end: "2024",
    current: false,
    summary:
      "Contributed fixes and small features to developer-tooling projects, learning how large codebases are maintained.",
    highlights: [
      "Landed several merged PRs improving docs and developer experience",
    ],
    stack: ["JavaScript", "Git"],
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ExperienceSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-[#FFFFFF] px-6 py-28"
    >
      <span className="absolute left-[8%] top-16 h-1.5 w-1.5 rounded-full bg-[#7C5CE0]/30" />
      <span className="absolute right-[12%] top-40 h-2 w-2 rounded-full bg-[#7C5CE0]/20" />
      <span className="absolute bottom-24 left-[20%] h-1.5 w-1.5 rounded-full bg-[#7C5CE0]/20" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body mb-3 text-xs font-medium uppercase tracking-[0.4em] text-gray-500">
            02 &middot; Experience
          </p>
          <h2 className="font-elegant text-4xl leading-[1.15] text-[#1A1A1A] sm:text-5xl">
            Where I&apos;ve{" "}
            <span className="font-elegant-italic text-[#7C5CE0]">
              worked
            </span>
            .
          </h2>
          <p className="font-body mt-5 max-w-xl text-[15px] leading-relaxed text-gray-600 sm:text-base">
            A running log of teams I&apos;ve built with and what I picked up
            along the way.
          </p>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={reduceMotion ? {} : container}
          className="relative mt-16 space-y-14 border-l border-black/10 pl-8 sm:pl-10"
        >
          {experiences.map((exp, i) => (
            <motion.li
              key={`${exp.company}-${exp.start}`}
              variants={reduceMotion ? {} : item}
              className="relative"
            >
              {/* timeline marker */}
              <span
                className={`absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full sm:-left-[calc(2.5rem+5px)] ${
                  exp.current
                    ? "bg-[#7C5CE0] shadow-[0_0_0_4px_rgba(124,92,224,0.15)]"
                    : "bg-black/20"
                }`}
              />

              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-elegant text-xl text-[#1A1A1A] sm:text-2xl">
                  {exp.role}
                  <span className="font-body text-base text-gray-500">
                    {" "}
                    &middot; {exp.company}
                  </span>
                </h3>
                <span className="font-body shrink-0 text-xs uppercase tracking-[0.15em] text-gray-500">
                  {exp.start} &ndash; {exp.end}
                </span>
              </div>

              <p className="font-body mt-1 text-xs text-gray-400">
                {exp.location}
              </p>

              <p className="font-body mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
                {exp.summary}
              </p>

              {exp.highlights.length > 0 && (
                <ul className="font-body mt-4 space-y-2">
                  {exp.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-2 text-[14px] leading-relaxed text-gray-600"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#7C5CE0]/60" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {exp.stack.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-body rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}