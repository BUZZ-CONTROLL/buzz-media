import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, pop, prog } from "./theme";

/** Dark navy backdrop with a faint court grid and two slow glows. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 2px, transparent 2px), linear-gradient(90deg, ${C.line} 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0px ${frame * 0.6}px`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.blue}33 0%, transparent 65%)`,
          left: -420 + Math.sin(frame / 40) * 60,
          top: -300 + Math.cos(frame / 50) * 60,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.purple}22 0%, transparent 65%)`,
          right: -500 + Math.cos(frame / 45) * 60,
          bottom: -400 + Math.sin(frame / 55) * 60,
        }}
      />
    </AbsoluteFill>
  );
};

/** Logo mark: lime buzzer button with pulsing "buzz" rings. */
export const LogoMark: React.FC<{ size: number; delay?: number }> = ({
  size,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const f = frame - delay;
  const s = pop(frame, delay, 18);
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        scale: String(s),
      }}
    >
      {[0, 1, 2].map((i) => {
        const t = ((Math.max(0, f) + i * 14) % 42) / 42;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: size * 0.28,
              border: `${size * 0.035}px solid ${C.blue}`,
              scale: String(1 + t * 0.9),
              opacity: f < 0 ? 0 : (1 - t) * 0.7,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size * 0.24,
          background: `linear-gradient(145deg, ${C.blueLight}, ${C.blue} 55%, #0b7fc0)`,
          boxShadow: `0 0 ${size * 0.5}px ${C.blue}88`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24">
          <path
            d="M13.5 2 L4.5 13.5 H11 L10 22 L19.5 10 H13 Z"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export const Wordmark: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: -size * 0.03,
      color: C.text,
      lineHeight: 1,
    }}
  >
    Match<span style={{ color: C.blue }}>Buzzer</span>
  </div>
);

/** "1 · Plätze" chip + headline used at the top of each step scene. */
export const StepHeader: React.FC<{
  step: string;
  label: string;
  color: string;
  children: React.ReactNode;
}> = ({ step, label, color, children }) => {
  const frame = useCurrentFrame();
  const chip = prog(frame, 0, 16);
  const head = prog(frame, 5, 20);
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 90,
        right: 90,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 18,
          padding: "16px 30px",
          borderRadius: 999,
          backgroundColor: `${color}22`,
          border: `3px solid ${color}`,
          color,
          fontSize: 44,
          fontWeight: 800,
          opacity: chip,
          translate: `${interpolate(chip, [0, 1], [-60, 0])}px 0px`,
        }}
      >
        <span
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: color,
            color: C.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
          }}
        >
          {step}
        </span>
        {label}
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: -3,
          color: C.text,
          opacity: head,
          translate: `0px ${interpolate(head, [0, 1], [50, 0])}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
