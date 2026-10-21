import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Series, staticFile, useCurrentFrame } from "remotion";

/* CrazyBuzzer · Grusel-Halloween Reel. 15 s @30fps, 120 BPM.
   Cuts at 90 · 210 · 330 (= 3.0 s · 7.0 s · 11.0 s), matching audio/halloween_music.py */

const C = {
  night: "#04060c",
  deep: "#0b1220",
  cyan: "#4ee5ff",
  orange: "#ff7a1a",
  amber: "#ffb02e",
  purple: "#8b2cf5",
  slime: "#8dff4f",
  white: "#ffffff",
  grey: "#cfd3dc",
};
const FONT = "Inter, sans-serif";
const GLOW_O = "0 0 10px rgba(255,122,26,0.9), 0 0 26px rgba(255,122,26,0.6), 0 0 54px rgba(255,80,0,0.4)";
const GLOW_C = "0 0 10px rgba(78,229,255,0.85), 0 0 24px rgba(78,229,255,0.5), 0 0 48px rgba(78,229,255,0.35)";
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const pop = (f: number, s: number, d = 12) =>
  interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.7, 0.64, 1) });
const rise = (f: number, s: number, d = 12, y = 50) => {
  const t = p(f, s, d);
  return { opacity: t, translate: `0px ${interpolate(t, [0, 1], [y, 0])}px` };
};

const H: React.FC<{ children: React.ReactNode; size?: number; color?: string; glow?: string; style?: React.CSSProperties }> = ({ children, size = 88, color = C.white, glow, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: -1,
      textTransform: "uppercase",
      textAlign: "center",
      color,
      textShadow: glow ?? "0 4px 18px rgba(0,0,0,0.7)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- spooky building blocks (all original vector art) ---------- */
export const Pumpkin: React.FC<{ size: number; glow?: number; grin?: number }> = ({ size, glow = 1, grin = 1 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 200 180" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${18 * glow}px rgba(255,122,26,${0.7 * glow}))` }}>
    <defs>
      <radialGradient id="pg" cx="45%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#ffb347" />
        <stop offset="60%" stopColor="#f26b0f" />
        <stop offset="100%" stopColor="#a33a00" />
      </radialGradient>
    </defs>
    <path d="M96 30 C94 14 102 4 114 2 L118 10 C110 12 106 20 106 32 Z" fill="#3d6b1f" />
    <ellipse cx="60" cy="100" rx="52" ry="68" fill="url(#pg)" />
    <ellipse cx="140" cy="100" rx="52" ry="68" fill="url(#pg)" />
    <ellipse cx="100" cy="100" rx="58" ry="74" fill="url(#pg)" />
    <path d="M100 30 C88 70 88 130 100 172 M100 30 C112 70 112 130 100 172" stroke="#b84a05" strokeWidth="3" fill="none" opacity="0.6" />
    {/* glowing face */}
    <g fill="#ffe36b" opacity={0.6 + 0.4 * glow}>
      <path d="M58 78 L80 70 L74 96 Z" />
      <path d="M142 78 L120 70 L126 96 Z" />
      <path d="M92 104 L100 92 L108 104 Z" />
      <path d={`M54 118 Q100 ${150 + 10 * grin} 146 118 L134 124 L126 116 L116 128 L106 118 L94 130 L84 118 L74 128 L66 118 Z`} />
    </g>
  </svg>
);

export const Bat: React.FC<{ size: number; flap: number }> = ({ size, flap }) => {
  const w = 30 + flap * 18;
  return (
    <svg width={size} height={size * 0.6} viewBox="-60 -30 120 70">
      <path d={`M0 0 C-10 -8 -20 -${w * 0.3} -${w + 20} -${w * 0.5} C-40 -6 -36 4 -30 12 C-24 4 -18 6 -12 12 C-8 6 -4 6 0 10 C4 6 8 6 12 12 C18 6 24 4 30 12 C36 4 40 -6 ${w + 20} -${w * 0.5} C20 -${w * 0.3} 10 -8 0 0 Z`} fill="#0a0612" />
      <circle cx="-4" cy="2" r="2" fill="#ff3b3b" />
      <circle cx="4" cy="2" r="2" fill="#ff3b3b" />
    </svg>
  );
};

export const Ghost: React.FC<{ size: number; f: number }> = ({ size, f }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ filter: "drop-shadow(0 0 22px rgba(200,230,255,0.6))" }}>
    <path d={`M10 60 C10 20 90 20 90 60 L90 112 L78 ${102 + Math.sin(f / 4) * 4} L66 112 L54 ${102 + Math.sin(f / 4 + 1) * 4} L42 112 L30 ${102 + Math.sin(f / 4 + 2) * 4} L18 112 L10 104 Z`} fill="rgba(235,245,255,0.92)" />
    <ellipse cx="36" cy="58" rx="7" ry="10" fill="#0b1220" />
    <ellipse cx="64" cy="58" rx="7" ry="10" fill="#0b1220" />
    <ellipse cx="50" cy="80" rx="8" ry={6 + Math.abs(Math.sin(f / 6)) * 4} fill="#0b1220" />
  </svg>
);

export const Web: React.FC<{ size: number; flip?: boolean }> = ({ size, flip }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ transform: flip ? "scaleX(-1)" : undefined, opacity: 0.55 }}>
    <g stroke="#d9e2ff" strokeWidth="1.6" fill="none">
      {[0, 18, 36, 54, 72, 90].map((a) => (
        <line key={a} x1="0" y1="0" x2={200 * Math.cos((a * Math.PI) / 180)} y2={200 * Math.sin((a * Math.PI) / 180)} />
      ))}
      {[40, 80, 120, 160].map((r) => (
        <path key={r} d={[0, 18, 36, 54, 72, 90].map((a, i) => `${i ? "Q" : "M"}${i ? `${(r - 8) * Math.cos(((a - 9) * Math.PI) / 180)} ${(r - 8) * Math.sin(((a - 9) * Math.PI) / 180)} ` : ""}${r * Math.cos((a * Math.PI) / 180)} ${r * Math.sin((a * Math.PI) / 180)}`).join(" ")} />
      ))}
    </g>
  </svg>
);

