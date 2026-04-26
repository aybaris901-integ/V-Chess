"use client";

import ChessBoard from "./ChessBoard";
import ChessGlobalStyles from "./ChessGlobalStyles";
import IntroModal from "./IntroModal";
import ProModal from "./ProModal";
import VPanel from "./VPanel";
import { useChessGame } from "./useChessGame";

export default function ChessGame() {
  const chess = useChessGame();

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 12% 8%, rgba(255, 203, 5, 0.14), transparent 30%), radial-gradient(circle at 88% 82%, rgba(172, 24, 32, 0.35), transparent 34%), linear-gradient(135deg, #050505 0%, #12090a 48%, #030303 100%)",
        color: "#f8f1d8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "28px",
        fontFamily: "'Space Grotesk', 'Inter', 'Segoe UI', sans-serif",
        letterSpacing: "0.01em",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ChessGlobalStyles />

      {chess.abilityFlash && (
        <div
          className={`ability-flash ability-flash-${chess.abilityFlash}`}
          aria-hidden="true"
        />
      )}

      <section className="game-layout">
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 14px",
              marginBottom: "12px",
              background: "rgba(255, 203, 5, 0.12)",
              color: "#ffcb05",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              border: "1px solid rgba(255, 203, 5, 0.38)",
              borderRadius: "999px",
              boxShadow: "0 10px 34px rgba(255, 203, 5, 0.08)",
              letterSpacing: "0.08em",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#ffcb05",
                boxShadow: "0 0 16px rgba(255, 203, 5, 0.9)",
              }}
            />
            Classified Chess Experiment
          </div>

          <h1
            style={{
              fontSize: "58px",
              margin: "8px 0 6px",
              color: "#fff7d6",
              textTransform: "uppercase",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              fontWeight: 800,
              textShadow: "0 0 34px rgba(255, 203, 5, 0.22)",
            }}
          >
            V-Chess
          </h1>

          <p
            style={{
              color: "#ffcb05",
              marginBottom: "16px",
              fontSize: "14px",
              textTransform: "uppercase",
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            Tactical chess powered by unstable Compound V
          </p>

          <p
            className="glass-card"
            style={{
              minHeight: "24px",
              marginBottom: "18px",
              padding: "13px 16px",
              borderLeft: "4px solid #ac1820",
              borderRadius: "16px",
              color: "#f8f1d8",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              lineHeight: 1.45,
            }}
          >
            {chess.message}
          </p>

          <ChessBoard
            board={chess.board}
            selectedSquare={chess.selectedSquare}
            legalMoves={chess.legalMoves}
            lastMove={chess.lastMove}
            onSquareClick={chess.handleSquareClick}
          />

          <button
            onClick={chess.resetGame}
            className="modern-button"
            style={{
              marginTop: "22px",
              padding: "14px 26px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 203, 5, 0.75)",
              cursor: "pointer",
              fontWeight: 900,
              textTransform: "uppercase",
              background:
                "linear-gradient(135deg, rgba(172,24,32,1), rgba(113,18,26,1))",
              color: "#fff5c7",
              boxShadow: "0 16px 34px rgba(172,24,32,0.28)",
              letterSpacing: "0.06em",
            }}
          >
            Restart Mission
          </button>

          <p
            style={{
              marginTop: "18px",
              color: "#b8aa82",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Controls: click a piece, then click one of the highlighted squares.
          </p>
        </div>

        <VPanel
          gameMode={chess.gameMode}
          aiThinking={chess.aiThinking}
          isGameFinished={chess.isGameFinished}
          result={chess.getGameResult()}
          totalMoves={chess.moveHistory.length}
          compoundLevel={chess.compoundLevel}
          missionRating={chess.getMissionRating()}
          injectAnimating={chess.injectAnimating}
          threatScanning={chess.threatScanning}
          blunderWarning={chess.blunderWarning}
          aiHint={chess.aiHint}
          threats={chess.threats}
          moveHistory={chess.moveHistory}
          onChangeGameMode={chess.changeGameMode}
          onInjectV={chess.injectV}
          onThreatVision={chess.threatVision}
          onOpenProModal={() => chess.setShowProModal(true)}
        />
      </section>

      {chess.showIntro && (
        <IntroModal onStart={() => chess.setShowIntro(false)} />
      )}

      {chess.showProModal && (
        <ProModal onClose={() => chess.setShowProModal(false)} />
      )}
    </main>
  );
}