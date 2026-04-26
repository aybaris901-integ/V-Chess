import type { Square } from "chess.js";

export type GameMode = "ai" | "local";

export type AbilityFlash = "inject" | "threat" | "shield" | null;

export type PendingMove = {
  from: Square;
  to: Square;
} | null;

export type LastMove = {
  from: Square;
  to: Square;
} | null;

export type SavedGameData = {
  fen?: string;
  message?: string;
  compoundLevel?: number;
  gameMode?: GameMode;
  moveHistory?: string[];
};