/* night sky with moon, drifting fog, bats, lightning */
export const Night: React.FC<{ moonY?: number; lightning?: number[] }> = ({ moonY = 60, lightning = [] }) => {
  const f = useCurrentFrame();
  const flash = lightning.reduce((m, c) => Math.max(m, f >= c ? interpolate(f, [c, c + 2, c + 4, c + 6, c + 12], [0, 0.85, 0.2, 0.6, 0], { extrapolateRight: "clamp" }) : 0), 0);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #120a26 0%, ${C.deep} 40%, ${C.night} 100%)`, overflow: "hidden" }}>
      {new Array(60).fill(0).map((_, i) => {
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / (9 + (i % 7)) + i));
        return <div key={i} style={{ position: "absolute", left: random(`hx${i}`) * 1080, top: random(`hy${i}`) * 1100, width: 2.5, height: 2.5, borderRadius: "50%", background: "#fff", opacity: tw * 0.6 }} />;
      })}
      {/* moon */}
      <div style={{ position: "absolute", left: 50, top: moonY, width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle at 40% 38%, #fff7d6 0%, #ffe39a 45%, #f2b84b 100%)", boxShadow: "0 0 90px 30px rgba(255,214,120,0.35)" }} />
      <div style={{ position: "absolute", left: 20, top: moonY - 30, width: 290, height: 290, borderRadius: "50%", background: "radial-gradient(circle, transparent 55%, rgba(255,200,100,0.12) 70%, transparent 80%)" }} />
      {/* bats crossing the moon */}
      {new Array(7).fill(0).map((_, i) => {
        const sp = 3 + random(`bs${i}`) * 4;
        const x = ((random(`bx${i}`) * 1400 + f * sp) % 1500) - 200;
        const y = 120 + random(`by${i}`) * 520 + Math.sin(f / 7 + i) * 26;
        const s = 60 + random(`bz${i}`) * 70;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y }}>
            <Bat size={s} flap={Math.abs(Math.sin(f / 2.2 + i))} />
          </div>
        );
      })}
      {/* graveyard silhouette */}
      <svg width="1080" height="420" viewBox="0 0 1080 420" style={{ position: "absolute", left: 0, bottom: 0 }}>
        <path d="M0 260 Q140 210 300 250 T620 240 T1080 230 L1080 420 L0 420 Z" fill="#05040a" />
        {[80, 230, 820, 960].map((x, i) => (
          <path key={x} d={`M${x} ${270 - (i % 2) * 20} l0 -70 q35 -40 70 0 l0 70 z`} fill="#0b0a14" stroke="#2a2340" strokeWidth="3" />
        ))}
        <path d="M470 250 L470 120 M440 160 L500 160" stroke="#0b0a14" strokeWidth="18" strokeLinecap="round" />
        <path d="M640 260 C650 180 600 140 560 110 M640 210 C680 180 720 175 740 150 M610 170 C590 150 560 160 540 150" stroke="#05040a" strokeWidth="12" fill="none" strokeLinecap="round" />
      </svg>
      {/* fog */}
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: -400 + ((f * (1.2 + k * 0.6) + k * 300) % 600),
            bottom: 60 + k * 120,
            width: 2000,
            height: 360,
            background: "radial-gradient(ellipse at 50% 50%, rgba(170,150,220,0.22) 0%, rgba(120,110,170,0.08) 45%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
      ))}
      <AbsoluteFill style={{ background: "#dfe8ff", opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

const Embers: React.FC<{ at: number; x: number; y: number; n?: number }> = ({ at, x, y, n = 44 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 42) return null;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const a = random(`ea${at}${i}`) * Math.PI * 2;
        const v = 12 + random(`ev${at}${i}`) * 22;
        const col = [C.orange, C.amber, C.purple, C.slime][i % 4];
        const s = 5 + random(`es${at}${i}`) * 9;
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * v * f, top: y + Math.sin(a) * v * f + 0.45 * f * f, width: s, height: s, borderRadius: "50%", background: col, boxShadow: `0 0 ${s * 2}px ${col}`, opacity: 1 - f / 42 }} />;
      })}
    </>
  );
};

