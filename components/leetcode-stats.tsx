"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView, useMotionValue, animate } from "motion/react";
import {
  ExternalLink,
  Copy,
  Check,
  Flame,
  Target,
  Activity,
  Trophy,
  Sparkles,
} from "lucide-react";

/* ---------------------------------------------------------------- types */

type LeetCodeStats = {
  username: string;
  profileUrl: string;
  ranking: number | null;
  streak: number;
  activeDays: number;
  solved: { all: number; easy: number; medium: number; hard: number };
  totals: { all: number; easy: number; medium: number; hard: number };
  acceptanceRate: number | null;
  submissions: number;
  contest: {
    rating: number;
    globalRanking: number;
    attended: number;
    topPercentage: number;
  } | null;
  updatedAt: string;
};

const DIFF = {
  Easy: "#00B8A3",
  Medium: "#FFA116",
  Hard: "#FF375F",
} as const;

const DIFF_SOFT = {
  Easy: "#6EEBD4",
  Medium: "#FFCB6B",
  Hard: "#FF7C9A",
} as const;

const ACCENT = "#7C5CE0";
const ACCENT_SOFT = "#B9A6F5";
const INK = "#1A1A1A";
const CREAM = "#FAF7F1";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  return hrs === 1 ? "1 hr ago" : `${hrs} hrs ago`;
}

/**
 * Derives a light-touch "milestone" badge purely from the solved count that
 * is already in `stats` — no extra fields required from the API. Keeps the
 * floating chip on the ring honest (it used to hard-code "Top solver"
 * regardless of the underlying numbers).
 */
function getMilestone(solvedAll: number): { label: string; Icon: typeof Trophy } | null {
  if (solvedAll >= 500) return { label: "Grandmaster · 500+", Icon: Trophy };
  if (solvedAll >= 250) return { label: "Elite grinder · 250+", Icon: Trophy };
  if (solvedAll >= 100) return { label: "Century club · 100+", Icon: Trophy };
  if (solvedAll >= 50) return { label: "Building momentum · 50+", Icon: Flame };
  if (solvedAll > 0) return { label: "Just getting started", Icon: Sparkles };
  return null;
}

/* ------------------------------------------------------- decorative art */
/* A quiet multi-color mesh + scattered dots behind the section, echoing
   the difficulty palette so the background feels tied to the data rather
   than generic decoration. Kept low-opacity and blurred so it reads as
   atmosphere, not noise. */

function SectionMesh() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full blur-[110px]"
        style={{ background: `${ACCENT}1F` }}
      />
      <div
        className="absolute -right-32 top-10 h-96 w-96 rounded-full blur-[110px]"
        style={{ background: `${DIFF.Medium}17` }}
      />
      <div
        className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full blur-[100px]"
        style={{ background: `${DIFF.Easy}17` }}
      />
      {/* subtle grain for a premium, printed-paper texture */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-multiply">
        <filter id="lc-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lc-grain)" />
      </svg>
    </div>
  );
}

const DOTS: Array<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  color: string;
  opacity: number;
}> = [
  { top: "3%", left: "1.5%", size: 6, color: ACCENT, opacity: 0.3 },
  { top: "1%", left: "4.5%", size: 3, color: DIFF.Medium, opacity: 0.3 },
  { top: "12%", right: "3%", size: 5, color: DIFF.Easy, opacity: 0.28 },
  { top: "58%", left: "45%", size: 4, color: ACCENT, opacity: 0.22 },
  { bottom: "16%", left: "36%", size: 4, color: DIFF.Hard, opacity: 0.22 },
  { bottom: "4%", right: "26%", size: 5, color: ACCENT, opacity: 0.2 },
  { top: "46%", right: "1.5%", size: 4, color: INK, opacity: 0.12 },
];

function AmbientDots() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: d.top,
            bottom: d.bottom,
            left: d.left,
            right: d.right,
            width: d.size,
            height: d.size,
            background: d.color,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------- gradient-bordered card */
/* A reusable "premium card" shell: a soft gradient hairline border, glass
   fill, and a diffused colored shadow — used for every card in the section
   so the whole block reads as one considered system. */

function GradientCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] p-[1px] shadow-[0_30px_80px_-40px_rgba(124,92,224,0.35)] ${className}`}
      style={{
        background: `linear-gradient(155deg, ${ACCENT}55, rgba(0,0,0,0.06) 40%, ${DIFF.Easy}33)`,
      }}
    >
      <div className="h-full w-full rounded-[calc(2rem-1px)] bg-white/90 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- count-up hook */

function Counter({
  value,
  duration = 1.6,
  decimals = 0,
  start,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  start: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!start) return;
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [start, value, duration, mv]);

  return (
    <span className="tabular-nums">
      {decimals ? display.toFixed(decimals) : Math.round(display).toLocaleString()}
    </span>
  );
}

/* ------------------------------------------------------------- ring chart */

function SolvedRing({ stats, start }: { stats: LeetCodeStats; start: boolean }) {
  const uid = useId();
  const R = 96;
  const { easy, medium, hard, all } = stats.solved;
  const totalAll = stats.totals.all || 1;
  const milestone = getMilestone(all);

  const segs = [
    { key: "Easy", value: easy, color: DIFF.Easy, soft: DIFF_SOFT.Easy },
    { key: "Medium", value: medium, color: DIFF.Medium, soft: DIFF_SOFT.Medium },
    { key: "Hard", value: hard, color: DIFF.Hard, soft: DIFF_SOFT.Hard },
  ];

  // Build cumulative offsets as fractions (0–1) of the full circle, in
  // stacking order. Each segment is drawn with Motion's pathLength/pathOffset
  // primitives, which measure the circle's real length themselves.
  let cursor = 0;
  const drawn = segs.map((s) => {
    const frac = s.value / totalAll;
    const offset = cursor;
    cursor += frac;
    return { ...s, frac, offset };
  });

  return (
    <div className="relative flex shrink-0 items-center justify-center">
      <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-[#7C5CE0]/[0.10] blur-[80px]" />
      <div className="absolute -inset-4 rounded-full border border-dashed border-black/10 animate-[spin_36s_linear_infinite]" />
      <div className="absolute -inset-8 rounded-full border border-dotted border-black/[0.06] animate-[spin_54s_linear_infinite_reverse]" />

      {/* floating milestone chip, derived honestly from solved count */}
      {milestone && (
        <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-black/[0.08] bg-white/95 px-3 py-1 text-[11px] font-medium text-gray-700 shadow-[0_8px_24px_-8px_rgba(26,26,26,0.25)]">
          <milestone.Icon size={11} className="text-[#FFA116]" />
          {milestone.label}
        </div>
      )}

      <div className="relative grid h-[200px] w-[200px] place-items-center sm:h-[236px] sm:w-[236px]">
        <svg viewBox="0 0 240 240" className="h-full w-full -rotate-90" aria-hidden="true">
          <defs>
            {drawn.map((s) => (
              <linearGradient key={s.key} id={`lc-grad-${uid}-${s.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={s.soft} />
                <stop offset="100%" stopColor={s.color} />
              </linearGradient>
            ))}
            <filter id={`lc-glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="14" />
          {drawn.map((s) => (
            <motion.circle
              key={s.key}
              cx="120"
              cy="120"
              r={R}
              fill="none"
              stroke={`url(#lc-grad-${uid}-${s.key})`}
              strokeWidth="14"
              strokeLinecap="round"
              filter={`url(#lc-glow-${uid})`}
              initial={{ pathLength: 0, pathOffset: s.offset, opacity: 0 }}
              animate={
                start ? { pathLength: s.frac, pathOffset: s.offset, opacity: 1 } : undefined
              }
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            />
          ))}
        </svg>

        <div className="absolute flex flex-col items-center px-4 text-center">
          <span
            className="font-elegant bg-clip-text text-5xl leading-none text-transparent sm:text-6xl"
            style={{ backgroundImage: `linear-gradient(135deg, ${INK}, ${ACCENT})` }}
          >
            <Counter value={all} start={start} />
          </span>
          <span className="font-body mt-3 text-xs text-gray-500">
            of {stats.totals.all.toLocaleString()} solved
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- diff bars */

