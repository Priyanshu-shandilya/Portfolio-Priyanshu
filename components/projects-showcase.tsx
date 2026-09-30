"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const PURPLE = "#7C5CE0";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Small label above the heading (e.g. "04 · Selected work")
const SECTION_NUMBER = "04";

const GITHUB_URL = "https://github.com/Priyanshu-shandilya";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CE0] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

// lucide-react dropped brand/trademark icons (Github, Twitter, etc.) in v1,
// so this is a small inline replacement instead of pulling in another package.
function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export type Project = {
  slug: string;
  title: string;
  year: string;
  category: string;
  description: string;
  stack: string[];
  image: string;
  liveUrl?: string;
  repoUrl?: string;
};

// ── Your projects live here — edit freely ───────────────────────
// Descriptions are written from each project's title and category: replace
// them with what the project really does. Stack entries set to "TODO" are
// hidden automatically, and "#" links are treated as "no link yet".
export const PROJECTS: Project[] = [
  {
    slug: "pawcare",
    title: "PawCare",
    year: "2025",
    category: "Pet care & appointment app",
    description:
      "A pet care app that makes booking appointments and keeping track of your pet's care simple, all in one place.",
    stack: ["Next.js", "TODO", "TODO", "TODO"],
    image: "/pawcare.png",
    liveUrl: "http://pow-connect.pages.dev/login",
    repoUrl: "#",
  },
  {
    slug: "productapi",
    title: "ProductAPI",
    year: "2025",
    category: "REST catalog & inventory service",
    description:
      "A REST service for managing a product catalog and its inventory, with clear, well-structured endpoints for every resource.",
    stack: ["Node", "TODO", "TODO", "TODO"],
    image: "/productapi.png",
    liveUrl: "https://github.com/Priyanshu-shandilya/products-api-backend",
    repoUrl: "#",
  },
];

const isRealLink = (url?: string) => Boolean(url && url !== "#");

