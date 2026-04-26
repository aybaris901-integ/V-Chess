import { Chess, Move, Square } from "chess.js";
import { pieceValues } from "./constants";

export function getSquare(rowIndex: number, colIndex: number): Square {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const rank = 8 - rowIndex;

  return `${files[colIndex]}${rank}` as Square;
}

export function getStatus(chess: Chess) {
  if (chess.isCheckmate()) {
    return chess.turn() === "w"
      ? "Checkmate. Black wins."
      : "Checkmate. White wins.";
  }

  if (chess.isStalemate()) return "Stalemate. Draw.";
  if (chess.isDraw()) return "Draw.";

  if (chess.isCheck()) {
    return chess.turn() === "w"
      ? "White is in check. White to move."
      : "Black is in check. Black to move.";
  }

  return chess.turn() === "w" ? "White to move" : "Black to move";
}

export function getGameResult(chess: Chess) {
  if (chess.isCheckmate()) {
    return chess.turn() === "w"
      ? "Black wins by checkmate"
      : "White wins by checkmate";
  }

  if (chess.isStalemate()) return "Stalemate";
  if (chess.isDraw()) return "Draw";
  if (chess.isCheck()) return "Check";

  return "Game in progress";
}

export function getMissionRating(
  chess: Chess,
  moveCount: number,
  compoundLevel: number
) {
  if (chess.isCheckmate() && compoundLevel >= 60) {
    return "V-Powered Domination";
  }

  if (chess.isCheckmate() && compoundLevel >= 30) {
    return "Tactical Survivor";
  }

  if (chess.isDraw()) {
    return "Strategic Deadlock";
  }

  if (moveCount >= 40) {
    return "Long War Veteran";
  }

  if (compoundLevel <= 10) {
    return "Out of Serum";
  }

  return "Mission Complete";
}

export function evaluateMove(move: Move) {
  let score = 0;

  if (move.captured) {
    score += pieceValues[move.captured] * 10;
  }

  if (move.promotion) {
    score += pieceValues[move.promotion] * 8;
  }

  if (move.san.includes("+")) score += 3;
  if (move.san.includes("#")) score += 1000;

  return score;
}

export function getBestSimpleMove(chess: Chess): Move | null {
  const moves = chess.moves({ verbose: true }) as Move[];

  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const score = evaluateMove(move) + Math.random();

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

export function isSquareAttackedByBlack(chess: Chess, square: Square) {
  return (chess as any).isAttacked(square, "b");
