import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Background, StepHeader } from "./shared";
import { C, FONT, pop, prog } from "./theme";

const BADGES = [
  { label: "Erstes Match", color: C.blue },
  { label: "Frühsport", color: C.yellow },
  { label: "5er-Serie", color: C.pink },
];

const Hex: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polygon
      points="50,4 92,27 92,73 50,96 8,73 8,27"
      fill={`${color}33`}
      stroke={color}
      strokeWidth="6"
    />
    <polygon points="50,30 56,44 71,45 59,55 63,70 50,62 37,70 41,55 29,45 44,44" fill={color} />
  </svg>
);

export const MatchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const card = prog(frame, 10, 20);
  const check = prog(frame, 22, 16);
  const points = Math.round(
    interpolate(frame, [36, 62], [0, 50], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const pts = pop(frame, 34, 14);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <StepHeader step="3" label="Match" color={C.pink}>
        Verabreden. Spielen. <span style={{ color: C.pink }}>Punkten.</span>
      </StepHeader>

      <Interactive.Div
        name="Match card"
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 800,
          padding: "56px 56px",
          borderRadius: 56,
          backgroundColor: C.cardHi,
          border: `3px solid ${C.blue}`,
          opacity: card,
          scale: String(interpolate(card, [0, 1], [0.85, 1])),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="52" fill={C.blue} />
            <path
              d="M30 57 L48 74 L82 38"
              fill="none"
              stroke={C.bg}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="90"
              strokeDashoffset={90 * (1 - check)}
            />
          </svg>
          <div style={{ fontSize: 66, fontWeight: 900, color: C.text }}>
            Match bestätigt
          </div>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 44,
            fontWeight: 600,
            color: C.muted,
            lineHeight: 1.4,
          }}
        >
          Tennis mit Lena
          <br />
          Di · 18:00 · Tennisclub
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Points"
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1310,
          textAlign: "center",
          fontSize: 150,
          fontWeight: 900,
          color: C.blue,
          letterSpacing: -4,
          scale: String(pts),
          textShadow: `0 0 60px ${C.blue}66`,
        }}
      >
        +{points} Punkte
      </Interactive.Div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1520,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {BADGES.map((b, i) => {
          const s = pop(frame, 50 + i * 7, 14);
          return (
            <div
              key={b.label}
              style={{
                width: 270,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                scale: String(s),
              }}
            >
              <Hex color={b.color} size={150} />
              <div style={{ fontSize: 36, fontWeight: 800, color: C.text }}>
                {b.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
