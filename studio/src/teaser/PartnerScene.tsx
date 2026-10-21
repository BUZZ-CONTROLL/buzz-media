import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background, StepHeader } from "./shared";
import { C, FONT, pop, prog } from "./theme";

const PEOPLE = [
  { initials: "LK", name: "Lena", sport: "Tennis", level: 0.72, levelLabel: "Fortgeschritten", time: "Di · 18:00", color: C.blue, match: 96 },
  { initials: "JM", name: "Jonas", sport: "Laufen", level: 0.55, levelLabel: "Mittel", time: "Sa · 08:30", color: C.yellow, match: 89 },
  { initials: "SA", name: "Sara", sport: "Klettern", level: 0.64, levelLabel: "Mittel", time: "Do · 19:00", color: C.pink, match: 84 },
];

export const PartnerScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <StepHeader step="2" label="Partner" color={C.yellow}>
        Gleiches Niveau. <span style={{ color: C.yellow }}>Gleiche Zeit.</span>
      </StepHeader>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 790,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {PEOPLE.map((p, i) => {
          const start = 12 + i * 9;
          const inP = prog(frame, start, 20);
          const bar = prog(frame, start + 10, 24);
          const badge = pop(frame, start + 22, 14);
          const highlight = i === 0;
          return (
            <div
              key={p.name}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 36,
                padding: "40px 44px",
                borderRadius: 48,
                backgroundColor: highlight ? C.cardHi : C.card,
                border: `3px solid ${highlight ? p.color : C.line}`,
                opacity: inP,
                translate: `${interpolate(inP, [0, 1], [700, 0])}px 0px`,
              }}
            >
              <div
                style={{
                  width: 150,
                  height: 150,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${p.color}, ${p.color}88)`,
                  color: C.bg,
                  fontSize: 58,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: C.text }}>
                  {p.name}
                  <span style={{ color: C.muted, fontWeight: 700 }}> · {p.sport}</span>
                </div>
                <div
                  style={{
                    marginTop: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: C.line,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${p.level * 100 * bar}%`,
                      borderRadius: 9,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 14,
                    fontSize: 38,
                    fontWeight: 600,
                    color: C.muted,
                  }}
                >
                  {p.levelLabel} · {p.time}
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: -26,
                  right: 34,
                  padding: "10px 24px",
                  borderRadius: 999,
                  backgroundColor: highlight ? p.color : C.bg,
                  border: `3px solid ${p.color}`,
                  color: highlight ? C.bg : p.color,
                  fontSize: 38,
                  fontWeight: 900,
                  scale: String(badge),
                }}
              >
                {Math.round(p.match * bar)}% Match
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
