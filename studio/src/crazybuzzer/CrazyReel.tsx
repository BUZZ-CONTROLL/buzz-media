import "@fontsource/archivo/800.css";
import "@fontsource/archivo/900.css";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Series, staticFile, useCurrentFrame } from "remotion";

/* CrazyBuzzer social-casino reel — 20 s @30fps, 120 BPM (beat = 15 f).
   Cuts: 90 · 240 · 360 · 480. Feed-safe: content between y=300 and y=1470. */

const HAS_LOGO = true; // set true when public/crazybuzzer/logo.png exists

const C = {
  bg: "#0a0506",
  bg2: "#4a0610",
  pink: "#ff2b3a",
  yellow: "#ffcc00",
  cyan: "#ff7a2e",
  red: "#ff1f3d",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.72)",
  line: "rgba(255,255,255,0.14)",
};
const FONT = "Archivo, sans-serif";
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const pop = (f: number, s: number, d = 12) =>
  interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.7, 0.64, 1) });
const rise = (f: number, s: number, d = 12, y = 50) => {
  const t = p(f, s, d);
  return { opacity: t, translate: `0px ${interpolate(t, [0, 1], [y, 0])}px` };
};

/* ---------------- shared visuals ---------------- */
const Stage: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, ${C.bg2} 0%, ${C.bg} 70%)`, overflow: "hidden" }}>
      {/* rotating light rays */}
      <div
        style={{
          position: "absolute",
          left: -460,
          top: 0,
          width: 2000,
          height: 2000,
          rotate: `${f * 0.4}deg`,
          background: `repeating-conic-gradient(from 0deg at 50% 50%, ${C.pink}14 0deg 8deg, transparent 8deg 22deg)`,
          opacity: 0.9,
        }}
      />
      {/* floating dots */}
      {new Array(40).fill(0).map((_, i) => {
        const col = [C.pink, C.yellow, C.cyan][i % 3];
        const x = random(`x${i}`) * 1080;
        const sp = 0.5 + random(`s${i}`) * 1.4;
        const y = 1920 - ((f * sp * 3 + random(`y${i}`) * 1920) % 2100);
        const sz = 4 + random(`z${i}`) * 8;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: col, boxShadow: `0 0 ${sz * 3}px ${col}`, opacity: 0.7 }} />;
      })}
    </AbsoluteFill>
  );
};

const Confetti: React.FC<{ at: number; x?: number; y?: number; n?: number }> = ({ at, x = 540, y = 900, n = 70 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 55) return null;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const a = random(`ca${at}${i}`) * Math.PI * 2;
        const v = 18 + random(`cv${at}${i}`) * 30;
        const px = x + Math.cos(a) * v * f;
        const py = y + Math.sin(a) * v * f + 0.9 * f * f;
        const col = [C.pink, C.yellow, C.cyan, C.white][i % 4];
        const w = 12 + random(`cw${at}${i}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: w * 0.45,
              background: col,
              rotate: `${f * (8 + i)}deg`,
              opacity: 1 - f / 55,
            }}
          />
        );
      })}
    </>
  );
};

