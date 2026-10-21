import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "@fontsource/roboto/900-italic.css";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";

// SlotMagie brand colours (from slotmagie.de CSS)
export const C = {
  black: "#000000",
  ink: "#0b0b0b",
  panel: "#161616",
  red: "#da0e17",
  red2: "#e42521",
  white: "#ffffff",
  grey: "#d9d9d9",
  mute: "#aaaaaa",
  gold1: "#fff1b8",
  gold2: "#f6c544",
  gold3: "#c98a12",
};
export const FONT = "Roboto, sans-serif";
export const GOLD = `linear-gradient(180deg, ${C.gold1} 0%, ${C.gold2} 45%, ${C.gold3} 100%)`;

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const p = (f: number, s: number, d: number) =>
  interpolate(f, [s, s + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
export const pop = (f: number, s: number, d = 14) =>
  interpolate(f, [s, s + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.6, 0.64, 1),
  });
export const rise = (f: number, s: number, d = 18, y = 50) => {
  const t = p(f, s, d);
  return { opacity: t, translate: `0px ${interpolate(t, [0, 1], [y, 0])}px` };
};

/** Set to true once the original logo file is in public/slotmagie/logo.png */
export const HAS_LOGO = true;

export const Logo: React.FC<{ width: number }> = ({ width }) =>
  HAS_LOGO ? (
    <Img src={staticFile("slotmagie/logo.png")} style={{ width }} />
  ) : (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: width / 5.4,
        letterSpacing: -width / 300,
        color: C.white,
        lineHeight: 1,
      }}
    >
      SLOT<span style={{ color: C.red2 }}>MAGIE</span>
    </div>
  );

/** Black stage with red floor glow and drifting gold sparkles */
export const Stage: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -300,
          right: -300,
          bottom: -500,
          height: 1300,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${C.red}cc 0%, ${C.red}44 35%, transparent 68%)`,
          opacity: 0.85 + Math.sin(f / 12) * 0.08,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 300,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold2}22 0%, transparent 65%)`,
        }}
      />
      {new Array(38).fill(0).map((_, i) => {
        const x = random(`x${i}`) * 1080;
        const speed = 0.6 + random(`s${i}`) * 1.6;
        const y = 1920 - ((f * speed * 3 + random(`y${i}`) * 1920) % 2100);
        const size = 3 + random(`z${i}`) * 7;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / 8 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: C.gold2,
              boxShadow: `0 0 ${size * 3}px ${C.gold2}`,
              opacity: tw * 0.8,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Mandatory responsible-gambling footer (GlüStV / GGL): black on white, always visible */
export const LegalBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      bottom: 290,
      padding: "18px 26px",
      borderRadius: 14,
      backgroundColor: C.white,
      fontFamily: FONT,
      fontSize: 28,
      fontWeight: 700,
      lineHeight: 1.3,
      color: C.black,
      display: "flex",
      alignItems: "center",
      gap: 22,
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    }}
  >
    <div
      style={{
        flexShrink: 0,
        width: 78,
        height: 78,
        borderRadius: "50%",
        border: `5px solid ${C.red}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 31,
        fontWeight: 900,
        color: C.black,
      }}
    >
      18+
    </div>
    <div style={{ flex: 1 }}>
      Glücksspiel kann süchtig machen. Hilfe unter buwei.de
      <div style={{ fontWeight: 400, fontSize: 24, color: "#222" }}>
        Lizenziert · GGL-Whitelist · Es gelten die AGB von slotmagie.de
      </div>
    </div>
  </div>
);

/** Logo pinned at the top for the whole video */
export const PinnedLogo: React.FC = () => {
  const f = useCurrentFrame();
  const s = pop(f, 0, 10);
  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        scale: String(interpolate(s, [0, 1], [0.7, 1])),
        opacity: Math.min(1, s * 1.5),
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.8))",
      }}
    >
      <Logo width={500} />
    </div>
  );
};

/** White flash on each hard cut */
export const Flash: React.FC<{ at: number[] }> = ({ at }) => {
  const f = useCurrentFrame();
  const o = at.reduce(
    (m, c) => Math.max(m, interpolate(f, [c, c + 6], [0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (f >= c ? 1 : 0)),
    0,
  );
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: o, pointerEvents: "none" }} />;
};

/** Camera punch-in at the start of a scene */
export const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        scale: String(
          interpolate(f, [0, 8], [1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
