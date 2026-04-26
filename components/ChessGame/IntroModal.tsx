type IntroModalProps = {
  onStart: () => void;
};

export default function IntroModal({ onStart }: IntroModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(circle at center, rgba(255,203,5,0.12), transparent 34%), rgba(0,0,0,0.86)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "22px",
        zIndex: 60,
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        className="intro-card glass-card"
        style={{
          width: "min(92vw, 620px)",
          borderRadius: "30px",
          padding: "34px",
          border: "1px solid rgba(255,203,5,0.42)",
          textAlign: "center",
          color: "#f8f1d8",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "7px 14px",
            background: "rgba(255, 203, 5, 0.12)",
            border: "1px solid rgba(255, 203, 5, 0.34)",
            borderRadius: "999px",
            color: "#ffcb05",
            fontWeight: 900,
            fontSize: "12px",
            marginBottom: "18px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Protocol Initialized
        </div>

        <h2
          style={{
            fontSize: "clamp(42px, 8vw, 74px)",
            lineHeight: 0.92,
            margin: "0 0 14px",
            color: "#fff7d6",
            textTransform: "uppercase",
            letterSpacing: "-0.06em",
            textShadow: "0 0 40px rgba(255,203,5,0.26)",
          }}
        >
          V-Chess
        </h2>

        <p
          style={{
            margin: "0 auto 24px",
            maxWidth: "480px",
            color: "#d6c99c",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.6,
            fontSize: "15px",
          }}
        >
          Compound V tactical system is online. Select a mission mode, activate
          abilities, and outplay the enemy before the serum runs out.
        </p>

        <button
          onClick={onStart}
          className="modern-button"
          style={{
            width: "100%",
            maxWidth: "320px",
            padding: "15px 18px",
            borderRadius: "18px",
            border: "1px solid rgba(255, 203, 5, 0.9)",
            cursor: "pointer",
            fontWeight: 900,
            background: "linear-gradient(135deg, #ffcb05 0%, #f59e0b 100%)",
            color: "#111",
            textTransform: "uppercase",
            boxShadow: "0 18px 44px rgba(255, 203, 5, 0.22)",
            letterSpacing: "0.06em",
          }}
        >
          Start Mission
        </button>
      </div>
    </div>
  );
}