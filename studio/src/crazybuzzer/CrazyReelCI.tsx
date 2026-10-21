import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Loop, OffthreadVideo, random, Series, staticFile, useCurrentFrame } from "remotion";

/* CrazyBuzzer reel in the NEW CI (crazybuzzer.com, Oct 2026).
   20 s @30fps, 120 BPM. Cuts 90 · 240 · 360 · 480 (timings identical to the music track). */

const C = {
  night: "#05080f",
  deep: "#0a1c2d",
  mid: "#133d52",
  cyan: "#4ee5ff",
  cyan2: "#22d3ee",
  aqua: "#00f6ff",
  sky: "#38bdf8",
  btnA: "#1696b9",
  btnB: "#2a5d7c",
  pink: "#ff4fd8",
  violet: "#a855f7",
  white: "#ffffff",
  grey: "#d1d1d1",
};
const FONT = "Inter, sans-serif";
const GLOW = `0 0 10px rgba(34,211,238,0.85), 0 0 24px rgba(34,211,238,0.5), 0 0 48px rgba(34,211,238,0.35)`;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const pop = (f: number, s: number, d = 12) =>
  interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.7, 0.64, 1) });
const rise = (f: number, s: number, d = 12, y = 50) => {
  const t = p(f, s, d);
  return { opacity: t, translate: `0px ${interpolate(t, [0, 1], [y, 0])}px` };
};

const H: React.FC<{ children: React.ReactNode; size?: number; color?: string; glow?: boolean; style?: React.CSSProperties }> = ({
  children,
  size = 88,
  color = C.white,
  glow = false,
  style,
}) => (
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
      textShadow: glow ? GLOW : "0 4px 18px rgba(0,0,0,0.6)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- background: night gradient + looping hero video band ---------- */
const HeroBand: React.FC<{ top: number; height?: number; dim?: number; cropX?: number }> = ({ top, height = 940, dim = 0, cropX = 0.64 }) => {
  // source 2560x600; scale to band height, then shift so the sphere (~x 0.64) sits centred
  const scale = height / 600;
  const w = 2560 * scale;
  const left = 540 - w * cropX;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height, overflow: "hidden", mixBlendMode: "screen", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 75%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 75%, transparent 100%)" }}>
      <div style={{ position: "absolute", left, top: 0, width: w, height }}>
        <Loop durationInFrames={240}>
          <OffthreadVideo src={staticFile("crazybuzzer/sphere.mp4")} muted style={{ width: w, height }} />
        </Loop>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />
    </div>
  );
};

