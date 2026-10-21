import "@fontsource/archivo/500.css";
import "@fontsource/archivo/700.css";
import "@fontsource/archivo/800.css";
import "@fontsource/archivo/900.css";
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BUZZ, DIGITS, FITNESS, RING } from "./logoPaths";

// BUZZ24 brand colours (logo + buzz24.fitness CSS)
export const C = {
  black: "#0a0a0a",
  navy: "#162135",
  indigo: "#36398c",
  cyan: "#00b0eb",
  teal: "#00c8e0",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.4)",
  line: "rgba(255,255,255,0.1)",
  card: "rgba(255,255,255,0.05)",
};
export const FONT = "Archivo, sans-serif";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const p = (f: number, s: number, d: number) =>
  interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const pop = (f: number, s: number, d = 12) =>
  interpolate(f, [s, s + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.6, 0.64, 1),
  });
export const rise = (f: number, s: number, d = 14, y = 50) => {
  const t = p(f, s, d);
  return { opacity: t, translate: `0px ${interpolate(t, [0, 1], [y, 0])}px` };
};
export const slideIn = (f: number, s: number, d = 14, x = -120) => {
  const t = p(f, s, d);
  return { opacity: t, translate: `${interpolate(t, [0, 1], [x, 0])}px 0px` };
};

const Shapes: React.FC<{ items: [string, string][]; fill: string | ((i: number) => string) }> = ({ items, fill }) => (
  <>
    {items.map(([t, d], i) => {
      const col = typeof fill === "function" ? fill(i) : fill;
      return t === "path" ? <path key={i} d={d} fill={col} /> : <polygon key={i} points={d} fill={col} />;
    })}
  </>
);

/** Full logo (long). On dark: BU/FITNESS/ring cyan, ZZ + 24/7 white. */
export const Logo: React.FC<{
  width: number;
  ringRotate?: number;
  ringScale?: number;
  wordReveal?: number; // 0..1 clip from left
  digitsOpacity?: number;
}> = ({ width, ringRotate = 0, ringScale = 1, wordReveal = 1, digitsOpacity = 1 }) => (
  <svg width={width} height={(width * 148) / 333.93} viewBox="0 0 333.93 148" style={{ overflow: "visible" }}>
    <defs>
      <clipPath id="b24word">
        <rect x="-5" y="0" width={190 * wordReveal} height="148" />
      </clipPath>
    </defs>
    <g clipPath="url(#b24word)">
      <Shapes items={BUZZ} fill={(i) => (i < 2 ? C.cyan : C.white)} />
      <Shapes items={FITNESS} fill={C.cyan} />
    </g>
    <g transform={`rotate(${ringRotate} 262.5 74) translate(262.5 74) scale(${ringScale}) translate(-262.5 -74)`}>
      <Shapes items={RING} fill={C.cyan} />
    </g>
    <g opacity={digitsOpacity}>
      <Shapes items={DIGITS} fill={C.white} />
    </g>
  </svg>
);

/** Just the arrow ring + 24/7, centred — used as a big hero element */
export const RingMark: React.FC<{ size: number; rotate?: number; digits?: number; ringColor?: string }> = ({
  size,
  rotate = 0,
  digits = 1,
  ringColor = C.cyan,
}) => (
  <svg width={size} height={size} viewBox="188 -2 150 152" style={{ overflow: "visible" }}>
    <g transform={`rotate(${rotate} 262.5 74)`}>
      <Shapes items={RING} fill={ringColor} />
    </g>
    <g opacity={digits} transform={`translate(262.5 74) scale(${0.9 + 0.1 * digits}) translate(-262.5 -74)`}>
      <Shapes items={DIGITS} fill={C.white} />
    </g>
  </svg>
);