function Drift({
  className,
  x = [0, 0],
  y = [0, 0],
  rotate = [0, 0],
  duration,
  delay = 0,
  children,
}: {
  className: string;
  x?: number[];
  y?: number[];
  rotate?: number[];
  duration: number;
  delay?: number;
  children?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute ${className}`}
      animate={reduceMotion ? undefined : { x, y, rotate }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function FloatingBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Soft colour orbs */}
      <Drift
        className="-left-24 top-[6%] h-80 w-80 rounded-full bg-[#7C5CE0]/[0.10] blur-[90px]"
        x={[0, 60]}
        y={[0, 40]}
        duration={20}
      />
      <Drift
        className="-right-24 top-[36%] h-96 w-96 rounded-full bg-[#00B8A3]/[0.08] blur-[100px]"
        x={[0, -60]}
        y={[0, 50]}
        duration={24}
        delay={1}
      />
      <Drift
        className="bottom-[-8%] left-[28%] h-72 w-72 rounded-full bg-[#FBBF24]/[0.09] blur-[90px]"
        x={[0, 50]}
        y={[0, -40]}
        duration={26}
        delay={2}
      />

      {/* Drifting shapes */}
      <Drift
        className="left-[5%] top-[20%] hidden md:block"
        y={[0, -26]}
        rotate={[0, 25]}
        duration={9}
      >
        <span className="block h-14 w-14 rounded-full border border-[#7C5CE0]/25" />
      </Drift>

      <Drift
        className="right-[7%] top-[14%] hidden md:block"
        y={[0, 22]}
        rotate={[0, 90]}
        duration={14}
        delay={1}
      >
        <span className="block h-10 w-10 rotate-12 rounded-lg border border-[#00B8A3]/35" />
      </Drift>

      <Drift
        className="left-[9%] top-[62%] hidden sm:block"
        y={[0, -18]}
        rotate={[0, 90]}
        duration={11}
        delay={0.5}
      >
        <span className="relative block h-6 w-6">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#7C5CE0]/40" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#7C5CE0]/40" />
        </span>
      </Drift>

      <Drift
        className="right-[10%] top-[70%] hidden sm:block"
        y={[0, -30]}
        x={[0, 12]}
        duration={8}
        delay={1.5}
      >
        <span className="block h-2.5 w-2.5 rounded-full bg-[#FBBF24]/70" />
      </Drift>

      <Drift
        className="left-[46%] top-[6%] hidden md:block"
        y={[0, 20]}
        duration={10}
        delay={2}
      >
        <span className="block h-2 w-2 rounded-full bg-[#7C5CE0]/45" />
      </Drift>

      <Drift
        className="right-[4%] top-[52%] hidden lg:block"
        y={[0, -20]}
        rotate={[0, -30]}
        duration={13}
      >
        <span className="block h-20 w-20 rounded-full border border-dashed border-[#7C5CE0]/25" />
      </Drift>

      <Drift
        className="left-[3%] top-[88%] hidden md:block"
        y={[0, -16]}
        rotate={[0, 45]}
        duration={12}
        delay={1}
      >
        <span className="block h-8 w-8 rotate-6 rounded-md border border-[#FBBF24]/40" />
      </Drift>
    </div>
  );
}


function ProjectImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#F2F0EC,#EAE4FA)]">
        <span
          className="font-elegant text-7xl"
          style={{ color: `${PURPLE}66` }}
          aria-hidden="true"
        >
          {alt.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}

function StackChips({ stack }: { stack: string[] }) {
  const items = stack.filter((tech) => tech !== "TODO");

  if (!items.length) return null;

  return (
    <span className="mt-4 flex flex-wrap gap-1.5">
      {items.map((tech, index) => (
        <span
          key={`${tech}-${index}`}
          className="font-body rounded-full border border-[#E4E1DA] bg-white px-2.5 py-1 text-xs font-medium text-[#6B6B6B]"
        >
          {tech}
        </span>
      ))}
    </span>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const hasLive = isRealLink(project.liveUrl);
  const hasRepo = isRealLink(project.repoUrl);

  if (!hasLive && !hasRepo) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasLive && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-body inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#7C5CE0] ${FOCUS}`}
        >
          Live site
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}

      {hasRepo && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-body inline-flex items-center gap-1.5 rounded-full border border-[#E4E1DA] bg-white px-4 py-2 text-[13px] font-medium text-[#2A2A2A] transition-colors duration-300 hover:border-[#7C5CE0] hover:text-[#7C5CE0] ${FOCUS}`}
        >
          <GithubIcon size={14} />
          Source
        </a>
      )}
    </div>
  );
}

// =====================================================
// Section
// =====================================================

