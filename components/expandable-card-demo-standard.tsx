"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

const PURPLE = "#7C5CE0";
const EASE = [0.22, 1, 0.36, 1];

// Small label above the heading (e.g. "03 · Certifications")
const SECTION_NUMBER = "03";

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 4;

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CE0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F5F1]";

// ── Your certifications live here — edit freely ─────────────────
// TODO: replace each `link` with your real certificate verification URL
const certifications = [
  {
    title: "Oracle DevOps Professional",
    issuer: "Oracle Cloud Infrastructure",
    area: "Cloud",
    logo: "https://www.oracle.com/a/ocom/img/oracle-logo.svg",
    summary: "CI/CD, automation, and cloud-native delivery on OCI.",
    skills: ["CI/CD", "Automation", "OCI"],
    link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=2638C7076FF98C840616490D9546F7DD53638EA021A700783FBEBAD6E5770827",
    details:
      "Certified in Oracle Cloud Infrastructure DevOps practices: CI/CD pipelines, automation, and cloud-native deployment workflows. This credential validates hands-on ability to design, implement, and manage automated delivery pipelines on OCI, integrating infrastructure provisioning with application deployment.",
  },
  {
    title: "Postman API Fundamentals",
    issuer: "Postman",
    area: "APIs",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
    summary: "Designing, testing, and automating APIs with Postman.",
    skills: ["API testing", "Collections", "CI pipelines"],
    link: "/postman.jpg",
    details:
      "Certified in API development, testing, and automation using Postman: building collections, managing environments, writing test scripts, and wiring API test suites into CI pipelines for continuous validation.",
  },
  {
    title: "Samsung Solve for Tomorrow",
    issuer: "Samsung",
    area: "Innovation",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    summary: "A socially impactful tech solution, taken from problem to prototype.",
    skills: ["Problem framing", "Prototyping", "Presenting"],
    link: "/image.png",
    details:
      "Recognized in Samsung's Solve for Tomorrow program for designing and building an innovative, socially impactful tech solution, from problem framing through to a working prototype and presentation.",
  },
  {
    title: "Network Fundamental Google Cloud Certified",
    issuer: "Google Cloud Platform",
    area: "Cloud",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
    summary: "Core compute, storage, and networking on GCP.",
    skills: ["Compute", "Storage", "Networking"],
    link: "https://www.credly.com/badges/f267d0ed-5f1e-4ac1-83f3-1355a94be7bc/linked_in?t=sur3bx",
    details:
      "Certified in Google Cloud Platform fundamentals: core compute, storage, and networking services, along with deployment and infrastructure management on GCP.",
  },
  {
    title: "TATA GenAI Certification",
    issuer: "TATA",
    area: "Artificial Intelligence",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    summary: "React, responsive design, and UI/UX best practices.",
    skills: ["React", "Responsive design", "UI/UX"],
    link: "https://www.theforage.com/simulations/tata/data-analytics-t3zr/completed",
    details:
      "Certified in front-end development fundamentals: React, responsive design, and UI/UX best practices, completed as part of Meta's professional certificate track.",
  },
];

// Stats are worked out from the list above, so they never go out of date
const STATS = [
  { value: certifications.length, label: "Credentials" },
  {
    value: certifications.filter((cert) => cert.area === "Cloud").length,
    label: "Cloud platforms",
  },
  {
    value: new Set(certifications.map((cert) => cert.area)).size,
    label: "Focus areas",
  },
];

// =====================================================
// Logo tile (falls back to a letter if the logo fails)
// =====================================================

function LogoTile({ src, name, size = "md" }) {
  const [failed, setFailed] = useState(false);

  const dimensions =
    size === "sm"
      ? "h-9 w-9 rounded-lg"
      : "h-11 w-11 rounded-xl sm:h-12 sm:w-12";

  return (
    <span
      className={`flex shrink-0 items-center justify-center border border-[#E4E1DA] bg-white transition-transform duration-500 group-hover:scale-105 ${dimensions}`}
    >
      {failed ? (
        <span
          className="font-serif text-lg font-medium"
          style={{ color: PURPLE }}
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-2"
        />
      )}
    </span>
  );
}