/* ---------- 1 · HOOK (0–90) ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const press = interpolate(f, [30, 35, 44], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shiver = f < 30 ? Math.sin(f * 1.7) * 3 : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night lightning={[2, 30]} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 450, translate: `${shiver}px 0px`, ...rise(f, 4, 12, 40) }}>
        <H size={70} color={C.grey}>Traust du dich?</H>
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 560, scale: String(pop(f, 34, 14)) }}>
        <H size={128} color={C.orange} glow={GLOW_O} style={{ letterSpacing: -3 }}>
          Grusel-
          <br />
          Halloween
        </H>
      </div>
      <div style={{ position: "absolute", left: 540 - 150, top: 920, width: 300, height: 300, scale: String(pop(f, 6, 12) * (1 - press * 0.12)), filter: `drop-shadow(0 0 ${30 + press * 60}px rgba(255,122,26,0.9)) hue-rotate(${press * 160}deg)` }}>
        <Img src={staticFile("crazybuzzer/buzzer_btn.webp")} style={{ width: 300, height: 300 }} />
      </div>
      <Embers at={35} x={540} y={1070} n={56} />
      <div style={{ position: "absolute", left: 90, top: 1120, scale: String(pop(f, 40, 12)) }}>
        <Pumpkin size={170} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 5))} />
      </div>
      <div style={{ position: "absolute", right: 90, top: 1130, scale: String(pop(f, 46, 12)) }}>
        <Pumpkin size={150} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 4 + 1))} grin={0.5} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2 · SLOTS (90–210) ---------- */