/** Big arcade buzzer button. press: 0..1 */
const Buzzer: React.FC<{ size: number; press: number; glow?: number }> = ({ size, press, glow = 1 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 400 320" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="cap" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ff8a9a" />
        <stop offset="0.45" stopColor={C.red} />
        <stop offset="1" stopColor="#8a0016" />
      </radialGradient>
      <linearGradient id="base" x1="0" x2="1">
        <stop offset="0" stopColor="#1a1a1a" />
        <stop offset="0.5" stopColor="#4a4a4a" />
        <stop offset="1" stopColor="#111" />
      </linearGradient>
      <linearGradient id="ring" x1="0" x2="1">
        <stop offset="0" stopColor="#b88a00" />
        <stop offset="0.5" stopColor={C.yellow} />
        <stop offset="1" stopColor="#b88a00" />
      </linearGradient>
    </defs>
    <ellipse cx="200" cy="270" rx="190" ry="48" fill="#000" opacity="0.5" />
    <path d="M20 200 L20 250 Q200 310 380 250 L380 200 Z" fill="url(#base)" />
    <ellipse cx="200" cy="200" rx="180" ry="50" fill="url(#ring)" />
    <ellipse cx="200" cy="196" rx="150" ry="40" fill="#111" />
    {/* cap moves down when pressed */}
    <g transform={`translate(0 ${press * 40})`}>
      <path d="M60 190 L60 120 Q200 70 340 120 L340 190 Q200 240 60 190 Z" fill="#a00018" />
      <ellipse cx="200" cy="120" rx="140" ry="62" fill="url(#cap)" />
      <ellipse cx="160" cy="98" rx="50" ry="16" fill="rgba(255,255,255,0.45)" />
    </g>
    <ellipse cx="200" cy="140" rx="230" ry="130" fill={C.red} opacity={0.18 * glow} style={{ filter: "blur(30px)" }} />
  </svg>
);

/** Placeholder wordmark (swapped for the real logo via HAS_LOGO) */
const Logo: React.FC<{ width: number }> = ({ width }) =>
  HAS_LOGO ? (
    <Img src={staticFile("crazybuzzer/logo.png")} style={{ width }} />
  ) : (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: width / 6.4,
        lineHeight: 1,
        letterSpacing: -1,
        color: C.white,
        textShadow: `0 0 24px ${C.pink}, 0 4px 0 #7a004a`,
        whiteSpace: "nowrap",
      }}
    >
      CRAZY<span style={{ color: C.yellow, textShadow: `0 0 24px ${C.yellow}, 0 4px 0 #8a6a00` }}>BUZZER</span>
    </div>
  );

const H: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 96, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: size, lineHeight: 1.0, color: C.white, textAlign: "center", textTransform: "uppercase", textShadow: "0 6px 0 rgba(0,0,0,0.35)", ...style }}>
    {children}
  </div>
);

const Coin: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#c99a00" />
    <circle cx="50" cy="50" r="40" fill={C.yellow} stroke="#fff3a0" strokeWidth="3" />
    <path d="M50 22 L56 42 L77 42 L60 54 L66 75 L50 62 L34 75 L40 54 L23 42 L44 42 Z" fill="#c99a00" />
  </svg>
);

/* ---------------- 1 · HOOK (90 f) ---------------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const press = interpolate(f, [10, 15, 24], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = f >= 15 && f < 27 ? Math.sin(f * 3) * (27 - f) * 2 : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, translate: `${shake}px ${-shake * 0.5}px` }}>
      <Stage />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, ...rise(f, 15, 10, 60) }}>
        <H size={84}>Deine Welt.</H>
        <H size={84} style={{ color: C.cyan, marginTop: 6 }}>Deine Spiele.</H>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, scale: String(pop(f, 34, 12)) }}>
        <H size={104} style={{ color: C.yellow, textShadow: `0 0 40px ${C.yellow}88, 0 6px 0 #8a6a00` }}>
          Dein Social
          <br />
          Casino!
        </H>
      </div>
      <div style={{ position: "absolute", left: 540 - 230, top: 1010, scale: String(pop(f, 0, 10)) }}>
        <Buzzer size={460} press={press} glow={1 + press} />
      </div>
      <Confetti at={15} y={1060} />
      <Confetti at={34} y={760} n={50} />
    </AbsoluteFill>
  );
};

/* ---------------- 2 · GAMES (150 f) ---------------- */
const PROVIDERS = ["MERKUR", "GAMOMAT", "PLAY'N GO", "APPARAT", "SPINOMENAL"];
const GAMES = ["Eye of Horus", "Lucky Pharaoh Wild", "Book of Dead", "Fire Joker", "100 Sevens", "Magic Mirror Deluxe", "Ramses Book", "Fruitinator"];
const TILE_COLS = [C.pink, C.yellow, C.cyan, "#ffffff"];