/** Dark stage: near-black, navy glow, faint rotating ring and moving light streaks */
export const Stage: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 1600,
          left: -260,
          top: 160 + Math.sin(f / 60) * 40,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.navy} 0%, ${C.navy}aa 30%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          right: -300,
          top: 200 + Math.cos(f / 50) * 60,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyan}2a 0%, transparent 65%)`,
        }}
      />
      <div style={{ position: "absolute", left: -380, top: 520, opacity: 0.06 }}>
        <RingMark size={1500} rotate={f * 0.25} digits={0} ringColor={C.white} />
      </div>
      {/* diagonal light streaks */}
      {[0, 1, 2].map((i) => {
        const x = ((f * (6 + i * 2) + i * 700) % 2400) - 600;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: -200,
              width: 3,
              height: 2400,
              rotate: "28deg",
              background: `linear-gradient(180deg, transparent, ${C.cyan}55, transparent)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Camera punch-in on hard cuts */
export const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ scale: String(interpolate(f, [0, 8], [1.07, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })) }}>
      {children}
    </AbsoluteFill>
  );
};

/** Simple brand line icons */
export const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 64, color = C.cyan }) => {
  const s = { fill: "none", stroke: color, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const P: Record<string, React.ReactNode> = {
    sparkle: <path d="M24 4l4 14 14 4-14 4-4 14-4-14-14-4 14-4zM39 5l1.5 4.5L45 11l-4.5 1.5L39 17l-1.5-4.5L33 11l4.5-1.5z" {...s} />,
    snow: <path d="M24 5v38M7.5 14.5l33 19M7.5 33.5l33-19M19 9l5 4 5-4M19 39l5-4 5 4" {...s} />,
    wind: <path d="M6 18h24a6 6 0 10-6-6M6 26h32a6 6 0 11-6 6M6 34h14" {...s} />,
    shower: (
      <>
        <path d="M10 8h14a8 8 0 018 8v2M24 22h16M28 22l-3 4M36 22l1 4M32 22v5" {...s} />
        <path d="M27 32l-1 4M33 32v4M39 32l1 4" {...s} />
      </>
    ),
    dumbbell: <path d="M6 20v8M10 15v18M14 15v18M14 24h20M34 15v18M38 15v18M42 20v8" {...s} />,
    machine: (
      <>
        <rect x="8" y="6" width="12" height="36" rx="2" {...s} />
        <path d="M8 14h12M8 22h12M8 30h12M20 12h12l6 6v24M32 12v30" {...s} />
      </>
    ),
    run: (
      <>
        <circle cx="28" cy="8" r="4" {...s} />
        <path d="M18 18l8-3 6 6 6 2M26 15l-4 12 8 6-2 10M22 27l-8 4-4-2M6 44h36" {...s} />
      </>
    ),
    kettlebell: (
      <>
        <path d="M17 18a7 7 0 1114 0" {...s} />
        <path d="M14 20h20l4 12a10 10 0 01-10 10H20a10 10 0 01-10-10z" {...s} />
      </>
    ),
    lounge: (
      <>
        <path d="M8 20h24v10a12 12 0 01-24 0z" {...s} />
        <path d="M32 23h3a5 5 0 010 10h-4M16 6c-2 3 2 5 0 8M24 6c-2 3 2 5 0 8" {...s} />
      </>
    ),
    coach: (
      <>
        <circle cx="18" cy="12" r="6" {...s} />
        <path d="M6 42V32a12 12 0 0124 0v10M34 20l4 4 7-8" {...s} />
      </>
    ),
    clock: (
      <>
        <circle cx="24" cy="24" r="18" {...s} />
        <path d="M24 13v11l7 5" {...s} />
      </>
    ),
    check: <path d="M10 25l9 9 19-20" {...s} strokeWidth={4} />,
    star: <path d="M24 5l5.6 11.6 12.7 1.7-9.3 8.8 2.3 12.6L24 33.6l-11.3 6.1 2.3-12.6-9.3-8.8 12.7-1.7z" fill={color} stroke="none" />,
    pin: (
      <>
        <path d="M24 44s14-13 14-24a14 14 0 10-28 0c0 11 14 24 14 24z" {...s} />
        <circle cx="24" cy="20" r="5" {...s} />
      </>
    ),
    car: (
      <>
        <path d="M8 30l4-12h24l4 12v8H8z" {...s} />
        <circle cx="15" cy="38" r="3" {...s} />
        <circle cx="33" cy="38" r="3" {...s} />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {P[name]}
    </svg>
  );
};
