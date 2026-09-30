
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

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
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

function useBestScore(key: string) {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);

      if (saved !== null) {
        setBest(Number(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, [key]);

  const submit = useCallback(
    (value: number) => {
      setBest((previous) => {
        const next =
          previous === null ? value : Math.max(previous, value);

        try {
          window.localStorage.setItem(key, String(next));
        } catch {
          // Ignore storage errors
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
  icon: ReactNode;
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
    tagline: "Flip pairs, clear the board, and beat your move count.",
    icon: <Brain size={20} strokeWidth={1.75} />,
    accent: "#2DD4BF",
  },
  {
    id: "simon-says",
    title: "Simon Says",
    tagline: "Watch the pattern and repeat it back.",
    icon: <Sparkles size={20} strokeWidth={1.75} />,
    accent: "#DB9F2B",
  },
  {
    id: "snake",
    title: "Snake",
    tagline: "Collect food and grow your snake.",
    icon: <Grid3x3 size={20} strokeWidth={1.75} />,
    accent: "#22A06B",
  },
  {
    id: "reaction-test",
    title: "Reaction Test",
    tagline: "Wait for green and click as quickly as possible.",
    icon: <Sparkles size={20} strokeWidth={1.75} />,
    accent: "#E0607C",
  },
  {
    id: "number-merge",
    title: "Number Merge",
    tagline: "Merge matching tiles and build bigger numbers.",
    icon: <Trophy size={20} strokeWidth={1.75} />,
    accent: "#4385E5",
  },
];

/* -------------------------------------------------------------------------- */
/* Main section                                                               */
/* -------------------------------------------------------------------------- */

export function GamesSection() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const activeMeta = useMemo(
    () => GAMES.find((game) => game.id === activeGame) ?? null,
    [activeGame]
  );

  useEffect(() => {
    document.body.style.overflow = activeGame ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeGame]);

  useEffect(() => {
    if (!activeGame) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveGame(null);
        setIsLaunching(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeGame]);

  const closeGame = () => {
    setActiveGame(null);
    setIsLaunching(false);
  };

  return (
    <section
      id="fun"
      className="relative bg-[#FAFAF8] px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <p className="font-body mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gray-500">
          Off the clock
        </p>

        <h2 className="font-elegant text-4xl text-[#1A1A1A] sm:text-5xl">
          A little{" "}
          <span className="font-elegant-italic text-[#7C5CE0]">
            fun
          </span>
          , if you have a minute
        </h2>

        <p className="font-body mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Six quick games I built while procrastinating on this
          portfolio. Pick one and enjoy a quick challenge.
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-white"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeMeta.title} game`}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 sm:px-10">
              <button
                type="button"
                onClick={closeGame}
                className="font-body flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-black/[0.03]"
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
                <GameOpening
                  game={activeMeta}
                  onComplete={() => setIsLaunching(false)}
                />
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
/* Game 1: Tic Tac Toe                                                       */
/* -------------------------------------------------------------------------- */

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Cell[]): {
  winner: Cell;
  line: number[] | null;
} {
  for (const line of LINES) {
    const [a, b, c] = line;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return {
        winner: board[a],
        line,
      };
    }
  }

  return {
    winner: null,
    line: null,
  };
}

function minimax(
  board: Cell[],
  player: "X" | "O"
): {
  score: number;
  move: number | null;
} {
  const { winner } = getWinner(board);

  if (winner === "O") return { score: 1, move: null };
  if (winner === "X") return { score: -1, move: null };

  if (board.every((cell) => cell !== null)) {
    return { score: 0, move: null };
  }

  const emptyCells = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  let bestScore = player === "O" ? -Infinity : Infinity;
  let bestMove: number | null = null;

  for (const index of emptyCells) {
    const nextBoard = [...board];
    nextBoard[index] = player;

    const result = minimax(
      nextBoard,
      player === "O" ? "X" : "O"
    );

    if (
      player === "O"
        ? result.score > bestScore
        : result.score < bestScore
    ) {
      bestScore = result.score;
      bestMove = index;
    }
  }

  return {
    score: bestScore,
    move: bestMove,
  };
}

function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");

  const [record, setRecord] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
  });

  const botTimerRef = useRef<number | null>(null);
  const recorded = useRef(false);

  const { winner, line } = getWinner(board);

  const isDraw =
    !winner && board.every((cell) => cell !== null);

  const gameOver = Boolean(winner) || isDraw;

  useEffect(() => {
    if (turn !== "O" || gameOver) return;

    botTimerRef.current = window.setTimeout(() => {
      const { move } = minimax(board, "O");

      if (move !== null) {
        setBoard((previousBoard) => {
          const nextBoard = [...previousBoard];
          nextBoard[move] = "O";
          return nextBoard;
        });

        setTurn("X");
      }
    }, 450);

    return () => {
      if (botTimerRef.current !== null) {
        window.clearTimeout(botTimerRef.current);
      }
    };
  }, [turn, board, gameOver]);

  useEffect(() => {
    if (!gameOver) {
      recorded.current = false;
      return;
    }

    if (recorded.current) return;

    recorded.current = true;

    setRecord((previousRecord) => ({
      wins: previousRecord.wins + (winner === "X" ? 1 : 0),
      losses: previousRecord.losses + (winner === "O" ? 1 : 0),
      draws: previousRecord.draws + (isDraw ? 1 : 0),
    }));
  }, [gameOver, winner, isDraw]);

  const handleCellClick = (index: number) => {
    if (board[index] || turn !== "X" || gameOver) return;

    setBoard((previousBoard) => {
      const nextBoard = [...previousBoard];
      nextBoard[index] = "X";
      return nextBoard;
    });

    setTurn("O");
  };

  const reset = () => {
    if (botTimerRef.current !== null) {
      window.clearTimeout(botTimerRef.current);
    }

    setBoard(Array(9).fill(null));
    setTurn("X");
    recorded.current = false;
  };

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
      <p className="font-body text-sm text-gray-600">
        {status}
      </p>

      <div className="grid grid-cols-3 gap-2.5">
        {board.map((cell, index) => {
          const isWinningCell = line?.includes(index);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleCellClick(index)}
              disabled={
                Boolean(cell) ||
                turn !== "X" ||
                gameOver
              }
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
        <span>·</span>
        <span>Losses {record.losses}</span>
        <span>·</span>
        <span>Draws {record.draws}</span>
      </div>

      <button
        type="button"
        onClick={reset}
        className="font-body flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
      >
        <RotateCcw size={14} />
        New game
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Game 2: Memory Match                                                       */
/* -------------------------------------------------------------------------- */

const MEMORY_SYMBOLS = [
  "🌱",
  "⚡",
  "🌙",
  "🔥",
  "🍀",
  "⭐",
];

type MemoryCard = {
  id: number;
  symbol: string;
  matched: boolean;
};

function shuffledDeck(): MemoryCard[] {
  const deck = [
    ...MEMORY_SYMBOLS,
    ...MEMORY_SYMBOLS,
  ].map((symbol, index) => ({
    id: index,
    symbol,
    matched: false,
  }));

  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[randomIndex]] = [
      deck[randomIndex],
      deck[i],
    ];
  }

  return deck;
}

function MemoryMatch() {
  const [cards, setCards] = useState<MemoryCard[]>(() =>
    shuffledDeck()
  );

  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [bestMoves, setBestMoves] = useState<number | null>(null);

  const won = cards.every((card) => card.matched);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        "portfolio-memory-best-moves"
      );

      if (saved !== null) {
        setBestMoves(Number(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (!won || moves === 0) return;

    setBestMoves((previousBest) => {
      const nextBest =
        previousBest === null
          ? moves
          : Math.min(previousBest, moves);

      try {
        window.localStorage.setItem(
          "portfolio-memory-best-moves",
          String(nextBest)
        );
      } catch {
        // Ignore storage errors
      }

      return nextBest;
    });
  }, [won, moves]);

  const handleFlip = (id: number) => {
    if (locked || flipped.includes(id)) return;

    const card = cards.find((item) => item.id === id);

    if (!card || card.matched) return;

    const nextFlipped = [...flipped, id];

    setFlipped(nextFlipped);

    if (nextFlipped.length !== 2) return;

    setLocked(true);
    setMoves((value) => value + 1);

    const [firstId, secondId] = nextFlipped;

    const first = cards.find((item) => item.id === firstId);
    const second = cards.find((item) => item.id === secondId);

    if (first && second && first.symbol === second.symbol) {
      setTimeout(() => {
        setCards((previousCards) =>
          previousCards.map((item) =>
            item.id === firstId || item.id === secondId
              ? { ...item, matched: true }
              : item
          )
        );

        setFlipped([]);
        setLocked(false);
      }, 400);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, 800);
    }
  };

  const reset = () => {
    setCards(shuffledDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
  };

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
          const isFlipped =
            flipped.includes(card.id) || card.matched;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card.id)}
              className="h-16 w-16 [perspective:600px] sm:h-20 sm:w-20"
              aria-label={
                isFlipped ? card.symbol : "Hidden card"
              }
            >
              <div
                className="relative h-full w-full rounded-xl transition-transform duration-300 [transform-style:preserve-3d]"
                style={{
                  transform: isFlipped
                    ? "rotateY(180deg)"
                    : "none",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-black/10 bg-[#1A1A1A] [backface-visibility:hidden]">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl border border-black/10 bg-white text-2xl [backface-visibility:hidden]"
                  style={{
                    transform: "rotateY(180deg)",
                  }}
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
        className="font-body flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
      >
        <RotateCcw size={14} />
        Shuffle again
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Game 3: Simon Says                                                         */
/* -------------------------------------------------------------------------- */

const SIMON_PADS = [
  { id: 0, color: "#7C5CE0" },
  { id: 1, color: "#2DD4BF" },
  { id: 2, color: "#DB9F2B" },
  { id: 3, color: "#E0607C" },
];

type SimonState =
  | "idle"
  | "watching"
  | "input"
  | "over";

function SimonSays() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [state, setState] = useState<SimonState>("idle");
  const [litPad, setLitPad] = useState<number | null>(null);

  const { best, submit } = useBestScore(
    "portfolio-simon-best-streak"
  );

  const timersRef = useRef<number[]>([]);

  const score = Math.max(0, sequence.length - 1);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });

    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const playSequence = useCallback((nextSequence: number[]) => {
    clearTimers();

    setState("watching");
    setLitPad(null);

    nextSequence.forEach((pad, index) => {
      const lightTimer = window.setTimeout(() => {
        setLitPad(pad);

        const offTimer = window.setTimeout(() => {
          setLitPad(null);
        }, 320);

        timersRef.current.push(offTimer);
      }, index * 550);

      timersRef.current.push(lightTimer);
    });

    const inputTimer = window.setTimeout(() => {
      setState("input");
      setPlayerIndex(0);
    }, nextSequence.length * 550);

    timersRef.current.push(inputTimer);
  }, []);

  const start = () => {
    clearTimers();

    const firstSequence = [
      Math.floor(Math.random() * 4),
    ];

    setSequence(firstSequence);
    setPlayerIndex(0);
    setState("watching");

    playSequence(firstSequence);
  };

  const handlePadClick = (padId: number) => {
    if (state !== "input") return;

    if (padId !== sequence[playerIndex]) {
      setState("over");
      submit(score);
      return;
    }

    setLitPad(padId);

    const lightTimer = window.setTimeout(() => {
      setLitPad(null);
    }, 200);

    timersRef.current.push(lightTimer);

    if (playerIndex + 1 === sequence.length) {
      const nextSequence = [
        ...sequence,
        Math.floor(Math.random() * 4),
      ];

      const nextTimer = window.setTimeout(() => {
        setSequence(nextSequence);
        playSequence(nextSequence);
      }, 400);

      timersRef.current.push(nextTimer);
    } else {
      setPlayerIndex((value) => value + 1);
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
            aria-label={`Pad ${pad.id + 1}`}
            className="h-24 w-24 rounded-2xl transition-transform duration-150 disabled:cursor-not-allowed sm:h-28 sm:w-28"
            style={{
              backgroundColor: pad.color,
              opacity: litPad === pad.id ? 1 : 0.35,
              transform:
                litPad === pad.id
                  ? "scale(0.94)"
                  : "scale(1)",
            }}
          />
        ))}
      </div>

      <p className="font-body text-sm text-gray-600">
        {state === "idle" && "Watch the pattern, then repeat it."}
        {state === "watching" && "Watch closely…"}
        {state === "input" && "Your turn."}
        {state === "over" &&
          `Game over — streak of ${score}.`}
      </p>

      <button
        type="button"
        onClick={start}
        className="font-body flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
      >
        <RotateCcw size={14} />
        {state === "idle" ? "Start" : "Restart"}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared opening animation                                                   */
/* -------------------------------------------------------------------------- */

function GameOpening({
  game,
  onComplete,
}: {
  game: GameMeta;
  onComplete: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1600);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  const accent = game.accent;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      className="flex min-h-[340px] flex-col items-center justify-center gap-7"
    >
      <div
        className="relative flex h-44 w-72 items-center justify-center overflow-hidden rounded-[2rem] border"
        style={{
          borderColor: `${accent}40`,
          backgroundColor: `${accent}0D`,
        }}
      >
        <motion.div
          className="absolute h-40 w-40 rounded-full border"
          style={{ borderColor: `${accent}55` }}
          animate={{
            scale: [0.7, 1.25],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
          }}
        />

        {game.id === "tic-tac-toe" && (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }, (_, index) => (
              <motion.span
                key={index}
                initial={{
                  scale: 0,
                  rotate: -90,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  delay: index * 0.07,
                  type: "spring",
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C5CE0]/15 font-elegant text-xl text-[#7C5CE0]"
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
                initial={{
                  rotateY: 180,
                  y: 24,
                  opacity: 0,
                }}
                animate={{
                  rotateY: 0,
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: index * 0.18,
                }}
                className="flex h-24 w-16 items-center justify-center rounded-xl bg-white text-3xl shadow-md"
              >
                {symbol}
              </motion.div>
            ))}
          </div>
        )}

        {game.id === "simon-says" && (
          <div className="grid grid-cols-2 gap-3">
            {SIMON_PADS.map((pad, index) => (
              <motion.span
                key={pad.id}
                className="h-14 w-14 rounded-xl"
                style={{ backgroundColor: pad.color }}
                animate={{
                  opacity: [0.25, 1, 0.25],
                  scale: [1, 0.92, 1],
                }}
                transition={{
                  delay: index * 0.14,
                  duration: 0.6,
                  repeat: 1,
                }}
              />
            ))}
          </div>
        )}

        {game.id === "snake" && (
          <motion.div
            animate={{ x: [-70, 70, -70] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center gap-1"
          >
            {[0, 1, 2, 3, 4].map((item) => (
              <span
                key={item}
                className="h-8 w-8 rounded-md bg-[#22A06B]"
              />
            ))}

            <span className="h-5 w-5 rounded-full bg-[#E0607C]" />
          </motion.div>
        )}

        {game.id === "reaction-test" && (
          <motion.div
            animate={{
              scale: [0.65, 1.15, 0.65],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
            }}
            className="h-28 w-28 rounded-full bg-[#E0607C] shadow-[0_0_60px_rgba(224,96,124,0.45)]"
          />
        )}

        {game.id === "number-merge" && (
          <div className="grid grid-cols-2 gap-2">
            {[2, 4, 8, 16].map((number, index) => (
              <motion.span
                key={number}
                initial={{
                  scale: 0,
                  rotate: -12,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  delay: index * 0.12,
                  type: "spring",
                }}
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4385E5]/15 font-elegant text-xl text-[#4385E5]"
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
          initial={{
            y: 12,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          className="font-elegant mt-2 text-3xl text-[#1A1A1A]"
        >
          {game.title}
        </motion.h3>

        <div className="mt-4 flex justify-center gap-1.5">
          {[0, 1, 2, 3].map((item) => (
            <motion.span
              key={item}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accent }}
              animate={{
                y: [0, -5, 0],
                opacity: [0.3, 1, 0.3],
              }}
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
/* Game 4: Snake                                                              */
/* -------------------------------------------------------------------------- */

function Snake() {
  const [length, setLength] = useState(3);
  const [score, setScore] = useState(0);

  const eatFood = () => {
    if (length >= 8) return;

    setLength((value) => value + 1);
    setScore((value) => value + 10);
  };

  const reset = () => {
    setLength(3);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-body text-sm text-gray-600">
        Score: {score}
      </p>

      <div className="flex w-[min(90vw,460px)] items-center justify-center gap-1 rounded-2xl bg-[#F1F5F2] p-8">
        {Array.from({ length: 8 }, (_, index) => (
          <motion.span
            key={index}
            animate={{
              scale: index < length ? 1 : 0.65,
            }}
            className="h-8 w-8 rounded-md"
            style={{
              backgroundColor:
                index < length
                  ? "#22A06B"
                  : "#22A06B20",
            }}
          />
        ))}
      </div>

      <p className="font-body text-xs text-gray-500">
        Collect food to grow your snake.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={eatFood}
          className="font-body rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white"
        >
          Eat food
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

/* -------------------------------------------------------------------------- */
/* Game 5: Reaction Test                                                      */
/* -------------------------------------------------------------------------- */

type ReactionState =
  | "idle"
  | "waiting"
  | "ready"
  | "result"
  | "tooSoon";

function ReactionTest() {
  const [state, setState] = useState<ReactionState>("idle");
  const [startedAt, setStartedAt] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const start = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    setResult(null);
    setState("waiting");

    const delay = 1000 + Math.floor(Math.random() * 2200);

    timerRef.current = window.setTimeout(() => {
      setStartedAt(performance.now());
      setState("ready");
    }, delay);
  };

  const clickTarget = () => {
    if (state === "waiting") {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      setState("tooSoon");
      return;
    }

    if (state === "ready") {
      setResult(
        Math.round(performance.now() - startedAt)
      );

      setState("result");
    }
  };

  const label =
    state === "ready"
      ? "CLICK!"
      : state === "result"
        ? `${result} ms`
        : state === "tooSoon"
          ? "Too soon"
          : state === "waiting"
            ? "Wait…"
            : "Start";

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={clickTarget}
        className={cn(
          "flex h-64 w-64 flex-col items-center justify-center rounded-[2rem] text-center text-white transition-colors",
          state === "ready"
            ? "bg-[#22A06B]"
            : "bg-[#E0607C]"
        )}
      >
        <span className="font-elegant text-2xl">
          {label}
        </span>

        <span className="font-body mt-2 text-xs text-white/75">
          {state === "ready"
            ? "Tap now"
            : "Reaction challenge"}
        </span>
      </button>

      <button
        type="button"
        onClick={start}
        className="font-body rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-medium text-white"
      >
        {state === "idle" ? "Start test" : "Try again"}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Game 6: Number Merge                                                       */
/* -------------------------------------------------------------------------- */

function NumberMerge() {
  const [tiles, setTiles] = useState([2, 2, 4, 8]);
  const [score, setScore] = useState(0);

  const merge = () => {
    setTiles((current) => {
      const next = [...current];

      for (let i = 0; i < next.length - 1; i++) {
        if (
          next[i] !== 0 &&
          next[i] === next[i + 1]
        ) {
          const mergedValue = next[i] * 2;

          next[i] = mergedValue;
          next[i + 1] = 0;

          setScore((value) => value + mergedValue);

          break;
        }
      }

      return next;
    });
  };

  const reset = () => {
    setTiles([2, 2, 4, 8]);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-body text-sm text-gray-600">
        Score: {score}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((value, index) => (
          <motion.div
            key={index}
            layout
            className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#4385E5]/10 font-elegant text-2xl text-[#4385E5]"
          >
            {value === 0 ? "" : value}
          </motion.div>
        ))}
      </div>

      <p className="font-body max-w-xs text-center text-xs text-gray-500">
        Merge matching tiles to increase your score.
      </p>

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