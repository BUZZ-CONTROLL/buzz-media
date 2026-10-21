import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, C, Eyebrow, FONT, p, reveal } from "./theme";

const WORDS = ["Energie.", "Kraft.", "Balance.", "Gesundheit."];
const STEP = 22;

export const IntroScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill
        style={{ justifyContent: "center", paddingLeft: 200 }}
      >
        <Interactive.Div name="Intro eyebrow" style={reveal(f, 0, 20, 20)}>
          <Eyebrow>Fitness · Health · Recovery</Eyebrow>
        </Interactive.Div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "flex-start",
            gap: 36,
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          <Interactive.Div
            name="Intro Mehr"
            style={{ color: C.paper, height: 210, ...reveal(f, 4, 22, 60) }}
          >
            Mehr
          </Interactive.Div>
          <div style={{ position: "relative", height: 210, width: 1200, overflow: "hidden" }}>
            {WORDS.map((w, i) => {
              const s = 8 + i * STEP;
              const last = i === WORDS.length - 1;
              const inP = p(f, s, 14);
              const outP = last ? 0 : p(f, s + STEP, 12);
              return (
                <div
                  key={w}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    color: C.cyan,
                    opacity: inP * (1 - outP),
                    translate: `0px ${interpolate(inP, [0, 1], [120, 0]) + interpolate(outP, [0, 1], [0, -120])}px`,
                    filter: `blur(${(1 - inP) * 8 + outP * 8}px)`,
                  }}
                >
                  {w}
                </div>
              );
            })}
          </div>
        </div>
        <Interactive.Div
          name="Intro line"
          style={{
            marginTop: 50,
            height: 3,
            backgroundColor: C.line,
            width: 1100,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              backgroundColor: C.cyan,
              width: `${interpolate(f, [8, 8 + STEP * 4], [0, 100], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}%`,
            }}
          />
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
