import React from "react";
import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, GOLD } from "../slotmagie/theme";

export const goldText: React.CSSProperties = {
  backgroundImage: GOLD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
export const goldShadow = "drop-shadow(0 5px 0 #6b3d00) drop-shadow(0 0 30px rgba(246,197,68,0.5))";

/** Black top hat with gold band, seen slightly from above. Origin = bottom centre. */
export const TopHat: React.FC<{ width: number; glow?: number }> = ({ width, glow = 0 }) => {
  const h = width * 0.95;
  return (
    <svg width={width} height={h} viewBox="0 0 400 380" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="hatBody" x1="0" x2="1">
          <stop offset="0" stopColor="#050505" />
          <stop offset="0.35" stopColor="#2a2a2a" />
          <stop offset="0.55" stopColor="#141414" />
          <stop offset="1" stopColor="#030303" />
        </linearGradient>
        <linearGradient id="band" x1="0" x2="1">
          <stop offset="0" stopColor="#8a5a06" />
          <stop offset="0.4" stopColor="#ffe08a" />
          <stop offset="0.6" stopColor="#f6c544" />
          <stop offset="1" stopColor="#8a5a06" />
        </linearGradient>
        <radialGradient id="opening" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4c2" stopOpacity={0.95 * glow} />
          <stop offset="0.5" stopColor="#f6c544" stopOpacity={0.6 * glow} />
          <stop offset="1" stopColor="#000" stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* brim back */}
      <ellipse cx="200" cy="330" rx="195" ry="44" fill="#0c0c0c" stroke="#3a3a3a" strokeWidth="3" />
      {/* body (opening at top, seen from above) */}
      <path d="M85 60 L105 320 Q200 350 295 320 L315 60 Z" fill="url(#hatBody)" />
      <path d="M100 255 L106 300 Q200 328 294 300 L300 255 Q200 282 100 255 Z" fill="url(#band)" />
      {/* opening ellipse */}
      <ellipse cx="200" cy="60" rx="115" ry="32" fill="url(#opening)" stroke="#444" strokeWidth="3" />
      {/* brim front */}
      <path d="M5 330 Q200 400 395 330 Q380 360 200 372 Q20 360 5 330 Z" fill="#161616" />
      {/* specular */}
      <path d="M135 75 L150 300" stroke="rgba(255,255,255,0.12)" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
};

/** Magic wand. Rotation around the handle end (left). tip at right. */
export const Wand: React.FC<{ length: number }> = ({ length }) => (
  <svg width={length} height={40} viewBox="0 0 400 40" style={{ overflow: "visible" }}>
    <rect x="0" y="12" width="330" height="16" rx="8" fill="#0d0d0d" stroke="#555" strokeWidth="2" />
    <rect x="330" y="11" width="70" height="18" rx="9" fill="#fffaf0" />
    <rect x="300" y="12" width="12" height="16" fill="#f6c544" />
    <circle cx="400" cy="20" r="10" fill="#fff8dc" style={{ filter: "drop-shadow(0 0 12px #fff4c2)" }} />
  </svg>
);

/** Burst of sparkles centred at (x,y), starting at frame `at` */
export const Burst: React.FC<{ x: number; y: number; at: number; n?: number; spread?: number; seed?: string }> = ({
  x,
  y,
  at,
  n = 26,
  spread = 260,
  seed = "b",
}) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 40) return null;
  const t = f / 40;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const r = (0.35 + random(`${seed}r${i}`) * 0.65) * spread * (1 - Math.pow(1 - t, 3));
        const size = 6 + random(`${seed}s${i}`) * 14;
        const star = i % 3 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * r - size / 2,
              top: y + Math.sin(a) * r - size / 2 + t * t * 60,
              width: size,
              height: size,
              opacity: 1 - t,
              rotate: `${f * 12}deg`,
            }}
          >
            {star ? (
              <svg width={size} height={size} viewBox="-10 -10 20 20">
                <path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill="#fff4c2" />
              </svg>
            ) : (
              <div style={{ width: size * 0.6, height: size * 0.6, borderRadius: "50%", background: C.gold2, boxShadow: `0 0 ${size}px ${C.gold2}` }} />
            )}
          </div>
        );
      })}
    </>
  );
};

/** Playing card with back (red, sun) and front (custom). flip: 0 = back visible, 1 = front visible */
export const MagicCard: React.FC<{
  width: number;
  flip: number;
  front: React.ReactNode;
  variant: "gold" | "red";
}> = ({ width, flip, front, variant }) => {
  const h = width * 1.42;
  const angle = interpolate(flip, [0, 1], [180, 0]);
  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 30,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    overflow: "hidden",
  };
  return (
    <div style={{ width, height: h, perspective: 1400 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `rotateY(${angle}deg)` }}>
        {/* front */}
        <div
          style={{
            ...face,
            background:
              variant === "gold"
                ? "linear-gradient(160deg, #fff1b8 0%, #f6c544 35%, #c98a12 70%, #f6c544 100%)"
                : "linear-gradient(160deg, #ff4d4d 0%, #da0e17 45%, #7a0008 100%)",
            border: `6px solid ${variant === "gold" ? "#fff4c2" : "#f6c544"}`,
            boxShadow: `0 30px 70px rgba(0,0,0,0.7), 0 0 60px ${variant === "gold" ? "#f6c54488" : "#da0e1788"}`,
          }}
        >
          <div style={{ position: "absolute", inset: 14, borderRadius: 20, border: `2px solid ${variant === "gold" ? "rgba(90,50,0,0.45)" : "rgba(255,230,150,0.6)"}` }} />
          {front}
        </div>
        {/* back */}
        <div
          style={{
            ...face,
            transform: "rotateY(180deg)",
            background: "repeating-linear-gradient(45deg, #8f0008 0 18px, #b0000c 18px 36px)",
            border: "6px solid #f6c544",
            boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: width * 0.62, height: width * 0.62, borderRadius: "50%", background: "#0b0b0b", border: "5px solid #f6c544", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img src={staticFile("slotmagie/sun.png")} style={{ width: width * 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardFront: React.FC<{ big: string; mid: string; small: string; dark?: boolean }> = ({ big, mid, small, dark }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      fontFamily: FONT,
      color: dark ? "#2a1600" : C.white,
      padding: "0 18px",
    }}
  >
    <div style={{ fontSize: big.length > 3 ? 124 : 150, whiteSpace: "nowrap", fontWeight: 900, fontStyle: "italic", lineHeight: 0.95, letterSpacing: -4, textShadow: dark ? "0 4px 0 rgba(255,255,255,0.4)" : "0 6px 0 rgba(0,0,0,0.35)" }}>{big}</div>
    <div style={{ marginTop: 10, fontSize: 52, fontWeight: 900, lineHeight: 1.0 }}>{mid}</div>
    <div style={{ marginTop: 24, padding: "10px 20px", borderRadius: 12, background: dark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.4)", color: dark ? C.gold1 : C.white, fontSize: 26, fontWeight: 700, whiteSpace: "nowrap" }}>
      {small}
    </div>
  </div>
);
