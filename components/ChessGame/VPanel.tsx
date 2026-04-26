import type { GameMode } from "./types";
import GameSummary from "./GameSummary";

type VPanelProps = {
  gameMode: GameMode;
  aiThinking: boolean;
  isGameFinished: boolean;
  result: string;
  totalMoves: number;
  compoundLevel: number;
  missionRating: string;
  injectAnimating: boolean;
  threatScanning: boolean;
  blunderWarning: string | null;
  aiHint: string | null;
  threats: string[];
  moveHistory: string[];
  onChangeGameMode: (mode: GameMode) => void;
  onInjectV: () => void;
  onThreatVision: () => void;
  onOpenProModal: () => void;
};

export default function VPanel({
  gameMode,
  aiThinking,
  isGameFinished,
  result,
  totalMoves,
  compoundLevel,
  missionRating,
  injectAnimating,
  threatScanning,
  blunderWarning,
  aiHint,
  threats,
  moveHistory,
  onChangeGameMode,
  onInjectV,
  onThreatVision,
  onOpenProModal,
}: VPanelProps) {
  return (
    <aside
      className="glass-card"
      style={{
        borderRadius: "24px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "-34px",
          transform: "rotate(38deg)",
          background: "#ffcb05",
          color: "#111",
          padding: "6px 44px",
          fontSize: "10px",
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Top Secret
      </div>

      <h2
        style={{
          fontSize: "34px",
          marginBottom: "8px",
          color: "#ffcb05",
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
          textShadow: "0 0 26px rgba(255,203,5,0.18)",
        }}
      >
        V-Panel
      </h2>

      <p
        style={{
          color: "#d6c99c",
          marginBottom: "18px",
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.5,
        }}
      >
        Live tactical HUD. Monitor energy, mode, AI status and activated
        protocols.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <InfoCard title="Mode" value={gameMode === "ai" ? "Vs AI" : "Local Duel"} />

        <div
          style={{
            padding: "13px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255, 203, 5, 0.18)",
          }}
        >
          <div
            style={{
              color: "#b8aa82",
              fontSize: "11px",
              textTransform: "uppercase",
              fontWeight: 800,
              marginBottom: "6px",
            }}
          >
            AI Status
          </div>
          <div
            className={aiThinking ? "blink-text" : ""}
            style={{
              color: aiThinking ? "#ffcb05" : "#f8f1d8",
              fontWeight: 900,
              textTransform: "uppercase",
              fontSize: "15px",
            }}
          >
            {aiThinking ? "Thinking" : "Ready"}
          </div>
        </div>
      </div>

      {isGameFinished && (
        <GameSummary
          result={result}
          gameMode={gameMode}
          totalMoves={totalMoves}
          compoundLevel={compoundLevel}
          missionRating={missionRating}
        />
      )}

      <div
        style={{
          marginBottom: "18px",
          padding: "15px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255, 203, 5, 0.18)",
        }}
      >
        <strong style={{ color: "#ffcb05", textTransform: "uppercase" }}>
          Mission Mode
        </strong>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "12px",
          }}
        >
          <ModeButton
            active={gameMode === "ai"}
            onClick={() => onChangeGameMode("ai")}
          >
            Vs AI
          </ModeButton>

          <ModeButton
            active={gameMode === "local"}
            onClick={() => onChangeGameMode("local")}
          >
            Local Duel
          </ModeButton>
        </div>
      </div>

      <CompoundBar compoundLevel={compoundLevel} />

      <div style={{ display: "grid", gap: "12px", marginBottom: "22px" }}>
        <button
          onClick={onInjectV}
          disabled={compoundLevel < 35}
          className={`modern-button ${injectAnimating ? "v-pulse" : ""}`}
          style={{
            padding: "15px 16px",
            borderRadius: "18px",
            border: "1px solid rgba(255, 203, 5, 0.85)",
            cursor: compoundLevel < 35 ? "not-allowed" : "pointer",
            fontWeight: 900,
            background: "linear-gradient(135deg, #ffcb05 0%, #f59e0b 100%)",
            color: "#111",
            textTransform: "uppercase",
            boxShadow: "0 16px 38px rgba(255, 203, 5, 0.18)",
            letterSpacing: "0.04em",
            opacity: compoundLevel < 35 ? 0.45 : 1,
            textAlign: "left",
          }}
        >
          <span style={{ display: "block", fontSize: "15px" }}>
            Inject V — Best Move
          </span>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              marginTop: "4px",
              opacity: 0.72,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Cost: 35% / Tactical recommendation
          </span>
        </button>

        <button
          onClick={onThreatVision}
          disabled={compoundLevel < 20}
          className={`modern-button ${threatScanning ? "v-pulse" : ""}`}
          style={{
            padding: "15px 16px",
            borderRadius: "18px",
            border: "1px solid rgba(255, 203, 5, 0.5)",
            cursor: compoundLevel < 20 ? "not-allowed" : "pointer",
            fontWeight: 900,
            background: "rgba(0,0,0,0.35)",
            color: "#ffcb05",
            textTransform: "uppercase",
            boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
            letterSpacing: "0.04em",
            opacity: compoundLevel < 20 ? 0.45 : 1,
            textAlign: "left",
          }}
        >
          <span style={{ display: "block", fontSize: "15px" }}>
            Threat Vision
          </span>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              marginTop: "4px",
              opacity: 0.72,
              fontFamily: "'Inter', sans-serif",
              textTransform: "none",
            }}
          >
            Cost: 20% / Scan exposed pieces
          </span>
        </button>
      </div>

      {blunderWarning && (
        <AlertBox
          className="danger-shake"
          title="Blunder Shield:"
          color="#fecaca"
          border="rgba(239, 68, 68, 0.4)"
          background="rgba(239, 68, 68, 0.13)"
        >
          <p
            style={{
              marginTop: "8px",
              color: "#fecaca",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.45,
            }}
          >
            {blunderWarning}
          </p>
          <p
            style={{
              marginTop: "8px",
              color: "#fca5a5",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Click the same target square again to confirm the risky move.
          </p>
        </AlertBox>
      )}

      {aiHint && (
        <AlertBox
          className={injectAnimating ? "v-pulse" : ""}
          title="AI Serum:"
          color="#ffcb05"
          border="rgba(255, 203, 5, 0.36)"
          background="rgba(255, 203, 5, 0.08)"
        >
          <p
            style={{
              marginTop: "8px",
              color: "#fff5c7",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.45,
            }}
          >
            {aiHint}
          </p>
        </AlertBox>
      )}

      {threats.length > 0 && (
        <div
          className={threatScanning ? "scan-card" : ""}
          style={{
            padding: "15px",
            borderRadius: "18px",
            background: "rgba(172, 24, 32, 0.15)",
            border: "1px solid rgba(255, 203, 5, 0.28)",
            marginBottom: "16px",
          }}
        >
          <strong style={{ color: "#ffcb05", textTransform: "uppercase" }}>
            Threat Scan:
          </strong>
          <ul
            style={{
              marginTop: "8px",
              paddingLeft: "18px",
              color: "#f8f1d8",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.55,
            }}
          >
            {threats.map((threat, index) => (
              <li key={index}>{threat}</li>
            ))}
          </ul>
        </div>
      )}

      <BattleLog moveHistory={moveHistory} />

      <button
        onClick={onOpenProModal}
        className="modern-button"
        style={{
          width: "100%",
          marginTop: "18px",
          padding: "16px",
          borderRadius: "18px",
          background:
            "linear-gradient(135deg, rgba(172, 24, 32, 0.24), rgba(255, 203, 5, 0.08))",
          border: "1px solid rgba(255, 203, 5, 0.3)",
          cursor: "pointer",
          textAlign: "left",
          boxShadow: "0 16px 44px rgba(0,0,0,0.28)",
        }}
      >
        <strong style={{ color: "#ffcb05", textTransform: "uppercase" }}>
          Upgrade to V-Pro
        </strong>
        <p
          style={{
            marginTop: "8px",
            color: "#f8f1d8",
            fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.5,
          }}
        >
          Unlock stronger AI powers, deeper analysis, and custom board skins.
        </p>
      </button>
    </aside>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        padding: "13px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255, 203, 5, 0.18)",
      }}
    >
      <div
        style={{
          color: "#b8aa82",
          fontSize: "11px",
          textTransform: "uppercase",
          fontWeight: 800,
          marginBottom: "6px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "#ffcb05",
          fontWeight: 900,
          textTransform: "uppercase",
          fontSize: "15px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="modern-button"
      style={{
        padding: "12px 10px",
        borderRadius: "14px",
        border: "1px solid rgba(255, 203, 5, 0.75)",
        cursor: "pointer",
        fontWeight: 900,
        background: active
          ? "linear-gradient(135deg, #ffcb05, #f59e0b)"
          : "rgba(0,0,0,0.35)",
        color: active ? "#111" : "#ffcb05",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </button>
  );
}

function CompoundBar({ compoundLevel }: { compoundLevel: number }) {
  return (
    <div
      style={{
        marginBottom: "18px",
        padding: "16px",
        borderRadius: "20px",
        background:
          "linear-gradient(135deg, rgba(255, 203, 5, 0.12), rgba(172, 24, 32, 0.14))",
        border: "1px solid rgba(255, 203, 5, 0.34)",
        color: "#fff5c7",
        fontWeight: 900,
        textTransform: "uppercase",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "center",
          marginBottom: "9px",
        }}
      >
        <span>Compound V</span>
        <span style={{ color: "#ffcb05", fontSize: "22px" }}>
          {compoundLevel}%
        </span>
      </div>

      <div
        style={{
          height: "12px",
          width: "100%",
          background: "rgba(0,0,0,0.45)",
          border: "1px solid rgba(255, 203, 5, 0.28)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${compoundLevel}%`,
            background:
              compoundLevel > 50
                ? "linear-gradient(90deg, #ffcb05, #f59e0b)"
                : compoundLevel > 20
                ? "linear-gradient(90deg, #f97316, #fb923c)"
                : "linear-gradient(90deg, #ef4444, #f87171)",
            transition: "width 0.35s ease",
          }}
        />
      </div>

      <p
        style={{
          marginTop: "9px",
          color: "#d6c99c",
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          lineHeight: 1.45,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Inject V costs 35%. Threat Vision costs 20%. Blunder Shield costs 15%.
      </p>
    </div>
  );
}

function AlertBox({
  title,
  color,
  border,
  background,
  className,
  children,
}: {
  title: string;
  color: string;
  border: string;
  background: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        padding: "15px",
        borderRadius: "18px",
        background,
        border: `1px solid ${border}`,
        marginBottom: "16px",
      }}
    >
      <strong style={{ color, textTransform: "uppercase" }}>{title}</strong>
      {children}
    </div>
  );
}

function BattleLog({ moveHistory }: { moveHistory: string[] }) {
  return (
    <div
      style={{
        padding: "15px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255, 203, 5, 0.18)",
        maxHeight: "180px",
        overflow: "auto",
      }}
    >
      <h3
        style={{
          marginBottom: "10px",
          color: "#ffcb05",
          textTransform: "uppercase",
        }}
      >
        Battle Log
      </h3>

      {moveHistory.length === 0 ? (
        <p style={{ color: "#b8aa82", fontFamily: "'Inter', sans-serif" }}>
          No moves yet.
        </p>
      ) : (
        <ol
          style={{
            paddingLeft: "20px",
            color: "#f8f1d8",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.65,
          }}
        >
          {moveHistory.map((move, index) => (
            <li key={`${move}-${index}`}>{move}</li>
          ))}
        </ol>
      )}
    </div>
  );
}