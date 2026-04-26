import type { Square } from "chess.js";

export type GameMode = "ai" | "local";

export type LastMove = {
  from: Square;
  to: Square;
};

export type PendingMove = {
  from: Square;
  to: Square;
};

export type SavedGameData = {
  fen: string;
  message: string;
  compoundLevel: number;
  gameMode: GameMode;
  moveHistory?: string[];
};