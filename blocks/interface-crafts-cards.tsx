"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Card = {
  title: string;
  description: string;
  skeleton: React.ReactNode;
  className: string;
  link: string;
  config: {
    y: number;
    x: number;
    rotate: number;
    zIndex: number;
  };
};

type SpringConfig = {
  type: "spring";
  bounce?: number;
  visualDuration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export interface CardsProps {
  spring?: SpringConfig;
  activeScale?: number;
  cardSpacing?: number;
}

const defaultSpring: SpringConfig = {
  type: "spring",
  visualDuration: 0.6,
  bounce: 0.25,
};

export const controls = {
  spring: defaultSpring,
  activeScale: [1.15, 1, 1.6, 0.01],
  cardSpacing: [180, 40, 320, 5],
};

// ── Initial set — shown by default ─────────────────────────────
const initialCards: Card[] = [
  {
    title: "Oracle DevOps Professional",
    description:
      "Certified in Oracle Cloud Infrastructure DevOps practices — CI/CD pipelines, automation, and cloud-native deployment workflows.",
    link: "https://www.credly.com/", // TODO: replace with your actual certificate verification link
    skeleton: (
      <div className="flex h-50 w-full items-center justify-center rounded-xl bg-linear-to-r from-red-700 to-red-700/40 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.oracle.com/a/ocom/img/oracle-logo.svg"
          alt="Oracle logo"
          className="max-h-16 w-auto object-contain brightness-0 invert"
        />
      </div>
    ),
    className: "bg-red-600 [&_h2]:text-white",
    config: {
      y: -20,
      x: 0,
      rotate: -15,
      zIndex: 2,
    },
  },
  {
    title: "Postman API Fundamentals",
    description:
      "Certified in API development, testing, and automation using Postman — collections, environments, and CI integration.",
    link: "https://badgr.com/", // TODO: replace with your actual certificate verification link
    skeleton: (
      <div className="flex h-50 w-full items-center justify-center rounded-xl bg-linear-to-r from-orange-500 to-orange-500/40 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg"
          alt="Postman logo"
          className="h-16 w-16 object-contain"
        />
      </div>
    ),
    className: "bg-orange-500 [&_h2]:text-white",
    config: {
      y: 20,
      x: 180,
      rotate: 8,
      zIndex: 3,
    },
  },
  {
    title: "Samsung Solve for Tomorrow",
    description:
      "Recognized in Samsung's Solve for Tomorrow program for building an innovative, socially impactful tech solution.",
    link: "https://www.samsung.com/", // TODO: replace with your actual certificate verification link
    skeleton: (
      <div className="flex h-50 w-full items-center justify-center rounded-xl bg-linear-to-r from-blue-700 to-blue-700/40 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg"
          alt="Samsung logo"
          className="max-h-10 w-auto object-contain brightness-0 invert"
        />
      </div>
    ),
    className: "bg-blue-600 [&_h2]:text-white",
    config: {
      y: -80,
      x: 360,
      rotate: -5,
      zIndex: 4,
    },
  },
  {
    title: "Google Cloud Certified",
    description:
      "Certified in Google Cloud Platform fundamentals — cloud infrastructure, deployment, and core GCP services.",
    link: "https://www.credential.net/", // TODO: replace with your actual certificate verification link
    skeleton: (
      <div className="flex h-50 w-full items-center justify-center rounded-xl bg-linear-to-r from-neutral-100 to-neutral-300/60 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg"
          alt="Google Cloud logo"
          className="max-h-14 w-auto object-contain"
        />
      </div>
    ),
    className: "bg-neutral-100 [&_h2]:text-black [&_p]:text-neutral-700",
    config: {
      y: 20,
      x: 540,
      rotate: 12,
      zIndex: 5,
    },
  },
];

// ── Extra set — only shown after clicking "Show more" ──────────
// Add/remove/edit entries here freely; the layout adapts automatically.
const moreCards: Card[] = [
  {
    title: "Meta Front-End Developer",
    description:
      "Certified in front-end development fundamentals — React, responsive design, and UI/UX best practices, from Meta's professional certificate track.",
    link: "https://www.coursera.org/", // TODO: replace with your actual certificate verification link
    skeleton: (
      <div className="flex h-50 w-full items-center justify-center rounded-xl bg-linear-to-r from-sky-600 to-sky-600/40 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
          alt="Meta logo"
          className="max-h-12 w-auto object-contain brightness-0 invert"
        />
      </div>
    ),
    className: "bg-sky-600 [&_h2]:text-white",
    config: {
      y: -20,
      x: 0,
      rotate: -15,
      zIndex: 2,
    },
  },
  {
    title: "AWS Cloud Practitioner",
    description:
      "Certified in core AWS services, cloud architecture, security, and billing fundamentals for cloud-based solutions.",
    link: "https://www.credly.com/", // TODO: replace with your actual certificate verification link
    skeleton: (
      <div className="flex h-50 w-full items-center justify-center rounded-xl bg-linear-to-r from-amber-500 to-amber-500/40 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
          alt="AWS logo"
          className="max-h-12 w-auto object-contain"
        />
      </div>
    ),
    className: "bg-amber-500 [&_h2]:text-white",
    config: {
      y: 20,
      x: 180,
      rotate: 8,
      zIndex: 3,
    },
  },
  {
    title: "freeCodeCamp Responsive Web Design",
    description:
      "Completed 300 hours of coursework covering HTML, CSS, Flexbox, Grid, and accessible, responsive layout techniques.",
    link: "https://www.freecodecamp.org/", // TODO: replace with your actual certificate verification link
    skeleton: (
      <div className="flex h-50 w-full items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-emerald-600/40 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Fcc_primary_large.svg"
          alt="freeCodeCamp logo"
          className="max-h-12 w-auto object-contain brightness-0 invert"
        />
      </div>
    ),
    className: "bg-emerald-600 [&_h2]:text-white",
    config: {
      y: -80,
      x: 360,
      rotate: -5,
      zIndex: 4,
    },
  },
];

export const Cards = ({
  spring = defaultSpring,
  activeScale = 1.15,
  cardSpacing = 180,
}: CardsProps = {}) => {
  const [active, setActive] = useState<Card | null>(null);
  const [spacing, setSpacing] = useState(cardSpacing);
  const [showMore, setShowMore] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const cardSpring = spring;

  // Combine the base cards with the extra set once the user opts in.
  const cards: Card[] = showMore ? [...initialCards, ...moreCards] : initialCards;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActive(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () =>
      setSpacing(mq.matches ? cardSpacing : Math.round(cardSpacing * 0.39));
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [cardSpacing]);

  const middle = (cards.length - 1) / 2;

  // Keep the overall spread of the stack roughly constant no matter how
  // many cards are shown, so extra cards never overflow the container —
  // they just sit a little closer together. With the original 4 cards
  // this resolves back to exactly `spacing`.
  const gapCount = Math.max(cards.length - 1, 1);
  const effectiveSpacing = (spacing * 3) / gapCount;

  const isAnyCardActive = () => {
    return active?.title;
  };

  const isCurrentActive = (card: Card) => {
    return active?.title === card.title;
  };

  const handleToggleMore = () => {
    setActive(null);
    setShowMore((v) => !v);
  };

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <motion.div
          ref={ref}
          onClick={() => setActive(null)}
          className="relative mx-auto flex h-120 w-full max-w-5xl items-center justify-center [--height:300px] [--width:220px] lg:[--height:400px] lg:[--width:300px]"
        >
          {cards.map((card, index) => {
            const offsetX = (index - middle) * effectiveSpacing;
            return (
              <motion.div key={card.title}>
                <motion.button
                  initial={{
                    x: 0,
                    scale: 0,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(card);
                  }}
                  animate={{
                    y: isCurrentActive(card)
                      ? 0
                      : isAnyCardActive()
                        ? 400
                        : card.config.y,
                    x: isCurrentActive(card)
                      ? 0
                      : isAnyCardActive()
                        ? offsetX * 0.4
                        : offsetX,
                    rotate: isCurrentActive(card)
                      ? 0
                      : isAnyCardActive()
                        ? 0.2 * card.config.rotate
                        : card.config.rotate,
                    scale: isCurrentActive(card)
                      ? activeScale
                      : isAnyCardActive()
                        ? 0.7
                        : 1,
                  }}
                  whileHover={{
                    scale: isCurrentActive(card)
                      ? activeScale
                      : isAnyCardActive()
                        ? 0.7
                        : 1.05,
                  }}
                  transition={cardSpring}
                  style={{
                    width: `var(--width)`,
                    height: `var(--height)`,
                    marginLeft: `calc(var(--width) / -2)`,
                    marginTop: `calc(var(--height) / -2)`,
                    zIndex: isCurrentActive(card) ? 50 : card.config.zIndex,
                  }}
                  className={cn(
                    "absolute top-1/2 left-1/2 flex cursor-pointer flex-col items-start justify-between overflow-hidden rounded-2xl p-2 md:p-4",
                    card.className,
                  )}
                >
                  {card.skeleton}
                  <div className="mt-5">
                    <motion.h2
                      layoutId={card.title + "title"}
                      className="font-regular max-w-40 text-left text-base md:text-3xl"
                    >
                      {card.title}
                    </motion.h2>
                    <AnimatePresence mode="popLayout">
                      {active?.title === card.title && (
                        <motion.div
                          layoutId={card.title + "description"}
                          initial={{ opacity: 0, x: 20, y: 20, height: 0 }}
                          animate={{ opacity: 1, x: 0, y: 0, height: "auto" }}
                          exit={{ opacity: 0, x: 40, y: 40 }}
                          transition={cardSpring}
                          className="mt-3 text-left"
                        >
                          <p className="text-sm text-white/80 md:text-base">
                            {card.description}
                          </p>
                          <a
                            href={card.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition hover:scale-105 md:text-sm"
                          >
                            View Certificate →
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {moreCards.length > 0 && (
        <motion.button
          onClick={handleToggleMore}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-6 py-2.5 text-sm font-medium text-gray-700 backdrop-blur-sm transition hover:bg-black/[0.06]"
        >
          {showMore
            ? "Show less"
            : `Show ${moreCards.length} more certification${moreCards.length > 1 ? "s" : ""}`}
          <motion.span
            animate={{ rotate: showMore ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex"
          >
            <ChevronDown size={16} />
          </motion.span>
        </motion.button>
      )}
    </div>
  );
};

export default Cards;
