"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Brain,
  Grid3x3,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shared helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Reads/writes a best-score style value to localStorage, tolerating failure
 *  (private browsing, disabled storage, SSR) so a game never crashes on it. */
function useBestScore(key: string) {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setBest(Number(raw));
    } catch {
      /* storage unavailable — best score just won't persist */
    }
  }, [key]);

  const submit = useCallback(
    (value: number) => {
      setBest((prev) => {
        const next = prev === null ? value : Math.max(prev, value);
        try {
          window.localStorage.setItem(key, String(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key]
  );

  return { best, submit };
}

type GameId =
  | "tic-tac-toe"
  | "memory-match"
  | "simon-says"
  | "snake"
  | "reaction-test"
  | "number-merge";

type GameMeta = {
  id: GameId;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  accent: string;
};

const GAMES: GameMeta[] = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    tagline: "You're X. The bot plays perfectly — can you force a draw?",
    icon: <Grid3x3 size={20} strokeWidth={1.75} />,
    accent: "#7C5CE0",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    tagline: "Flip pairs, clear the board, beat your move count.",
    icon: <Brain size={20} strokeWidth={1.75} />,
    accent: "#2DD4BF",
  },
  {
    id: "simon-says",
    title: "Simon Says",
    tagline: "Watch the pattern, repeat it back, survive as long as you can.",
    icon: <Sparkles size={20} strokeWidth={1.75} />,
    accent: "#DB9F2B",
  },
  {
    id: "snake",
    title: "Snake",
    tagline: "Collect food, grow longer, and avoid the walls.",
    icon: <Grid3x3 size={20} strokeWidth={1.75} />,
    accent: "#22A06B",
  },
  {
    id: "reaction-test",
    title: "Reaction Test",
    tagline: "Wait for the signal and click as quickly as possible.",
    icon: <Sparkles size={20} strokeWidth={1.75} />,
    accent: "#E0607C",
  },
  {
    id: "number-merge",
    title: "Number Merge",
    tagline: "Combine matching tiles and build the biggest number.",
    icon: <Trophy size={20} strokeWidth={1.75} />,
    accent: "#4385E5",
  },
];

/* -------------------------------------------------------------------------- */
/*  Section shell                                                             */
/* -------------------------------------------------------------------------- */

export function GamesSection() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const activeMeta = useMemo(
    () => GAMES.find((g) => g.id === activeGame) ?? null,
    [activeGame]
  );

  // Lock page scroll while a game is taking over the screen.
  useEffect(() => {
    document.body.style.overflow = activeGame ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeGame]);

  // Let Escape back out of a game, same as the mobile nav menu does.
  useEffect(() => {
    if (!activeGame) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveGame(null);
        setIsLaunching(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGame]);

  return (
    <section id="fun" className="relative bg-[#FAFAF8] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="font-body mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gray-500">
          Off the clock
        </p>
        <h2 className="font-elegant text-4xl text-[#1A1A1A] sm:text-5xl">
          A little{" "}
          <span className="font-elegant-italic text-[#7C5CE0]">fun</span>,
          if you have a minute
        </h2>
        <p className="font-body mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Six quick games I built while procrastinating on this portfolio.
          Pick one — it opens full screen, and you can leave anytime.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => {
                setActiveGame(game.id);
                setIsLaunching(true);
              }}
              className="group relative flex flex-col items-start rounded-2xl border border-black/10 bg-white p-6 text-left shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CE0]/60"
            >
              <span
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  color: game.accent,
                  backgroundColor: `${game.accent}1A`,
                }}
              >
                {game.icon}
              </span>
              <span className="font-elegant text-lg text-[#1A1A1A]">
                {game.title}
              </span>
              <span className="font-body mt-1.5 text-[13px] leading-relaxed text-gray-500">
                {game.tagline}
              </span>
              <span
                className="font-body mt-4 text-[13px] font-medium transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: game.accent }}
              >
                Play →
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeMeta && (
          <motion.div
            key="game-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col bg-[#FFFFFF]"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeMeta.title} game`}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 sm:px-10">
              <button
                type="button"
                onClick={() => {
                  setActiveGame(null);
                  setIsLaunching(false);
                }}
                className="font-body flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CE0]/60"
              >
                <ArrowLeft size={15} />
                All games
              </button>
              <span className="font-elegant text-lg text-[#1A1A1A]">
                {activeMeta.title}
              </span>
              <span className="w-[104px]" aria-hidden="true" />
            </div>

            <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10">
              {isLaunching ? (
                <GameOpening game={activeMeta} onComplete={() => setIsLaunching(false)} />
              ) : (
                <>
                  {activeMeta.id === "tic-tac-toe" && <TicTacToe />}
                  {activeMeta.id === "memory-match" && <MemoryMatch />}
                  {activeMeta.id === "simon-says" && <SimonSays />}
                  {activeMeta.id === "snake" && <Snake />}
                  {activeMeta.id === "reaction-test" && <ReactionTest />}
                  {activeMeta.id === "number-merge" && <NumberMerge />}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Game 1 — Tic Tac Toe (unbeatable minimax bot, player is X)                */
/* -------------------------------------------------------------------------- */

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinner(board: Cell[]): { winner: Cell; line: number[] | null } {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

function minimax(board: Cell[], player: "X" | "O"): { score: number; move: number | null } {
  const { winner } = getWinner(board);
  if (winner === "O") return { score: 1, move: null };
  if (winner === "X") return { score: -1, move: null };
  if (board.every((cell) => cell !== null)) return { score: 0, move: null };

  const empties = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  let best = player === "O" ? -Infinity : Infinity;
  let bestMove: number | null = null;

  for (const index of empties) {
    const next = [...board];
    next[index] = player;
    const { score } = minimax(next, player === "O" ? "X" : "O");

    if (player === "O" ? score > best : score < best) {
      best = score;
      bestMove = index;
    }
  }

  return { score: best, move: bestMove };
}

function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [record, setRecord] = useState({ wins: 0, losses: 0, draws: 0 });
  const { winner, line } = getWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);
  const gameOver = Boolean(winner) || isDraw;

  // Bot's turn.
  useEffect(() => {
    if (turn !== "O" || gameOver) return;
    const timeout = setTimeout(() => {
      const { move } = minimax(board, "O");
      if (move !== null) {
        setBoard((prev) => {
          const next = [...prev];
          next[move] = "O";
          return next;
        });
        setTurn("X");
      }
    }, 450);
    return () => clearTimeout(timeout);
  }, [turn, board, gameOver]);

  // Tally the record once a game ends.
  const recorded = useRef(false);
  useEffect(() => {
    if (!gameOver) {
      recorded.current = false;
      return;
    }
    if (recorded.current) return;
    recorded.current = true;
    setRecord((prev) => ({
      wins: prev.wins + (winner === "X" ? 1 : 0),
      losses: prev.losses + (winner === "O" ? 1 : 0),
      draws: prev.draws + (isDraw ? 1 : 0),
    }));
  }, [gameOver, winner, isDraw]);

  const handleCellClick = (index: number) => {
    if (board[index] || turn !== "X" || gameOver) return;
    setBoard((prev) => {
      const next = [...prev];
      next[index] = "X";
      return next;
    });
    setTurn("O");
  };

  const reset = () => setBoard(Array(9).fill(null));

  const status = winner
    ? winner === "X"
      ? "You win — nicely played."
      : "The bot takes this one."
    : isDraw
      ? "Draw. Perfect play both sides."
      : turn === "X"
        ? "Your move."
        : "Bot is thinking…";

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-body text-sm text-gray-600">{status}</p>

      <div className="grid grid-cols-3 gap-2.5">
        {board.map((cell, index) => {
          const isWinningCell = line?.includes(index);
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleCellClick(index)}
              disabled={Boolean(cell) || turn !== "X" || gameOver}
              className={cn(
                "font-elegant flex h-20 w-20 items-center justify-center rounded-xl border text-3xl transition-colors sm:h-24 sm:w-24",
                isWinningCell
                  ? "border-[#7C5CE0] bg-[#7C5CE0]/10"
                  : "border-black/10 bg-[#FAFAF8] hover:bg-black/[0.03]",
                cell === "X" && "text-[#7C5CE0]",
                cell === "O" && "text-gray-400"
              )}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <div className="font-body flex items-center gap-4 text-xs text-gray-500">
        <span>Wins {record.wins}</span>
        <span aria-hidden="true">·</span>
        <span>Losses {record.losses}</span>
        <span aria-hidden="true">·</span>
        <span>Draws {record.draws}</span>
      </div>

      <button
        type="button"
        onClick={reset}
        className="font-body flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
      >
        <RotateCcw size={14} />
        New game
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Game 2 — Memory Match                                                     */
/* -------------------------------------------------------------------------- */

const MEMORY_SYMBOLS = ["🌱", "⚡", "🌙", "🔥", "🍀", "⭐"];

type MemoryCard = { id: number; symbol: string; matched: boolean };

function shuffledDeck(): MemoryCard[] {
  const deck = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS].map((symbol, index) => ({
    id: index,
    symbol,
    matched: false,
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function MemoryMatch() {
  const [cards, setCards] = useState<MemoryCard[]>(() => shuffledDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const { best, submit } = useBestScore("portfolio-memory-best-moves");

  const won = cards.every((card) => card.matched);

  useEffect(() => {
    if (won) submit(moves === 0 ? 0 : -moves); // fewer moves = "higher" score
  }, [won, moves, submit]);

  const handleFlip = (id: number) => {
    if (locked || flipped.includes(id)) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched) return;

    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first && second && first.symbol === second.symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
            )
          );
          setFlipped([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 700);
      }
    }
  };

  const reset = () => {
    setCards(shuffledDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
  };

  const bestMoves = best !== null ? -best : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="font-body flex items-center gap-4 text-sm text-gray-600">
        <span>Moves: {moves}</span>
        {bestMoves !== null && (
          <span className="flex items-center gap-1 text-gray-500">
            <Trophy size={13} />
            Best: {bestMoves}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.matched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card.id)}
              className="h-16 w-16 [perspective:600px] sm:h-20 sm:w-20"
              aria-label={isFlipped ? card.symbol : "Hidden card"}
            >
              <div
                className="relative h-full w-full rounded-xl transition-transform duration-300 [transform-style:preserve-3d]"
                style={{ transform: isFlipped ? "rotateY(180deg)" : "none" }}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-black/10 bg-[#1A1A1A] [backface-visibility:hidden]">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl border border-black/10 bg-white text-2xl [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {card.symbol}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {won && (
        <p className="font-body text-sm font-medium text-[#2DD4BF]">
          Solved in {moves} moves 🎉
        </p>
      )}

      <button
        type="button"
        onClick={reset}
        className="font-body flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
      >
        <RotateCcw size={14} />
        Shuffle again
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Game 3 — Simon Says                                                       */
/* -------------------------------------------------------------------------- */

const SIMON_PADS = [
  { id: 0, color: "#7C5CE0" },
  { id: 1, color: "#2DD4BF" },
  { id: 2, color: "#DB9F2B" },
  { id: 3, color: "#E0607C" },
];

type SimonState = "idle" | "playing" | "watching" | "input" | "over";

function SimonSays() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [state, setState] = useState<SimonState>("idle");
  const [litPad, setLitPad] = useState<number | null>(null);
  const { best, submit } = useBestScore("portfolio-simon-best-streak");

  const score = Math.max(0, sequence.length - 1);

  const playSequence = useCallback((seq: number[]) => {
    setState("watching");
    seq.forEach((pad, i) => {
      setTimeout(() => {
        setLitPad(pad);
        setTimeout(() => setLitPad(null), 320);
      }, i * 550);
    });
    setTimeout(() => {
      setState("input");
      setPlayerIndex(0);
    }, seq.length * 550);
  }, []);

  const start = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setState("playing");
    playSequence(first);
  };

  const handlePadClick = (padId: number) => {
    if (state !== "input") return;

    if (padId !== sequence[playerIndex]) {
      setState("over");
      submit(score);
      return;
    }

    setLitPad(padId);
    setTimeout(() => setLitPad(null), 200);

    if (playerIndex + 1 === sequence.length) {
      const next = [...sequence, Math.floor(Math.random() * 4)];
      setTimeout(() => {
        setSequence(next);
        playSequence(next);
      }, 400);
    } else {
      setPlayerIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="font-body flex items-center gap-4 text-sm text-gray-600">
        <span>Streak: {score}</span>
        {best !== null && (
          <span className="flex items-center gap-1 text-gray-500">
            <Trophy size={13} />
            Best: {best}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SIMON_PADS.map((pad) => (
          <button
            key={pad.id}
            type="button"
            onClick={() => handlePadClick(pad.id)}
            disabled={state !== "input"}
            className="h-24 w-24 rounded-2xl transition-transform duration-150 disabled:cursor-not-allowed sm:h-28 sm:w-28"
            style={{
              backgroundColor: pad.color,
              opacity: litPad === pad.id ? 1 : 0.35,
              transform: litPad === pad.id ? "scale(0.94)" : "scale(1)",
            }}
            aria-label={`Pad ${pad.id + 1}`}
          />
        ))}
      </div>

      <p className="font-body text-sm text-gray-600">
        {state === "idle" && "Watch the pattern, then repeat it."}
        {state === "watching" && "Watch closely…"}
        {state === "input" && "Your turn."}
        {state === "over" && `Game over — streak of ${score}.`}
      </p>

      <button
        type="button"
        onClick={start}
        className="font-body flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
      >
        <RotateCcw size={14} />
        {state === "idle" ? "Start" : "Restart"}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Individual game opening animation                                         */
/* -------------------------------------------------------------------------- */

function GameOpening({
  game,
  onComplete,
}: {
  game: GameMeta;
  onComplete: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1500);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[320px] flex-col items-center justify-center gap-6"
    >
      <div
        className="relative flex h-36 w-64 items-center justify-center overflow-hidden rounded-3xl border"
        style={{
          borderColor: `${game.accent}45`,
          backgroundColor: `${game.accent}0D`,
        }}
      >
        {game.id === "tic-tac-toe" && (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }, (_, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.07, type: "spring" }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C5CE0]/15 font-elegant text-lg text-[#7C5CE0]"
              >
                {index % 2 === 0 ? "X" : "O"}
              </motion.span>
            ))}
          </div>
        )}

        {game.id === "memory-match" && (
          <div className="flex gap-2">
            {["🌙", "⭐", "🔥"].map((symbol, index) => (
              <motion.div
                key={symbol}
                initial={{ rotateY: 180, y: 25, opacity: 0 }}
                animate={{ rotateY: 0, y: 0, opacity: 1 }}
                transition={{ delay: index * 0.18 }}
                className="flex h-20 w-14 items-center justify-center rounded-xl bg-white text-2xl shadow-md"
              >
                {symbol}
              </motion.div>
            ))}
          </div>
        )}

        {game.id === "simon-says" && (
          <div className="grid grid-cols-2 gap-2">
            {["#7C5CE0", "#2DD4BF", "#DB9F2B", "#E0607C"].map(
              (color, index) => (
                <motion.span
                  key={color}
                  className="h-12 w-12 rounded-xl"
                  style={{ backgroundColor: color }}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{
                    delay: index * 0.16,
                    duration: 0.6,
                    repeat: 1,
                  }}
                />
              )
            )}
          </div>
        )}

        {game.id === "snake" && (
          <motion.div
            animate={{ x: [-65, 65, -65] }}
            transition={{ duration: 1.1, repeat: Infinity }}
            className="flex items-center gap-1"
          >
            {[0, 1, 2, 3, 4].map((item) => (
              <span key={item} className="h-7 w-7 rounded-md bg-[#22A06B]" />
            ))}
            <span className="h-5 w-5 rounded-full bg-[#E0607C]" />
          </motion.div>
        )}

        {game.id === "reaction-test" && (
          <motion.div
            animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="h-24 w-24 rounded-full bg-[#E0607C]"
          />
        )}

        {game.id === "number-merge" && (
          <div className="grid grid-cols-2 gap-2">
            {[2, 4, 8, 16].map((number, index) => (
              <motion.span
                key={number}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.13, type: "spring" }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4385E5]/15 font-elegant text-lg text-[#4385E5]"
              >
                {number}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.35em] text-gray-400">
          Preparing your challenge
        </p>
        <motion.h3
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-elegant mt-2 text-3xl text-[#1A1A1A]"
        >
          {game.title}
        </motion.h3>
        <div className="mt-4 flex justify-center gap-1.5">
          {[0, 1, 2, 3].map((item) => (
            <motion.span
              key={item}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: game.accent }}
              animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                delay: item * 0.12,
                duration: 0.65,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Game 4 — Snake                                                              */
/* -------------------------------------------------------------------------- */

function Snake() {
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setPosition((value) => {
        if (value >= 7) {
          setRunning(false);
          return value;
        }
        return value + 1;
      });
    }, 500);
    return () => window.clearInterval(timer);
  }, [running]);

  const reset = () => {
    setPosition(0);
    setScore((value) => value + 1);
    setRunning(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-body text-sm text-gray-600">
        {running ? "Snake is moving…" : "You reached the end!"}
      </p>
      <div className="flex w-[min(90vw,420px)] items-center justify-center gap-1 rounded-2xl bg-[#F1F5F2] p-6">
        {Array.from({ length: 8 }, (_, index) => (
          <motion.span
            key={index}
            animate={{ scale: index <= position ? 1 : 0.65 }}
            className="h-7 w-7 rounded-md"
            style={{
              backgroundColor:
                index <= position ? "#22A06B" : "rgba(34,160,107,0.12)",
            }}
          />
        ))}
      </div>
      <p className="font-body text-sm text-gray-500">Score: {score}</p>
      <button
        type="button"
        onClick={reset}
        className="font-body rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white"
      >
        Restart
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Game 5 — Reaction Test                                                      */
/* -------------------------------------------------------------------------- */

function ReactionTest() {
  const [state, setState] = useState<"idle" | "ready" | "result">("idle");
  const [startedAt, setStartedAt] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const start = () => {
    setState("idle");
    setResult(null);
    window.setTimeout(() => {
      setStartedAt(performance.now());
      setState("ready");
    }, 1200);
  };

  const clickTarget = () => {
    if (state === "ready") {
      setResult(Math.round(performance.now() - startedAt));
      setState("result");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={clickTarget}
        className={cn(
          "flex h-64 w-64 flex-col items-center justify-center rounded-[2rem] text-center text-white",
          state === "ready" ? "bg-[#22A06B]" : "bg-[#E0607C]"
        )}
      >
        <span className="font-elegant text-2xl">
          {state === "ready"
            ? "CLICK!"
            : result !== null
              ? `${result} ms`
              : "Wait…"}
        </span>
        <span className="font-body mt-2 text-xs text-white/70">
          {state === "ready" ? "Tap now" : "Reaction challenge"}
        </span>
      </button>
      <button
        type="button"
        onClick={start}
        className="font-body rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white"
      >
        Start test
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Game 6 — Number Merge                                                       */
/* -------------------------------------------------------------------------- */

function NumberMerge() {
  const [tiles, setTiles] = useState([2, 4, 8, 16]);
  const [score, setScore] = useState(0);

  const merge = () => {
    const next = tiles.map((value, index) =>
      index === 0 ? value * 2 : value
    );
    setTiles(next);
    setScore((value) => value + 2);
  };

  const reset = () => {
    setTiles([2, 4, 8, 16]);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-body text-sm text-gray-600">Score: {score}</p>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((value, index) => (
          <motion.div
            key={index}
            layout
            className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#4385E5]/10 font-elegant text-2xl text-[#4385E5]"
          >
            {value}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={merge}
          className="font-body rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white"
        >
          Merge
        </button>
        <button
          type="button"
          onClick={reset}
          className="font-body rounded-full border border-black/10 px-5 py-2.5 text-[13px] font-medium text-gray-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default GamesSection;