function DifficultyBar({
  label,
  solved,
  total,
  color,
  soft,
  start,
  delay,
}: {
  label: string;
  solved: number;
  total: number;
  color: string;
  soft: string;
  start: boolean;
  delay: number;
}) {
  const pct = total ? (solved / total) * 100 : 0;
  // Give a sliver a floor so a real, non-zero count never renders invisible.
  const displayPct = solved > 0 ? Math.max(pct, 1.5) : 0;

  return (
    <div className="group">
      <div className="font-body mb-2 flex items-baseline justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-gray-700">
          <span
            className="h-2.5 w-2.5 rounded-full ring-4"
            style={{ background: color, boxShadow: `0 0 0 4px ${color}1A` }}
          />
          {label}
        </span>
        <span className="flex items-baseline gap-2">
          <span className="tabular-nums text-gray-500">
            <span className="font-semibold text-[#1A1A1A]">
              <Counter value={solved} start={start} />
            </span>
            {" / "}
            {total.toLocaleString()}
          </span>
          <span
            className="w-11 rounded-full py-0.5 text-right text-xs font-medium tabular-nums"
            style={{ color }}
          >
            <Counter value={pct} decimals={pct < 10 ? 1 : 0} start={start} />%
          </span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
        <motion.div
          className="h-full rounded-full transition-[filter] duration-300 group-hover:brightness-110"
          style={{ background: `linear-gradient(90deg, ${soft}, ${color})` }}
          initial={{ width: 0 }}
          animate={start ? { width: `${displayPct}%` } : undefined}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
        />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- section */

export function LeetCodeStats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const [data, setData] = useState<LeetCodeStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Poll every 20s, plus refetch immediately whenever the tab regains focus
  // or becomes visible — so a problem solved on LeetCode shows up here
  // without needing a manual reload.
  useEffect(() => {
    let alive = true;

    const load = () => {
      fetch("/api/leetcode", { cache: "no-store" })
        .then(async (r) => {
          const j = await r.json();
          if (!r.ok) throw new Error(j.error ?? "Request failed");
          return j as LeetCodeStats;
        })
        .then((j) => {
          if (alive) {
            setData(j);
            setError(null);
          }
        })
        .catch((e) => alive && setError(e.message));
    };

    load();
    const interval = setInterval(load, 20000);

    const onFocus = () => load();
    const onVisibility = () => {
      if (document.visibilityState === "visible") load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handleCopy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — ignore silently */
    }
  };

  const ready = inView && !!data;
  const headline = data?.contest
    ? {
        label: "Contest rating",
        value: data.contest.rating,
        note: `${data.contest.attended} contests · top ${data.contest.topPercentage}%`,
      }
    : { label: "Global ranking", value: data?.ranking ?? null, note: "among all LeetCode users" };

  return (
    <section
      ref={ref}
      id="leetcode"
      className="relative z-10 overflow-hidden px-6 py-20 sm:py-28"
      style={{ background: CREAM }}
    >
      <style>{`
        .lc-shine { position: relative; overflow: hidden; }
        .lc-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.7s ease;
        }
        .lc-shine:hover::after { transform: translateX(120%); }
      `}</style>

      <SectionMesh />
      <AmbientDots />

      {/* oversized ghost word — quiet editorial backdrop, a premium touch
          borrowed from magazine section-openers */}
      <div
        aria-hidden="true"
        className="font-elegant pointer-events-none absolute -top-6 right-4 select-none text-[7rem] italic leading-none text-black/[0.035] sm:text-[10rem]"
      >
        {"</>"}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* header */}
        <div className="mb-14 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-body mb-5 inline-flex items-center gap-2 text-xs tracking-[0.18em] text-gray-400">
              <span className="h-px w-6" style={{ background: ACCENT }} />
              05 &middot; PROBLEM SOLVING
            </p>
            <h2 className="text-3xl leading-[1.15] text-[#1A1A1A] sm:text-4xl">
              <span className="font-elegant">Reps that stay off</span>
              <br />
              <span className="font-elegant-italic text-[#7C5CE0]">the resume.</span>
            </h2>
            <p className="font-body mt-5 max-w-md text-[15px] leading-relaxed text-gray-600">
              Data structures and algorithms, practiced most days. This card
              pulls live from my LeetCode profile — no manual updates.
            </p>
          </div>

          {data && (
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-body text-xs text-gray-500">
                Live &middot; updated {timeAgo(data.updatedAt)}
              </span>
            </div>
          )}
        </div>

        {/* error */}
        {error && (
          <div className="font-body rounded-[1.75rem] border border-black/10 bg-white/70 p-8 text-sm text-gray-600">
            Live stats are unavailable right now. You can view the profile
            directly on{" "}
            <a
              className="text-[#7C5CE0] underline underline-offset-4"
              href="https://leetcode.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LeetCode
            </a>
            .
          </div>
        )}

        {/* skeleton */}
        {!data && !error && (
          <div className="grid gap-6 lg:grid-cols-[236px_1fr]">
            <div className="mx-auto h-[236px] w-[236px] animate-pulse rounded-full bg-black/[0.05]" />
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-black/[0.05]" />
              ))}
            </div>
          </div>
        )}

        {/* content */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* stats card */}
            <GradientCard>
              <div className="p-7 sm:p-10">
                <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
                  <SolvedRing stats={data} start={ready} />

                  <div className="w-full flex-1 space-y-7">
                    <DifficultyBar
                      label="Easy"
                      solved={data.solved.easy}
                      total={data.totals.easy}
                      color={DIFF.Easy}
                      soft={DIFF_SOFT.Easy}
                      start={ready}
                      delay={0.2}
                    />
                    <DifficultyBar
                      label="Medium"
                      solved={data.solved.medium}
                      total={data.totals.medium}
                      color={DIFF.Medium}
                      soft={DIFF_SOFT.Medium}
                      start={ready}
                      delay={0.32}
                    />
                    <DifficultyBar
                      label="Hard"
                      solved={data.solved.hard}
                      total={data.totals.hard}
                      color={DIFF.Hard}
                      soft={DIFF_SOFT.Hard}
                      start={ready}
                      delay={0.44}
                    />
                  </div>
                </div>
              </div>
            </GradientCard>

            {/* profile card — a "quickest way to reach me" style bento block */}
            <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-stretch">
              <GradientCard>
                <div className="flex h-full flex-col justify-center px-7 py-7 sm:px-8">
                  <span className="font-body text-xs uppercase tracking-[0.1em] text-gray-400">
                    {headline.label}
                  </span>
                  <span
                    className="font-elegant mt-1 bg-clip-text text-4xl leading-none text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${INK}, ${ACCENT})` }}
                  >
                    {headline.value === null ? "—" : <Counter value={headline.value} start={ready} />}
                  </span>
                  <span className="font-body mt-2 text-xs text-gray-500">{headline.note}</span>

                  <div className="mt-6 flex divide-x divide-black/[0.06] border-t border-black/[0.06] pt-5">
                    <div className="flex flex-1 items-center gap-2.5 pr-5">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${ACCENT}14` }}
                      >
                        <Flame size={14} className="text-[#7C5CE0]" />
                      </span>
                      <div>
                        <div className="font-elegant text-xl leading-none text-[#1A1A1A]">
                          <Counter value={data.streak} start={ready} />
                        </div>
                        <div className="font-body mt-1 text-[11px] text-gray-500">Longest streak</div>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-2.5 pl-5">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${ACCENT}14` }}
                      >
                        <Target size={14} className="text-[#7C5CE0]" />
                      </span>
                      <div>
                        <div className="font-elegant text-xl leading-none text-[#1A1A1A]">
                          {data.acceptanceRate === null ? (
                            "—"
                          ) : (
                            <>
                              <Counter value={data.acceptanceRate} decimals={1} start={ready} />%
                            </>
                          )}
                        </div>
                        <div className="font-body mt-1 text-[11px] text-gray-500">Acceptance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </GradientCard>

              {/* actions — secondary "copy" pill stacked over primary "visit" pill */}
              <div className="flex flex-row gap-3 sm:w-56 sm:flex-col">
                <button
                  onClick={handleCopy}
                  aria-label="Copy LeetCode profile link"
                  className="font-body group inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3.5 text-sm text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7C5CE0]/50 hover:text-[#7C5CE0] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C5CE0] sm:flex-none"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy link"}
                </button>

                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${data.username}'s LeetCode profile`}
                  className="lc-shine font-body group inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-medium text-white shadow-[0_16px_40px_-14px_rgba(124,92,224,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-14px_rgba(124,92,224,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C5CE0] sm:flex-none"
                  style={{ background: `linear-gradient(135deg, ${INK}, ${ACCENT})` }}
                >
                  @{data.username}
                  <ExternalLink
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>

            <div className="font-body mt-6 flex items-center justify-center gap-2 rounded-full border border-black/[0.05] bg-white/50 px-4 py-2 text-xs text-gray-400 backdrop-blur-sm w-fit mx-auto">
              <Activity size={12} className="text-[#7C5CE0]" />
              {data.submissions.toLocaleString()} total submissions
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default LeetCodeStats;