const Games: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [4, 40], [0, 888], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) }));
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 230, lineHeight: 1, color: C.yellow, textShadow: `0 0 50px ${C.yellow}88, 0 8px 0 #8a6a00`, scale: String(f >= 40 && f < 48 ? 1.08 : 1) }}>
          {n}+
        </div>
        <H size={76} style={{ marginTop: -6, ...rise(f, 30, 10, 30) }}>TOP Casino Slots</H>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 850, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        {GAMES.map((g, i) => {
          const t = pop(f, 44 + i * 5, 12);
          const col = TILE_COLS[i % 4];
          return (
            <div
              key={g}
              style={{
                height: 92,
                borderRadius: 18,
                background: `linear-gradient(135deg, ${col}55, ${col}18)`,
                border: `2px solid ${col}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 900,
                color: C.white,
                textAlign: "center",
                opacity: Math.min(1, t * 1.5),
                scale: String(interpolate(t, [0, 1], [0.6, 1])),
                boxShadow: `0 0 24px ${col}55`,
              }}
            >
              {g}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1300, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 22px" }}>
        {PROVIDERS.map((pv, i) => (
          <div key={pv} style={{ fontSize: 30, fontWeight: 900, color: C.muted, letterSpacing: 2, ...rise(f, 90 + i * 4, 10, 20) }}>
            {pv}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 3 · BENEFITS (120 f) ---------------- */
const BEN = [
  { t: "100 % kostenlos", c: C.yellow },
  { t: "Garantiert sicher & fair", c: C.cyan },
  { t: "Exklusive Events & Boni", c: C.pink },
];
const Benefits: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <H size={92} style={{ position: "absolute", left: 80, right: 80, top: 470, ...rise(f, 0, 10, 40) }}>
        Spiel einfach
        <br />
        <span style={{ color: C.pink }}>drauf los!</span>
      </H>
      <div style={{ position: "absolute", left: 80, right: 80, top: 770, display: "flex", flexDirection: "column", gap: 30 }}>
        {BEN.map((b, i) => {
          const s = 15 + i * 15;
          const t = p(f, s, 10);
          return (
            <div
              key={b.t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "30px 34px",
                borderRadius: 26,
                background: "rgba(255,255,255,0.06)",
                border: `3px solid ${b.c}`,
                boxShadow: `0 0 30px ${b.c}44`,
                opacity: t,
                translate: `${interpolate(t, [0, 1], [i % 2 ? 260 : -260, 0])}px 0px`,
              }}
            >
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: b.c, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pop(f, s + 6, 10)) }}>
                <svg width="50" height="50" viewBox="0 0 48 48">
                  <path d="M10 25l9 9 19-20" fill="none" stroke={C.bg} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontSize: 52, fontWeight: 900, color: C.white, lineHeight: 1.05 }}>{b.t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 4 · STARTER PACK (120 f) ---------------- */
const Starter: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 8 && f < 30 ? Math.sin(f * 2.4) * 6 : 0;
  const lid = p(f, 30, 12);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <H size={84} style={{ position: "absolute", left: 80, right: 80, top: 450, ...rise(f, 0, 10, 40) }}>
        Dein Gratis
        <br />
        <span style={{ color: C.yellow, textShadow: `0 0 30px ${C.yellow}88, 0 6px 0 #8a6a00` }}>Startpaket</span>
        <br />
        wartet!
      </H>
      {/* gift box */}
      <div style={{ position: "absolute", left: 540 - 200, top: 1000, width: 400, height: 300, rotate: `${shake}deg`, scale: String(pop(f, 2, 12)) }}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 90, bottom: 0, borderRadius: 18, background: `linear-gradient(160deg, ${C.pink}, #a0005a)`, boxShadow: `0 20px 60px ${C.pink}66` }} />
        <div style={{ position: "absolute", left: 175, width: 50, top: 90, bottom: 0, background: C.yellow }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 40,
            height: 70,
            borderRadius: 14,
            background: `linear-gradient(160deg, #ff5aab, ${C.pink})`,
            translate: `${lid * 160}px ${-lid * 260}px`,
            rotate: `${lid * 35}deg`,
          }}
        >
          <div style={{ position: "absolute", left: 175, width: 50, top: 0, bottom: 0, background: C.yellow }} />
          <div style={{ position: "absolute", left: 140, top: -46, width: 120, height: 60, borderRadius: "50% 50% 0 0", border: `14px solid ${C.yellow}`, borderBottom: "none" }} />
        </div>
      </div>
      {/* coins burst out */}
      {new Array(16).fill(0).map((_, i) => {
        const t = f - 32 - (i % 6);
        if (t < 0) return null;
        const a = -Math.PI / 2 + (random(`ga${i}`) - 0.5) * 1.8;
        const v = 22 + random(`gv${i}`) * 16;
        const x = 540 + Math.cos(a) * v * t - 45;
        const y = 1080 + Math.sin(a) * v * t + 0.75 * t * t;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, rotate: `${t * 14}deg`, opacity: t > 50 ? 0 : 1 }}>
            <Coin size={70 + (i % 3) * 18} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", opacity: lid }}>
        <div style={{ width: 360, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${C.yellow}aa, transparent 70%)`, filter: "blur(10px)" }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 5 · CTA (120 f) ---------------- */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.max(0, Math.sin(((f - 20) / 15) * Math.PI * 2)) * 0.05;
  const press = interpolate(f, [52, 56, 64], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 440 }}>
        <div style={{ scale: String(interpolate(pop(f, 0, 14), [0, 1], [0.4, 1])), filter: "drop-shadow(0 0 40px rgba(255,43,58,0.45))" }}>
          <Logo width={900} />
        </div>
        <div style={{ marginTop: 40, scale: String(pop(f, 16, 12) * pulse) }}>
          <div
            style={{
              padding: "34px 90px",
              borderRadius: 999,
              background: `linear-gradient(180deg, #ff5a6e, ${C.red})`,
              color: C.white,
              fontSize: 70,
              fontWeight: 900,
              fontStyle: "italic",
              letterSpacing: 1,
              boxShadow: `0 10px 0 #8a0016, 0 0 60px ${C.red}aa`,
              translate: `0px ${press * 8}px`,
            }}
          >
            JETZT SPIELEN
          </div>
        </div>
        <div style={{ marginTop: 40, fontSize: 52, fontWeight: 900, color: C.white, ...rise(f, 26, 10, 20) }}>crazybuzzer.com</div>
        <div style={{ marginTop: 16, display: "flex", gap: 16, ...rise(f, 32, 10, 20) }}>
          {["App Store", "Google Play", "Browser"].map((s) => (
            <div key={s} style={{ padding: "12px 22px", borderRadius: 14, border: `2px solid ${C.line}`, background: "rgba(0,0,0,0.4)", fontSize: 28, fontWeight: 800, color: C.white }}>
              {s}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Confetti at={2} y={620} n={80} />
      <Confetti at={56} y={840} n={40} />
    </AbsoluteFill>
  );
};

/* ---------------- persistent layers ---------------- */
const PinnedLogo: React.FC = () => {
  const f = useCurrentFrame();
  const s = pop(f, 0, 10);
  // hide during CTA (big logo there)
  const hide = p(f, 480, 6);
  return (
    <div style={{ position: "absolute", top: 320, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, s * 1.5) * (1 - hide), scale: String(interpolate(s, [0, 1], [0.7, 1])) }}>
      <Logo width={430} />
    </div>
  );
};

const Notice: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      top: 1385,
      padding: "16px 22px",
      borderRadius: 14,
      background: C.white,
      color: "#000",
      fontFamily: FONT,
      display: "flex",
      alignItems: "center",
      gap: 18,
    }}
  >
    <div style={{ flexShrink: 0, width: 66, height: 66, borderRadius: "50%", border: `5px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900 }}>18+</div>
    <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.25 }}>
      Social Casino · Kein Echtgeldspiel
      <div style={{ fontSize: 22, fontWeight: 500, color: "#222" }}>Keine Echtgeldgewinne · Spielen mit Verantwortung</div>
    </div>
  </div>
);

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = [15, 90, 240, 360, 480].reduce((m, c) => Math.max(m, f >= c ? interpolate(f, [c, c + 6], [0.45, 0], { extrapolateRight: "clamp" }) : 0), 0);
  return <AbsoluteFill style={{ background: "#fff", opacity: o }} />;
};

const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ scale: String(interpolate(f, [0, 8], [1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })) }}>{children}</AbsoluteFill>;
};

export const CrazyReel: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Series>
      <Series.Sequence name="Hook" durationInFrames={90}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence name="888+ Slots" durationInFrames={150}>
        <Punch>
          <Games />
        </Punch>
      </Series.Sequence>
      <Series.Sequence name="Vorteile" durationInFrames={120}>
        <Punch>
          <Benefits />
        </Punch>
      </Series.Sequence>
      <Series.Sequence name="Startpaket" durationInFrames={120}>
        <Punch>
          <Starter />
        </Punch>
      </Series.Sequence>
      <Series.Sequence name="CTA" durationInFrames={120}>
        <Punch>
          <Cta />
        </Punch>
      </Series.Sequence>
    </Series>
    <Flash />
    <PinnedLogo />
    <Notice />
  </AbsoluteFill>
);
