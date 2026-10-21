import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop, C, FONT, p, reveal } from "./theme";

// Full logo is 1962.3 x 546; split into icon (0–560) and wordmark (662–1962).
const LOGO_H = 250;
const ICON_W = (560 / 546) * LOGO_H;
const WORD_W = (1301 / 546) * LOGO_H;
const GAP = (102 / 546) * LOGO_H;

export const BuzzCtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const icon = p(f, 4, 30);
  const word = p(f, 18, 30);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop ring={false} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: GAP, marginTop: -60 }}>
          <Img
            name="Logo icon"
            src={staticFile("buzz/icon_claim_ondark.svg")}
            style={{
              width: ICON_W,
              height: LOGO_H,
              opacity: icon,
              scale: String(interpolate(icon, [0, 1], [0.7, 1])),
              rotate: `${interpolate(icon, [0, 1], [-50, 0])}deg`,
            }}
          />
          <div
            style={{
              width: WORD_W,
              height: LOGO_H,
              clipPath: `inset(0 ${100 - word * 100}% 0 0)`,
            }}
          >
            <Img
              name="Logo wordmark"
              src={staticFile("buzz/word_claim_ondark.svg")}
              style={{ width: WORD_W, height: LOGO_H }}
            />
          </div>
        </div>

        <Interactive.Div
          name="CTA quote"
          style={{
            marginTop: 70,
            fontSize: 56,
            fontWeight: 300,
            fontStyle: "italic",
            color: C.paper,
            ...reveal(f, 46, 26, 30),
          }}
        >
          Weil deine beste Zeit es wert ist.
        </Interactive.Div>

        <Interactive.Div
          name="CTA button"
          style={{
            marginTop: 56,
            padding: "28px 64px",
            borderRadius: 999,
            backgroundColor: C.cyan,
            color: C.ink,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: 1,
            boxShadow: `0 0 ${50 + Math.sin(f / 9) * 14}px ${C.cyan}66`,
            ...reveal(f, 64, 24, 30),
          }}
        >
          Kostenloses Erstgespräch buchen
        </Interactive.Div>

        <Interactive.Div
          name="CTA address"
          style={{
            marginTop: 44,
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 2,
            color: C.muted,
            ...reveal(f, 80, 24, 20),
          }}
        >
          buzz.wien  ·  Dirmhirngasse 112, 1230 Wien
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
