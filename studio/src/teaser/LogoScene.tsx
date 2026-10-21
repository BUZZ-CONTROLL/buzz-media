import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Background, LogoMark, Wordmark } from "./shared";
import { C, FONT, prog } from "./theme";

const WORDS = ["Partner.", "Plätze.", "Turniere."];

export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const word = prog(frame, 14, 20);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 90 }}
      >
        <LogoMark size={300} delay={2} />
        <Interactive.Div
          name="Wordmark"
          style={{
            opacity: word,
            translate: `0px ${interpolate(word, [0, 1], [60, 0])}px`,
          }}
        >
          <Wordmark size={150} />
        </Interactive.Div>
        <div style={{ display: "flex", gap: 34 }}>
          {WORDS.map((w, i) => {
            const p = prog(frame, 30 + i * 8, 16);
            return (
              <div
                key={w}
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: i === 1 ? C.blue : C.text,
                  opacity: p,
                  translate: `0px ${interpolate(p, [0, 1], [40, 0])}px`,
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
