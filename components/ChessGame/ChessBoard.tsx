import type { Square } from "chess.js";
import { pieceSymbols } from "./constants";
import { getSquare } from "./helpers";
import type { LastMove } from "./types";

type ChessBoardProps = {
  board: ReturnType<import("chess.js").Chess["board"]>;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: LastMove;
  onSquareClick: (square: Square) => void;
};

export default function ChessBoard({
  board,
  selectedSquare,
  legalMoves,
  lastMove,
  onSquareClick,
}: ChessBoardProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "min(88vw, 580px)",
        height: "min(88vw, 580px)",
        margin: "0 auto",
        padding: "10px",
        borderRadius: "28px",
        background:
          "linear-gradient(135deg, rgba(255,203,5,0.9), rgba(172,24,32,0.85), rgba(5,5,5,0.95))",
        boxShadow:
          "0 36px 100px rgba(0,0,0,0.78), 0 0 70px rgba(172,24,32,0.2)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          border: "4px solid rgba(5,5,5,0.95)",
          borderRadius: "20px",
          background: "#050505",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const square = getSquare(rowIndex, colIndex);
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            const isLastMove =
              lastMove?.from === square || lastMove?.to === square;

            return (
              <button
                key={square}
                onClick={() => onSquareClick(square)}
                className="chess-square"
                style={{
                  border: "1px solid rgba(0,0,0,0.24)",
                  cursor: "pointer",
                  fontSize: "clamp(34px, 7vw, 58px)",
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontWeight: 700,
                  background: isSelected
                    ? "linear-gradient(135deg, #ffcb05, #f97316)"
                    : isLegalMove
                    ? `radial-gradient(circle, #ffcb05 0%, #ffcb05 13%, transparent 16%), ${
                        isLight ? "#d8c59a" : "#6f1118"
                      }`
                    : isLastMove
                    ? `linear-gradient(135deg, rgba(255,203,5,0.44), rgba(255,203,5,0.08)), ${
                        isLight ? "#d8c59a" : "#6f1118"
                      }`
                    : isLight
                    ? "#d8c59a"
                    : "#6f1118",
                  color: piece?.color === "w" ? "#fff8df" : "#050505",
                  textShadow:
                    piece?.color === "w"
                      ? "0 2px 2px #050505, 0 0 16px rgba(255,203,5,0.38)"
                      : "0 1px 1px #ffcb05, 0 0 10px rgba(0,0,0,0.24)",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  margin: 0,
                  lineHeight: 1,
                  boxSizing: "border-box",
                  appearance: "none",
                  WebkitAppearance: "none",
                  boxShadow: isSelected
                    ? "inset 0 0 0 4px rgba(5,5,5,0.55), inset 0 0 30px rgba(255,203,5,0.45)"
                    : isLastMove
                    ? "inset 0 0 0 3px rgba(255,203,5,0.45), inset 0 0 24px rgba(255,203,5,0.22)"
                    : "none",
                  transition:
                    "transform 0.08s ease, filter 0.08s ease, background 0.08s ease, box-shadow 0.08s ease",
                }}
              >
                {piece ? pieceSymbols[`${piece.color}${piece.type}`] : ""}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}