const TILES = [
  ["tile_0182f7a74_merkur_magic_mirror_deluxe_2x2.webp", "Magic Mirror Deluxe"],
  ["tile_abde4df31_merkur_eye_of_horus_2x2.webp", "Eye of Horus"],
  ["tile_1b3be6b4f_merkur_dragons_treasure_2x2.webp", "Dragons Treasure"],
  ["tile_55082e12f_merkur_lucky_pharaoh_wild_2x2.webp", "Lucky Pharaoh Wild"],
];
const Slots: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night lightning={[60]} />
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <Web size={260} />
      </div>
      <div style={{ position: "absolute", right: 0, top: 0 }}>
        <Web size={260} flip />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 450 }}>
        <H size={84} style={rise(f, 0, 10, 40)}>
          Schaurig
        </H>
        <H size={96} color={C.slime} glow="0 0 12px rgba(141,255,79,0.8), 0 0 32px rgba(141,255,79,0.45)" style={{ marginTop: 4, ...rise(f, 6, 10, 40) }}>
          gute Slots
        </H>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 760, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24 }}>
        {TILES.map(([src, name], i) => {
          const t = pop(f, 16 + i * 8, 12);
          const flick = 0.75 + 0.25 * Math.abs(Math.sin(f / 3 + i * 2));
          const col = i % 2 ? C.purple : C.orange;
          return (
            <div key={src} style={{ position: "relative", height: 200, borderRadius: 22, overflow: "hidden", border: `4px solid ${col}`, boxShadow: `0 0 ${30 * flick}px ${col}`, opacity: Math.min(1, t * 1.5), scale: String(interpolate(t, [0, 1], [0.6, 1])), rotate: `${interpolate(t, [0, 1], [i % 2 ? 8 : -8, 0])}deg` }}>
              <Img src={staticFile(`crazybuzzer/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.15) contrast(1.05)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(40,0,60,0.75), rgba(0,0,0,0) 55%)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, color: C.white, fontSize: 28, fontWeight: 800, textAlign: "center" }}>{name}</div>
            </div>
          );
        })}
      </div>
      {/* ghost floats through */}
      <div style={{ position: "absolute", left: interpolate(f, [40, 120], [-220, 1140]), top: 1230 + Math.sin(f / 6) * 30, opacity: p(f, 40, 8) }}>
        <Ghost size={170} f={f} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3 · MESSAGE (210–330) ---------- */
const LINES = ["Gruselige Stimmung", "Schaurig schöne Slots", "100% kostenlos spielen"];
const Message: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 4 && f < 16 ? Math.sin(f * 2.6) * 6 : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night lightning={[4]} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 450, translate: `${shake}px 0px` }}>
        <H size={104} color={C.orange} glow={GLOW_O} style={{ scale: String(pop(f, 2, 12)) }}>
          Happy
          <br />
          Halloween!
        </H>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 760, display: "flex", flexDirection: "column", gap: 28 }}>
        {LINES.map((b, i) => {
          const s = 18 + i * 15;
          const t = p(f, s, 10);
          return (
            <div
              key={b}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "24px 30px",
                borderRadius: 999,
                background: "rgba(14,6,26,0.78)",
                border: `2px solid ${C.orange}`,
                boxShadow: "0 0 24px rgba(255,122,26,0.45), inset 0 0 18px rgba(139,44,245,0.25)",
                opacity: t,
                translate: `${interpolate(t, [0, 1], [i % 2 ? 260 : -260, 0])}px 0px`,
              }}
            >
              <div style={{ flexShrink: 0, scale: String(pop(f, s + 6, 10)) }}>
                <Pumpkin size={70} glow={0.7} />
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, color: C.white, textTransform: "uppercase", lineHeight: 1.05 }}>{b}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 70, top: 1230, opacity: p(f, 70, 10), rotate: `${Math.sin(f / 8) * 6}deg` }}>
        <Ghost size={130} f={f} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4 · CTA (330–450) ---------- */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const press = interpolate(f, [56, 60, 68], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.max(0, Math.sin(((f - 20) / 15) * Math.PI * 2)) * 0.04;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 420 }}>
        <div style={{ scale: String(interpolate(pop(f, 0, 14), [0, 1], [0.4, 1])), filter: "drop-shadow(0 0 30px rgba(255,122,26,0.55))" }}>
          <Img src={staticFile("crazybuzzer/logo.webp")} style={{ width: 760 }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 150, top: 770, width: 300, height: 300, scale: String(pop(f, 14, 12) * pulse * (1 - press * 0.12)), filter: `drop-shadow(0 0 ${30 + press * 60}px rgba(78,229,255,0.85))` }}>
        <Img src={staticFile("crazybuzzer/buzzer_btn.webp")} style={{ width: 300, height: 300 }} />
      </div>
      <Embers at={60} x={540} y={920} n={50} />
      <div style={{ position: "absolute", left: 70, top: 840, scale: String(pop(f, 24, 12)) }}>
        <Pumpkin size={150} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 5))} />
      </div>
      <div style={{ position: "absolute", right: 70, top: 850, scale: String(pop(f, 28, 12)) }}>
        <Pumpkin size={140} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 4 + 2))} grin={0.4} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", ...rise(f, 26, 10, 20) }}>
        <div style={{ fontSize: 58, fontWeight: 900, color: C.white, textShadow: GLOW_C }}>crazybuzzer.com</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, color: C.orange, letterSpacing: 3, textShadow: GLOW_O }}>JETZT GRATIS SPIELEN</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", gap: 16, ...rise(f, 32, 10, 20) }}>
        {["App Store", "Google Play", "Browser"].map((s) => (
          <div key={s} style={{ padding: "14px 24px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.4)", background: "#000", fontSize: 30, fontWeight: 800, color: C.white }}>
            {s}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- persistent layers ---------- */
const PinnedLogo: React.FC = () => {
  const f = useCurrentFrame();
  const s = pop(f, 0, 10);
  const hide = p(f, 330, 6);
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, s * 1.5) * (1 - hide), scale: String(interpolate(s, [0, 1], [0.7, 1])) }}>
      <Img src={staticFile("crazybuzzer/logo.webp")} style={{ width: 360 }} />
    </div>
  );
};

const Notice: React.FC = () => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 1395, padding: "14px 22px", borderRadius: 16, background: "rgba(10,6,20,0.9)", border: `2px solid ${C.orange}`, boxShadow: "0 0 18px rgba(255,122,26,0.4)", color: C.white, fontFamily: FONT, display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", border: `4px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, fontWeight: 900 }}>18+</div>
    <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.25 }}>
      Social Casino · Kein Echtgeldspiel
      <div style={{ fontSize: 21, fontWeight: 500, color: C.grey }}>Keine Echtgeldgewinne · Spielen mit Verantwortung</div>
    </div>
  </div>
);

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = [35, 90, 210, 330, 390].reduce((m, c) => Math.max(m, f >= c ? interpolate(f, [c, c + 6], [0.45, 0], { extrapolateRight: "clamp" }) : 0), 0);
  return <AbsoluteFill style={{ background: C.orange, opacity: o, mixBlendMode: "screen" }} />;
};

const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ scale: String(interpolate(f, [0, 8], [1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })) }}>{children}</AbsoluteFill>;
};

const Vignette: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />;

export const CrazyHalloween: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Series>
      <Series.Sequence name="Hook" durationInFrames={90}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence name="Slots" durationInFrames={120}>
        <Punch>
          <Slots />
        </Punch>
      </Series.Sequence>
      <Series.Sequence name="Message" durationInFrames={120}>
        <Punch>
          <Message />
        </Punch>
      </Series.Sequence>
      <Series.Sequence name="CTA" durationInFrames={120}>
        <Punch>
          <Cta />
        </Punch>
      </Series.Sequence>
    </Series>
    <Vignette />
    <Flash />
    <PinnedLogo />
    <Notice />
  </AbsoluteFill>
);
