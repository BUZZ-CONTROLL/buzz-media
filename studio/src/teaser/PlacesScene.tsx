import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Background, StepHeader } from "./shared";
import { C, FONT, pop, prog } from "./theme";

const PINS = [
  { x: 150, y: 190, label: "Tennisclub", sub: "0,8 km", color: C.blue },
  { x: 760, y: 400, label: "Lauftreff", sub: "1,2 km", color: C.yellow },
  { x: 170, y: 650, label: "Kletterhalle", sub: "2,1 km", color: C.pink },
  { x: 750, y: 880, label: "Fitness", sub: "0,5 km", color: C.purple },
];

const Pin: React.FC<{ color: string }> = ({ color }) => (
  <svg width="70" height="92" viewBox="0 0 70 92">
    <path
      d="M35 2C17 2 3 16 3 34c0 24 32 56 32 56s32-32 32-56C67 16 53 2 35 2z"
      fill={color}
    />
    <circle cx="35" cy="34" r="13" fill={C.bg} />
  </svg>
);

export const PlacesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const card = prog(frame, 8, 22);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <StepHeader step="1" label="Plätze" color={C.orange}>
        Sportstätten in deiner <span style={{ color: C.orange }}>Nähe</span>
      </StepHeader>

      <Interactive.Div
        name="Map card"
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 760,
          height: 980,
          borderRadius: 56,
          backgroundColor: C.card,
          border: `3px solid ${C.line}`,
          overflow: "hidden",
          opacity: card,
          translate: `0px ${interpolate(card, [0, 1], [120, 0])}px`,
        }}
      >
        {/* Stylised streets */}
        <svg
          width="900"
          height="980"
          style={{ position: "absolute", inset: 0 }}
        >
          <g stroke={C.cardHi} strokeWidth="34" fill="none" strokeLinecap="round">
            <path d="M-20 420 C 250 380, 520 520, 940 440" />
            <path d="M420 -20 C 380 300, 520 640, 450 1000" />
            <path d="M-20 860 C 300 820, 600 900, 940 820" />
          </g>
          <g stroke={C.line} strokeWidth="14" fill="none">
            <path d="M120 -20 L 180 1000" />
            <path d="M760 -20 L 700 1000" />
            <path d="M-20 160 L 940 220" />
          </g>
          <rect x="520" y="560" width="200" height="130" rx="24" fill={`${C.blue}14`} />
          <rect x="140" y="300" width="160" height="100" rx="24" fill={`${C.yellow}14`} />
        </svg>

        {/* "You" dot */}
        <div
          style={{
            position: "absolute",
            left: 450 - 30,
            top: 500 - 30,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: C.blue,
            border: `8px solid ${C.text}`,
            boxShadow: `0 0 0 ${18 + Math.sin(frame / 5) * 10}px ${C.blue}33`,
          }}
        />

        {PINS.map((p, i) => {
          const s = pop(frame, 22 + i * 8, 14);
          const lbl = prog(frame, 28 + i * 8, 14);
          const left = p.x > 450;
          return (
            <div
              key={p.label}
              style={{
                position: "absolute",
                ...(left ? { right: 900 - (p.x + 35) } : { left: p.x - 35 }),
                top: p.y - 90,
                display: "flex",
                flexDirection: left ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div
                style={{
                  scale: String(s),
                  transformOrigin: "50% 100%",
                  translate: `0px ${interpolate(s, [0, 1], [-60, 0])}px`,
                }}
              >
                <Pin color={p.color} />
              </div>
              <div
                style={{
                  padding: "14px 24px",
                  borderRadius: 22,
                  backgroundColor: C.bg,
                  border: `3px solid ${p.color}`,
                  opacity: lbl,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ fontSize: 44, fontWeight: 800, color: C.text }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 32, fontWeight: 600, color: C.muted }}>
                  {p.sub}
                </div>
              </div>
            </div>
          );
        })}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
