import type { GameMode } from "./types";

type GameSummaryProps = {
  result: string;
  gameMode: GameMode;
  totalMoves: number;
  compoundLevel: number;
  missionRating: string;
};

export default function GameSummary({
  result,
  gameMode,
  totalMoves,
  compoundLevel,
  missionRating,
}: GameSummaryProps) {
  return (
    <div
      className="v-pulse"
      style={{
        marginBottom: "18px",
        padding: "16px",
        borderRadius: "4px",
        background: "rgba(255, 203, 5, 0.12)",
        border: "2px solid rgba(255, 203, 5, 0.65)",
        boxShadow: "0 0 30px rgba(255, 203, 5, 0.18)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "4px 10px",
          marginBottom: "10px",
          background: "#ffcb05",
          color: "#111",
          fontSize: "11px",
          fontWeight: 900,
          transform: "skew(-10deg)",
        }}
      >
        MISSION COMPLETE
      </div>

      <h3
        style={{
          color: "#ffcb05",
          textTransform: "uppercase",
          marginBottom: "10px",
          fontSize: "24px",
          textShadow: "2px 2px 0 #050505",
        }}
      >
        Game Summary
      </h3>

      <div
        style={{
          display: "grid",
          gap: "8px",
          fontFamily: "Arial, sans-serif",
          color: "#f5f0df",
          lineHeight: 1.4,
        }}
      >
        <p>
          <strong style={{ color: "#ffcb05" }}>Result:</strong> {result}
        </p>

        <p>
          <strong style={{ color: "#ffcb05" }}>Mode:</strong>{" "}
          {gameMode === "ai" ? "Vs AI" : "Local Duel"}
        </p>

        <p>
          <strong style={{ color: "#ffcb05" }}>Total moves:</strong>{" "}
          {totalMoves}
        </p>

        <p>
          <strong style={{ color: "#ffcb05" }}>Compound V left:</strong>{" "}
          {compoundLevel}%
        </p>

        <p>
          <strong style={{ color: "#ffcb05" }}>Mission rating:</strong>{" "}
          {missionRating}
        </p>
      </div>
    </div>
  );
}