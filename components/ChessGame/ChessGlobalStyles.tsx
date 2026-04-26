export default function ChessGlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap');

      * {
        box-sizing: border-box;
      }

      @keyframes vPulse {
        0% {
          box-shadow: 0 0 0 rgba(255, 203, 5, 0);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 34px rgba(255, 203, 5, 0.55);
          transform: scale(1.018);
        }
        100% {
          box-shadow: 0 0 0 rgba(255, 203, 5, 0);
          transform: scale(1);
        }
      }

      @keyframes dangerShake {
        0% {
          transform: translateX(0);
        }
        20% {
          transform: translateX(-4px);
        }
        40% {
          transform: translateX(4px);
        }
        60% {
          transform: translateX(-4px);
        }
        80% {
          transform: translateX(4px);
        }
        100% {
          transform: translateX(0);
        }
      }

      @keyframes scanGlow {
        0% {
          opacity: 0.35;
          transform: translateX(-100%);
        }
        100% {
          opacity: 0;
          transform: translateX(100%);
        }
      }

      @keyframes blinkText {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.45;
        }
      }

      @keyframes introIn {
        0% {
          opacity: 0;
          transform: scale(0.96) translateY(14px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes flashInject {
        0% {
          opacity: 0;
          transform: scale(0.9);
        }
        35% {
          opacity: 1;
          transform: scale(1.08);
        }
        100% {
          opacity: 0;
          transform: scale(1.28);
        }
      }

      @keyframes flashThreat {
        0% {
          opacity: 0;
          transform: translateX(-80%);
        }
        35% {
          opacity: 0.95;
        }
        100% {
          opacity: 0;
          transform: translateX(80%);
        }
      }

      @keyframes shieldAlarm {
        0% {
          opacity: 0;
        }
        25% {
          opacity: 0.5;
        }
        50% {
          opacity: 0.15;
        }
        75% {
          opacity: 0.45;
        }
        100% {
          opacity: 0;
        }
      }

      .v-pulse {
        animation: vPulse 0.75s ease-in-out;
      }

      .danger-shake {
        animation: dangerShake 0.35s ease-in-out;
      }

      .blink-text {
        animation: blinkText 1s infinite;
      }

      .scan-card {
        position: relative;
        overflow: hidden;
      }

      .scan-card::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 45%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 203, 5, 0.28),
          transparent
        );
        animation: scanGlow 0.75s ease-in-out;
        pointer-events: none;
      }

      .game-layout {
        width: min(1200px, 96vw);
        display: grid;
        grid-template-columns: minmax(320px, 600px) minmax(300px, 430px);
        gap: 28px;
        align-items: start;
        position: relative;
        z-index: 2;
      }

      .glass-card {
        background: linear-gradient(
          180deg,
          rgba(18, 18, 18, 0.84),
          rgba(36, 9, 12, 0.84)
        );
        border: 1px solid rgba(255, 203, 5, 0.2);
        box-shadow:
          0 30px 100px rgba(0, 0, 0, 0.62),
          inset 0 1px 0 rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(18px);
      }

      .modern-button {
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease,
          filter 0.15s ease,
          opacity 0.15s ease;
      }

      .modern-button:hover:not(:disabled) {
        transform: translateY(-2px);
        filter: brightness(1.06);
      }

      .modern-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .chess-square:hover {
        filter: brightness(1.08);
      }

      .ability-flash {
        position: fixed;
        inset: 0;
        z-index: 40;
        pointer-events: none;
      }

      .ability-flash-inject {
        background:
          radial-gradient(circle at center, rgba(255, 203, 5, 0.34), transparent 32%),
          radial-gradient(circle at center, rgba(255, 203, 5, 0.18), transparent 55%);
        animation: flashInject 0.7s ease-out forwards;
      }

      .ability-flash-threat {
        background:
          linear-gradient(90deg, transparent, rgba(255, 203, 5, 0.18), transparent),
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 12px,
            rgba(255, 203, 5, 0.05) 13px
          );
        animation: flashThreat 0.7s ease-out forwards;
      }

      .ability-flash-shield {
        background:
          radial-gradient(circle at center, transparent 35%, rgba(239, 68, 68, 0.2) 100%),
          rgba(239, 68, 68, 0.12);
        animation: shieldAlarm 0.7s ease-out forwards;
      }

      .intro-card {
        animation: introIn 0.45s ease-out;
      }

      @media (max-width: 900px) {
        .game-layout {
          grid-template-columns: 1fr;
          width: min(680px, 96vw);
        }
      }

      @media (max-width: 560px) {
        .game-layout {
          width: 100%;
          gap: 18px;
        }

        main {
          padding: 16px !important;
          align-items: flex-start !important;
        }

        h1 {
          font-size: 44px !important;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }
      }
    `}</style>
  );
}