export function ProjectsShowcase({
  projects = PROJECTS,
}: {
  projects?: Project[];
}) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  if (!projects.length) return null;

  const activeProject = projects[Math.min(active, projects.length - 1)];

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    // The id="work" now lives only on the wrapper in page.tsx (it was
    // duplicated here before, which makes anchor links unreliable).
    <section className="relative z-10 overflow-hidden border-t border-[#E4E1DA] bg-[#FFFFFF] px-5 py-20 sm:px-8 md:py-28 lg:py-32">
      <FloatingBackdrop />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}

        <motion.div
          {...reveal()}
          className="mb-14 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="font-body text-xs font-medium uppercase tracking-[0.3em] text-[#8A8A8A] sm:text-[13px]">
              {SECTION_NUMBER} · Selected work
            </p>

            <h2 className="font-elegant mt-5 text-4xl font-medium leading-[1.08] tracking-tight text-[#1A1A1A] sm:text-5xl md:text-6xl lg:text-7xl">
              Selected{" "}
              <span className="font-elegant-italic text-[#7C5CE0]">work.</span>
            </h2>
          </div>

          <p className="font-body max-w-sm text-[15px] leading-relaxed text-[#666] sm:text-right">
            A few products I&apos;ve designed and built end to end, from first
            commit to production.
          </p>
        </motion.div>

        <div className="hidden lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <ul role="list" className="border-t border-[#E4E1DA]">
              {projects.map((project, i) => {
                const isActive = active === i;

                return (
                  <motion.li
                    key={project.slug}
                    {...reveal(i * 0.1)}
                    className="relative border-b border-[#E4E1DA]"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="work-active-bar"
                        aria-hidden="true"
                        className="absolute bottom-7 left-0 top-7 w-0.5 rounded-full bg-[#7C5CE0]"
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 32 }
                        }
                      />
                    )}

                    <button
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`group flex w-full items-start justify-between gap-6 rounded-md py-7 pl-6 text-left ${FOCUS}`}
                    >
                      <span className="block min-w-0">
                        <span className="flex items-baseline gap-3">
                          <span
                            className={`font-elegant text-3xl transition-colors duration-300 ${
                              isActive
                                ? "font-elegant-italic text-[#7C5CE0]"
                                : "text-[#1A1A1A] group-hover:text-[#7C5CE0]"
                            }`}
                          >
                            {project.title}
                          </span>
                          <span className="font-body text-xs text-[#8A8A8A]">
                            {project.year}
                          </span>
                        </span>

                        <span className="font-body mt-1 block text-sm text-[#6B6B6B]">
                          {project.category}
                        </span>

                        <span className="font-body mt-3 block max-w-md text-[15px] leading-relaxed text-[#666]">
                          {project.description}
                        </span>

                        <StackChips stack={project.stack} />
                      </span>

                      <ArrowUpRight
                        size={20}
                        aria-hidden="true"
                        className={`mt-2 shrink-0 text-[#7C5CE0] transition-all duration-300 ${
                          isActive
                            ? "translate-x-0 translate-y-0 opacity-100"
                            : "-translate-x-1 translate-y-1 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-body mt-8 inline-flex items-center gap-1.5 rounded-sm text-[15px] text-[#7C5CE0] transition-opacity hover:opacity-70 ${FOCUS}`}
            >
              More projects on GitHub
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div>
            <div className="sticky top-32">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -8] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              >
                <div className="overflow-hidden rounded-2xl border border-[#E4E1DA] bg-[#FBFAF8] shadow-[0_30px_70px_-30px_rgba(60,40,120,0.35)]">
                  {/* Browser bar */}
                  <div className="flex items-center gap-3 border-b border-[#E4E1DA] bg-white px-4 py-3">
                    <span className="flex gap-1.5" aria-hidden="true">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E4E1DA]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E4E1DA]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E4E1DA]" />
                    </span>

                    <span className="font-body mx-auto max-w-[60%] truncate rounded-full bg-[#F6F5F1] px-4 py-1 text-xs text-[#8A8A8A]">
                      {activeProject.title}
                    </span>

                    <span className="w-[42px]" aria-hidden="true" />
                  </div>

                  {/* Preview */}
                  <div className="relative aspect-[16/10] w-full bg-[#F2F0EC]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProject.slug}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="absolute inset-0"
                      >
                        <ProjectImage
                          src={activeProject.image}
                          alt={activeProject.title}
                          sizes="(min-width: 1024px) 640px, 100vw"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="font-body text-xs text-[#8A8A8A]">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>

                <ProjectLinks project={activeProject} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: stacked cards */}

        <div className="grid gap-8 md:grid-cols-2 lg:hidden">
          {projects.map((project, i) => (
            <motion.article
              key={project.slug}
              {...reveal(i * 0.1)}
              className="overflow-hidden rounded-2xl border border-[#E4E1DA] bg-[#FBFAF8] shadow-[0_24px_50px_-32px_rgba(60,40,120,0.35)]"
            >
              <div className="relative aspect-[16/10] w-full border-b border-[#E4E1DA] bg-[#F2F0EC]">
                <ProjectImage
                  src={project.image}
                  alt={project.title}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-elegant text-2xl text-[#1A1A1A]">
                    {project.title}
                  </h3>
                  <span className="font-body text-xs text-[#8A8A8A]">
                    {project.year}
                  </span>
                </div>

                <p className="font-body mt-1 text-sm text-[#6B6B6B]">
                  {project.category}
                </p>

                <p className="font-body mt-3 text-[15px] leading-relaxed text-[#666]">
                  {project.description}
                </p>

                <StackChips stack={project.stack} />

                <div className="mt-5 empty:hidden">
                  <ProjectLinks project={project} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-body mt-10 inline-flex items-center gap-1.5 rounded-sm text-[15px] text-[#7C5CE0] transition-opacity hover:opacity-70 lg:hidden ${FOCUS}`}
        >
          More projects on GitHub
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export default ProjectsShowcase;