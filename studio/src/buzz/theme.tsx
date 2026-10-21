import "@fontsource/source-sans-3/300.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
import "@fontsource/source-sans-3/800.css";
import "@fontsource/source-sans-3/900.css";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

// BUZZ brand colours (taken from buzz.wien logo + site CSS)
export const C = {
  ink: "#090b1a",
  navy: "#2e3379",
  navyDeep: "#161a44",
  cyan: "#00b0eb",
  sky: "#5bc8f5",
  paper: "#fbfbf9",
  muted: "rgba(251,251,249,0.62)",
  faint: "rgba(251,251,249,0.38)",
  line: "rgba(255,255,255,0.12)",
  card: "rgba(255,255,255,0.045)",
};

export const FONT = "'Source Sans 3', 'Inter', sans-serif";

export const soft = Easing.bezier(0.22, 1, 0.36, 1);

export const p = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: soft,
  });

/** fade + rise in, optional fade out */
export const reveal = (
  frame: number,
  start: number,
  dur = 22,
  rise = 40,
  outStart?: number,
) => {
  const i = p(frame, start, dur);
  const o = outStart === undefined ? 1 : 1 - p(frame, outStart, 14);
  return {
    opacity: i * o,
    translate: `0px ${interpolate(i, [0, 1], [rise, 0])}px`,
  };
};

export const Backdrop: React.FC<{ ring?: boolean }> = ({ ring = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 1600,
          borderRadius: "50%",
          left: -500 + Math.sin(f / 90) * 80,
          top: -700 + Math.cos(f / 110) * 60,
          background: `radial-gradient(circle, ${C.navy}cc 0%, ${C.navyDeep}66 40%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          right: -380 + Math.cos(f / 100) * 70,
          bottom: -520 + Math.sin(f / 120) * 60,
          background: `radial-gradient(circle, ${C.cyan}2e 0%, transparent 65%)`,
        }}
      />
      {ring ? (
        <Img
          src={staticFile("buzz/icon_claim_ondark.svg")}
          style={{
            position: "absolute",
            width: 1500,
            right: -520,
            top: -260,
            opacity: 0.05,
            rotate: `${f * 0.06}deg`,
          }}
        />
      ) : null}
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: 7,
      textTransform: "uppercase",
      color: C.cyan,
      display: "flex",
      alignItems: "center",
      gap: 20,
      ...style,
    }}
  >
    <span style={{ width: 56, height: 3, backgroundColor: C.cyan }} />
    {children}
  </div>
);

/** Simple line icons drawn in brand style */
export const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 64,
  color = C.cyan,
}) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, React.ReactNode> = {
    calendar: (
      <>
        <rect x="6" y="10" width="36" height="32" rx="5" {...common} />
        <path d="M6 19h36M15 6v8M33 6v8M17 30l5 5 9-10" {...common} />
      </>
    ),
    snow: (
      <path
        d="M24 4v40M6.7 14l34.6 20M6.7 34l34.6-20M19 8l5 4 5-4M19 40l5-4 5 4M8 21l6-1-2-5M40 27l-6 1 2 5M8 27l6 1-2 5M40 21l-6-1 2-5"
        {...common}
      />
    ),
    sun: (
      <>
        <circle cx="24" cy="24" r="8" {...common} />
        <path
          d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"
          {...common}
        />
      </>
    ),
    scan: (
      <>
        <path d="M6 14V8a2 2 0 012-2h6M34 6h6a2 2 0 012 2v6M42 34v6a2 2 0 01-2 2h-6M14 42H8a2 2 0 01-2-2v-6" {...common} />
        <circle cx="24" cy="16" r="4" {...common} />
        <path d="M17 36v-6a7 7 0 0114 0v6M10 24h28" {...common} />
      </>
    ),
    group: (
      <>
        <circle cx="16" cy="16" r="5" {...common} />
        <circle cx="32" cy="16" r="5" {...common} />
        <path d="M6 38v-3a8 8 0 0116 0v3M26 38v-3a8 8 0 0116 0v3" {...common} />
      </>
    ),
    cup: (
      <>
        <path d="M8 18h26v10a13 13 0 01-26 0V18z" {...common} />
        <path d="M34 21h3a5 5 0 010 10h-4M16 6c-2 3 2 5 0 8M24 6c-2 3 2 5 0 8" {...common} />
      </>
    ),
    person: (
      <>
        <circle cx="24" cy="13" r="7" {...common} />
        <path d="M10 42v-4a14 14 0 0128 0v4" {...common} />
      </>
    ),
    star: (
      <path
        d="M24 5l5.6 11.6 12.7 1.7-9.3 8.8 2.3 12.6L24 33.6l-11.3 6.1 2.3-12.6-9.3-8.8 12.7-1.7z"
        fill={color}
        stroke="none"
      />
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {paths[name]}
    </svg>
  );
};
