import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Background, LogoMark, Wordmark } from "./shared";
import { C, FONT, pop, prog } from "./theme";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = prog(frame, 8, 18);
  const sub = prog(frame, 16, 18);
  const btn = pop(frame, 26, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 90px",
          textAlign: "center",
        }}
      >
        <LogoMark size={220} delay={0} />
        <Interactive.Div
          name="CTA wordmark"
          style={{
            marginTop: 80,
            opacity: title,
            translate: `0px ${interpolate(title, [0, 1], [40, 0])}px`,
          }}
        >
          <Wordmark size={120} />
        </Interactive.Div>
        <Interactive.Div
          name="CTA claim"
          style={{
            marginTop: 50,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
            color: C.text,
            opacity: sub,
          }}
        >
          Finde Partner, Plätze und Matches in deiner Nähe
        </Interactive.Div>
        <Interactive.Div
          name="CTA button"
          style={{
            marginTop: 90,
            padding: "36px 70px",
            borderRadius: 999,
            backgroundColor: C.blue,
            color: C.bg,
            fontSize: 68,
            fontWeight: 900,
            scale: String(btn * (1 + Math.max(0, Math.sin((frame - 40) / 5)) * 0.03)),
            boxShadow: `0 0 80px ${C.blue}77`,
          }}
        >
          MatchBuzzer.com
        </Interactive.Div>
        <Interactive.Div
          name="CTA sports"
          style={{
            marginTop: 60,
            fontSize: 44,
            fontWeight: 600,
            color: C.muted,
            opacity: prog(frame, 34, 16),
          }}
        >
          Tennis · Laufen · Fitness · Klettern
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
