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

{chess.blunderWarning && (
  <div
    className="danger-shake"
    style={{
      marginBottom: "18px",
      padding: "12px 14px",
      background: "rgba(239, 68, 68, 0.18)",
      border: "2px solid rgba(239, 68, 68, 0.75)",
      borderLeft: "8px solid #ef4444",
      borderRadius: "12px",
      color: "#fecaca",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 800,
      lineHeight: 1.4,
      boxShadow: "0 12px 30px rgba(239,68,68,0.18)",
    }}
  >
    ⚠️ Blunder Shield activated. Scroll to V-Panel for details, or click the same square again to confirm.
  </div>
)}

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
    color: "#c9b98f",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
  }}
>
  Controls: click a piece, then click one of the highlighted squares.
</p>

<button
  className="mobile-vpanel-hint"
  onClick={() =>
    document.getElementById("v-panel")?.scrollIntoView({ behavior: "smooth" })
  }
  style={{
    marginTop: "10px",
    padding: "10px 14px",
    width: "100%",
    color: "#111",
    background: "#ffcb05",
    border: "2px solid #ac1820",
    fontSize: "13px",
    fontFamily: "Arial, sans-serif",
    fontWeight: 900,
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "4px 4px 0 #050505",
  }}
>
  ↓ Open V-Panel Powers
</button>

           <p
  className="mobile-vpanel-hint"
  style={{
    marginTop: "10px",
    color: "#ffcb05",
    fontSize: "13px",
    fontFamily: "Arial, sans-serif",
    fontWeight: 800,
    textTransform: "uppercase",
  }}
>
  ↓ Scroll down to access V-Panel powers
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
  user={chess.user}
  recentGames={chess.recentGames}
  authMessage={chess.authMessage}
  signInWithGithub={chess.signInWithGithub}
  signOut={chess.signOut}
  onlineRoomCode={chess.onlineRoomCode}
joinRoomInput={chess.joinRoomInput}
setJoinRoomInput={chess.setJoinRoomInput}
onlineColor={chess.onlineColor}
onlineStatus={chess.onlineStatus}
createOnlineRoom={chess.createOnlineRoom}
joinOnlineRoom={chess.joinOnlineRoom}
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