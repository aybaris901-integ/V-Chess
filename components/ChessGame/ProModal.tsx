type ProModalProps = {
  onClose: () => void;
};

export default function ProModal({ onClose }: ProModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 50,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="v-pulse glass-card"
        style={{
          width: "min(92vw, 540px)",
          border: "1px solid rgba(255, 203, 5, 0.48)",
          borderRadius: "24px",
          padding: "24px",
          color: "#f8f1d8",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "6px 12px",
            background: "rgba(255, 203, 5, 0.12)",
            border: "1px solid rgba(255, 203, 5, 0.34)",
            borderRadius: "999px",
            color: "#ffcb05",
            fontWeight: 900,
            fontSize: "11px",
            marginBottom: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Business Model Prototype
        </div>

        <h2
          style={{
            color: "#ffcb05",
            textTransform: "uppercase",
            fontSize: "34px",
            marginBottom: "10px",
            letterSpacing: "-0.03em",
            textShadow: "0 0 28px rgba(255,203,5,0.18)",
          }}
        >
          V-Pro Protocol
        </h2>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#d6c99c",
            lineHeight: 1.5,
            marginBottom: "18px",
          }}
        >
          This is a monetization concept for the final product: players can
          upgrade for more AI power, deeper analysis, and visual customization.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <PlanCard
            title="FREE"
            items={["100% Compound V", "Basic AI powers", "Single mission mode"]}
          />

          <PlanCard
            title="V-PRO"
            highlight
            items={[
              "200% Compound V",
              "Unlimited Threat Vision",
              "Deep game analysis",
              "Custom board skins",
              "City leaderboard",
            ]}
          />
        </div>

        <button
          onClick={onClose}
          className="modern-button"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "16px",
            border: "1px solid rgba(255, 203, 5, 0.85)",
            cursor: "pointer",
            fontWeight: 900,
            background: "linear-gradient(135deg, #ffcb05 0%, #f59e0b 100%)",
            color: "#111",
            textTransform: "uppercase",
            boxShadow: "0 16px 38px rgba(255, 203, 5, 0.18)",
            letterSpacing: "0.04em",
          }}
        >
          Payment Integration Coming Soon
        </button>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  items,
  highlight = false,
}: {
  title: string;
  items: string[];
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "15px",
        borderRadius: "18px",
        border: highlight
          ? "1px solid rgba(255, 203, 5, 0.46)"
          : "1px solid rgba(255, 203, 5, 0.18)",
        background: highlight
          ? "rgba(255, 203, 5, 0.09)"
          : "rgba(255,255,255,0.045)",
      }}
    >
      <strong style={{ color: "#ffcb05" }}>{title}</strong>
      <ul
        style={{
          marginTop: "10px",
          paddingLeft: "18px",
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.6,
          fontSize: "14px",
        }}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}