const Night: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.night} 0%, ${C.deep} 45%, ${C.night} 100%)`, overflow: "hidden" }}>
      {/* stars */}
      {new Array(70).fill(0).map((_, i) => {
        const x = random(`sx${i}`) * 1080;
        const y = random(`sy${i}`) * 1920;
        const s = 1 + random(`ss${i}`) * 2.5;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / (10 + (i % 7)) + i));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: tw * 0.7 }} />;
      })}
      {/* neon floor lines */}
      <div style={{ position: "absolute", left: -200, right: -200, bottom: 0, height: 700, background: `radial-gradient(ellipse at 50% 100%, ${C.mid} 0%, transparent 70%)`, opacity: 0.8 }} />
    </AbsoluteFill>
  );
};

const NeonLine: React.FC<{ top: number; f: number; start: number }> = ({ top, f, start }) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      right: 90,
      top,
      height: 3,
      background: `linear-gradient(90deg, transparent, ${C.cyan} 50%, transparent)`,
      boxShadow: `0 0 18px ${C.cyan}`,
      scale: `${p(f, start, 14)} 1`,
    }}
  />
);

const Sparks: React.FC<{ at: number; x: number; y: number; n?: number }> = ({ at, x, y, n = 40 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 40) return null;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const a = random(`pa${at}${i}`) * Math.PI * 2;
        const v = 14 + random(`pv${at}${i}`) * 22;
        const col = [C.cyan, C.aqua, C.pink, C.white][i % 4];
        const s = 5 + random(`ps${at}${i}`) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * v * f,
              top: y + Math.sin(a) * v * f + 0.5 * f * f,
              width: s,
              height: s,
              borderRadius: "50%",
              background: col,
              boxShadow: `0 0 ${s * 2}px ${col}`,
              opacity: 1 - f / 40,
            }}
          />
        );
      })}
    </>
  );
};

/* ---------- 1 · HOOK (90 f) ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const press = interpolate(f, [10, 15, 24], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night />
      <HeroBand top={640} height={940} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 450, ...rise(f, 2, 12, 40) }}>
        <H size={72}>Deine Welt.<br />Deine Spiele.</H>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 615, scale: String(pop(f, 30, 14)) }}>
        <H size={86} color={C.cyan} glow style={{ whiteSpace: "nowrap" }}>
          Dein Social Casino!
        </H>
      </div>
      {/* JETZT SPIELEN buzzer pressed at frame 15 */}
      <div
        style={{
          position: "absolute",
          left: 540 - 170,
          top: 1010,
          width: 340,
          height: 340,
          scale: String(pop(f, 0, 12) * (1 - press * 0.12)),
          filter: `drop-shadow(0 0 ${30 + press * 50}px rgba(78,229,255,0.8))`,
        }}
      >
        <Img src={staticFile("crazybuzzer/buzzer_btn.webp")} style={{ width: 340, height: 340 }} />
      </div>
      <Sparks at={15} x={540} y={1180} n={50} />
    </AbsoluteFill>
  );
};

/* ---------- 2 · GAMES (150 f) ---------- */
const TILES = [
  ["tile_abde4df31_merkur_eye_of_horus_2x2.webp", "Eye of Horus"],
  ["tile_55082e12f_merkur_lucky_pharaoh_wild_2x2.webp", "Lucky Pharaoh Wild"],
  ["tile_0182f7a74_merkur_magic_mirror_deluxe_2x2.webp", "Magic Mirror Deluxe"],
  ["tile_1b3be6b4f_merkur_dragons_treasure_2x2.webp", "Dragons Treasure"],
  ["tile_404b6301a_merkur_el_torero_2x2.webp", "El Torero"],
  ["tile_11eed89a7_merkur_BlazingStar_2x2.webp", "Blazing Star"],
];
const PROVIDERS = ["MERKUR", "GAMOMAT", "PLAY'N GO", "APPARAT", "SPINOMENAL"];

const Games: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [4, 40], [0, 888], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) }));
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night />
      <div style={{ position: "absolute", left: 0, right: 0, top: 460 }}>
        <H size={200} color={C.cyan} glow style={{ letterSpacing: -6, lineHeight: 1 }}>
          {n}+
        </H>
        <H size={64} style={{ marginTop: 6, ...rise(f, 30, 10, 30) }}>
          Top Casino Slots
        </H>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 845, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 22 }}>
        {TILES.map(([src, name], i) => {
          const t = pop(f, 44 + i * 5, 12);
          return (
            <div
              key={src}
              style={{
                position: "relative",
                height: 160,
                borderRadius: 20,
                overflow: "hidden",
                border: `3px solid ${C.cyan}`,
                boxShadow: `0 0 26px rgba(34,211,238,0.55)`,
                opacity: Math.min(1, t * 1.5),
                scale: String(interpolate(t, [0, 1], [0.6, 1])),
              }}
            >
              <Img src={staticFile(`crazybuzzer/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "26px 14px 10px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.1), rgba(0,0,0,0))",
                  color: C.white,
                  fontSize: 26,
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                {name}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 768, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 22px" }}>
        {PROVIDERS.map((pv, i) => (
          <div key={pv} style={{ fontSize: 28, fontWeight: 900, color: C.cyan2, letterSpacing: 2, ...rise(f, 90 + i * 4, 10, 20) }}>
            {pv}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3 · BENEFITS (120 f) ---------- */
const BEN = ["100% kostenlos", "Garantiert sicher & fair", "Exklusive Events & Boni"];
const Benefits: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night />
      <HeroBand top={520} height={1000} dim={0.55} cropX={0.42} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 470 }}>
        <H size={84} style={rise(f, 0, 10, 40)}>
          Spiel einfach
        </H>
        <H size={96} color={C.cyan} glow style={{ marginTop: 6, ...rise(f, 6, 10, 40) }}>
          drauf los!
        </H>
      </div>
      <NeonLine top={720} f={f} start={8} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 780, display: "flex", flexDirection: "column", gap: 30 }}>
        {BEN.map((b, i) => {
          const s = 15 + i * 15;
          const t = p(f, s, 10);
          return (
            <div
              key={b}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "28px 32px",
                borderRadius: 999,
                background: "rgba(3,15,28,0.72)",
                border: `2px solid ${C.cyan}`,
                boxShadow: `0 0 24px rgba(34,211,238,0.45), inset 0 0 18px rgba(34,211,238,0.15)`,
                opacity: t,
                translate: `${interpolate(t, [0, 1], [i % 2 ? 260 : -260, 0])}px 0px`,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: `linear-gradient(180deg, ${C.btnA}, ${C.btnB})`,
                  border: `2px solid ${C.cyan}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: String(pop(f, s + 6, 10)),
                }}
              >
                <svg width="44" height="44" viewBox="0 0 48 48">
                  <path d="M10 25l9 9 19-20" fill="none" stroke={C.white} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: C.white, textTransform: "uppercase", lineHeight: 1.05 }}>{b}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4 · STARTER PACK (120 f) ---------- */
const Starter: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 8 && f < 30 ? Math.sin(f * 2.4) * 4 : 0;
  const burst = pop(f, 30, 14);
  const pulse = 1 + Math.max(0, Math.sin(((f - 30) / 15) * Math.PI * 2)) * 0.03;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 760, height: 760, borderRadius: "50%", background: `radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(255,79,216,0.18) 40%, transparent 70%)`, opacity: 0.4 + burst * 0.6, scale: String(0.8 + burst * 0.3) }} />
      </div>
      <H size={84} style={{ position: "absolute", left: 60, right: 60, top: 460, ...rise(f, 0, 10, 40) }}>
        Dein Gratis
        <br />
        <span style={{ color: C.cyan, textShadow: GLOW }}>Startpaket</span> wartet!
      </H>
      <div
        style={{
          position: "absolute",
          left: 540 - 270,
          top: 690,
          width: 540,
          rotate: `${shake}deg`,
          scale: String(interpolate(pop(f, 2, 14), [0, 1], [0.3, 1]) * (f >= 30 ? pulse : 1)),
          filter: `drop-shadow(0 0 ${20 + burst * 40}px rgba(255,79,216,0.7))`,
        }}
      >
        <Img src={staticFile("crazybuzzer/offer_mobile.webp")} style={{ width: 540 }} />
      </div>
      <Sparks at={30} x={540} y={1000} n={60} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1300, textAlign: "center", fontSize: 34, fontWeight: 800, color: C.grey, ...rise(f, 40, 10, 20) }}>
        Gratis-Coins für deinen Start – nur zum Spielspaß
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5 · CTA (120 f) ---------- */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const press = interpolate(f, [52, 56, 64], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.max(0, Math.sin(((f - 20) / 15) * Math.PI * 2)) * 0.04;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Night />
      <HeroBand top={720} height={760} dim={0.35} cropX={0.3} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 400 }}>
        <div style={{ scale: String(interpolate(pop(f, 0, 14), [0, 1], [0.4, 1])) }}>
          <Img src={staticFile("crazybuzzer/logo.webp")} style={{ width: 760 }} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 540 - 165,
          top: 780,
          width: 330,
          height: 330,
          scale: String(pop(f, 14, 12) * pulse * (1 - press * 0.12)),
          filter: `drop-shadow(0 0 ${30 + press * 60}px rgba(78,229,255,0.85))`,
        }}
      >
        <Img src={staticFile("crazybuzzer/buzzer_btn.webp")} style={{ width: 330, height: 330 }} />
      </div>
      <Sparks at={56} x={540} y={945} n={50} />
      <div style={{ position: "absolute", right: 70, top: 830, width: 170, ...rise(f, 22, 10, 20) }}>
        <Img src={staticFile("crazybuzzer/siegel.webp")} style={{ width: 170 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1140, textAlign: "center", ...rise(f, 26, 10, 20) }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: C.white, textShadow: GLOW }}>crazybuzzer.com</div>
        <div style={{ marginTop: 14, fontSize: 26, fontWeight: 800, color: C.grey, letterSpacing: 3 }}>SPIELE HIER</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1250, display: "flex", justifyContent: "center", gap: 16, ...rise(f, 32, 10, 20) }}>
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
  const hide = p(f, 480, 6);
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, s * 1.5) * (1 - hide), scale: String(interpolate(s, [0, 1], [0.7, 1])) }}>
      <Img src={staticFile("crazybuzzer/logo.webp")} style={{ width: 380 }} />
    </div>
  );
};

const Notice: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      top: 1395,
      padding: "14px 22px",
      borderRadius: 16,
      background: "rgba(3,15,28,0.88)",
      border: `2px solid ${C.cyan}`,
      boxShadow: `0 0 18px rgba(34,211,238,0.4)`,
      color: C.white,
      fontFamily: FONT,
      display: "flex",
      alignItems: "center",
      gap: 18,
    }}
  >
    <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", border: `4px solid ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, fontWeight: 900 }}>18+</div>
    <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.25 }}>
      Social Casino · Kein Echtgeldspiel
      <div style={{ fontSize: 21, fontWeight: 500, color: C.grey }}>Keine Echtgeldgewinne · Spielen mit Verantwortung</div>
    </div>
  </div>
);

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = [15, 90, 240, 360, 480].reduce((m, c) => Math.max(m, f >= c ? interpolate(f, [c, c + 6], [0.4, 0], { extrapolateRight: "clamp" }) : 0), 0);
  return <AbsoluteFill style={{ background: C.cyan, opacity: o, mixBlendMode: "screen" }} />;
};

const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ scale: String(interpolate(f, [0, 8], [1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })) }}>{children}</AbsoluteFill>;
};

export const CrazyReelCI: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
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