// =====================================================
// Number that counts up when it scrolls into view
// =====================================================

function CountUp({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setValue(to);
      return;
    }

    const controls = animate(0, to, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, to, reduceMotion]);

  return <span ref={ref}>{value}</span>;
}

// =====================================================
// Slow-moving strip of issuers
// =====================================================

function IssuerMarquee({ items }) {
  const reduceMotion = useReducedMotion();

  const renderItem = (cert, key) => (
    <div key={key} className="group flex shrink-0 items-center gap-3">
      <LogoTile src={cert.logo} name={cert.issuer} size="sm" />
      <span className="whitespace-nowrap font-serif text-xl text-[#6B6B6B]">
        {cert.issuer}
      </span>
    </div>
  );

  // Reduced motion: a still, wrapping row instead of a moving strip
  if (reduceMotion) {
    return (
      <div className="flex flex-wrap gap-x-10 gap-y-5">
        {items.map((cert) => renderItem(cert, cert.title))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <motion.div
        className="flex w-max items-center gap-12 pr-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 34, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items].map((cert, index) =>
          renderItem(cert, `${cert.title}-${index}`)
        )}
      </motion.div>
    </div>
  );
}

// =====================================================
// Section
// =====================================================

export function ExpandableCertifications() {
  const [openTitle, setOpenTitle] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const baseId = useId();
  const reduceMotion = useReducedMotion();

  const visible = certifications.slice(0, visibleCount);
  const hasMore = visibleCount < certifications.length;
  const isExpanded = visibleCount > INITIAL_COUNT;

  return (
    // Solid off-white, painted edge to edge (box-shadow + clip-path), so no
    // dark strip can show at the sides even if a parent wrapper is narrower
    // or dark. It matches the rest of the portfolio.
    <section className="relative z-10 bg-[#F6F5F1] px-5 py-20 text-[#1A1A1A] shadow-[0_0_0_100vmax_#F6F5F1] [clip-path:inset(0_-100vmax)] sm:px-8 md:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16">
          {/* Left: label, headline and a few lines about the credentials */}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8A8A8A] sm:text-[13px]">
              {SECTION_NUMBER} · Certifications
            </p>

            <h2 className="mt-5 font-serif text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
              Certifications I&apos;ve{" "}
              <em className="italic" style={{ color: PURPLE }}>
                earned.
              </em>
            </h2>

            <p className="mt-6 max-w-md text-base leading-[1.75] text-[#1A1A1A] sm:text-lg">
              Programs and credentials that back up the work, each with a link
              to verify it.
            </p>

            <p className="mt-4 max-w-md text-base leading-[1.75] text-[#666] sm:text-lg">
              I treat certifications as a way to learn a topic properly and
              then prove it. These cover cloud platforms, DevOps, API testing,
              and front-end development, the same ground I work on in my
              projects.
            </p>

            <p className="mt-8 text-[15px]" style={{ color: PURPLE }}>
              {certifications.length} credentials, and counting{" "}
              <motion.span
                aria-hidden="true"
                className="inline-block"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
              >
                ✦
              </motion.span>
            </p>
          </motion.div>

          {/* Right: list */}

          <div>
            <ul role="list" className="flex flex-col gap-3">
              {visible.map((cert, index) => {
                const isOpen = openTitle === cert.title;
                const buttonId = `${baseId}-button-${index}`;
                const panelId = `${baseId}-panel-${index}`;

                return (
                  <motion.li
                    key={cert.title}
                    initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.6,
                      delay: reduceMotion
                        ? 0
                        : (index % LOAD_MORE_COUNT) * 0.08,
                      ease: EASE,
                    }}
                  >
                    <motion.div
                      whileHover={isOpen ? undefined : { y: -2 }}
                      transition={{ duration: 0.25 }}
                      className={`rounded-2xl border transition-colors duration-300 ${
                        isOpen
                          ? "border-[#7C5CE0]/30 bg-white shadow-[0_18px_40px_-24px_rgba(124,92,224,0.35)]"
                          : "border-[#E4E1DA] bg-[#FBFAF8] hover:border-[#7C5CE0]/40 hover:bg-white"
                      }`}
                    >
                      <h3>
                        <button
                          type="button"
                          id={buttonId}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() =>
                            setOpenTitle(isOpen ? null : cert.title)
                          }
                          className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left sm:gap-5 sm:px-5 sm:py-5 ${FOCUS}`}
                        >
                          <LogoTile src={cert.logo} name={cert.issuer} />

                          <span className="min-w-0 flex-1">
                            <span className="block font-serif text-xl font-medium leading-snug tracking-tight transition-colors duration-300 group-hover:text-[#7C5CE0] sm:text-2xl">
                              {cert.title}
                            </span>

                            <span className="mt-0.5 block text-[15px] text-[#6B6B6B]">
                              {cert.issuer}
                            </span>
                          </span>

                          <ChevronDown
                            size={20}
                            aria-hidden="true"
                            className={`shrink-0 transition-all duration-300 ${
                              isOpen
                                ? "rotate-180 text-[#7C5CE0]"
                                : "text-[#8A8A8A] group-hover:text-[#7C5CE0]"
                            }`}
                          />
                        </button>
                      </h3>

                      {/* Always visible: one-line summary + skill tags */}

                      <div className="px-4 pb-5 sm:pl-[88px] sm:pr-5">
                        <p className="text-[15px] leading-relaxed text-[#444]">
                          {cert.summary}
                        </p>

                        <ul
                          role="list"
                          aria-label={`${cert.title} skills`}
                          className="mt-3 flex flex-wrap gap-1.5"
                        >
                          {cert.skills.map((skill) => (
                            <li
                              key={skill}
                              className="rounded-full border border-[#E4E1DA] bg-white px-2.5 py-1 text-xs font-medium text-[#6B6B6B]"
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Opens on click: full details + verification link */}

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: reduceMotion ? 0 : 0.4,
                              ease: EASE,
                            }}
                            className="overflow-hidden"
                          >
                            <motion.div
                              initial={
                                reduceMotion ? false : { opacity: 0, y: 8 }
                              }
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                              className="mx-4 border-t border-[#E4E1DA] pb-5 pt-5 sm:mx-0 sm:ml-[88px] sm:mr-5 sm:pb-6"
                            >
                              <p className="max-w-2xl text-[15px] leading-[1.75] text-[#666] sm:text-base">
                                {cert.details}
                              </p>

                              <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#7C5CE0] ${FOCUS}`}
                              >
                                View certificate
                                <ArrowUpRight size={15} aria-hidden="true" />
                              </a>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>

            {(hasMore || isExpanded) && (
              <div className="mt-8 flex justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => {
                    if (hasMore) {
                      setVisibleCount((previous) =>
                        Math.min(
                          previous + LOAD_MORE_COUNT,
                          certifications.length
                        )
                      );
                    } else {
                      setVisibleCount(INITIAL_COUNT);
                      setOpenTitle(null);
                    }
                  }}
                  className={`rounded-full border border-[#E4E1DA] bg-[#FBFAF8] px-6 py-2.5 text-sm font-medium text-[#2A2A2A] transition-colors duration-300 hover:border-[#7C5CE0] hover:text-[#7C5CE0] ${FOCUS}`}
                >
                  {hasMore ? "Show more" : "Show less"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}

        <motion.dl
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-20 grid grid-cols-3 gap-4 border-t border-[#E4E1DA] pt-10 sm:gap-10 lg:mt-24"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-[#6B6B6B] sm:text-[15px]">
                {stat.label}
              </dt>
              <dd className="font-serif text-5xl font-medium leading-none tracking-tight sm:text-6xl">
                <CountUp to={stat.value} />
              </dd>
            </div>
          ))}
        </motion.dl>

        {/* Moving strip of issuers */}

        <div className="mt-14 border-t border-[#E4E1DA] pt-10">
          <IssuerMarquee items={certifications} />
        </div>
      </div>
    </section>
  );
}

export default ExpandableCertifications;