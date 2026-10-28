import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Loop, OffthreadVideo, random, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { Ghost, Night as SpookyNight, Pumpkin, Web } from "./CrazyHalloween";

/* CrazyBuzzer · daily reel template. 18.87 s @30fps, 120 BPM.
   Cuts 90 · 210 · 330 · 446 (3 / 7 / 11 / 14.87 s), button presses at f35 and f506.
   330–446 = offizielles Logo-Sting (public/crazybuzzer/logo_sting.mp4, 116 Frames);
   make_daily.sh setzt dort den Original-Sound des Stings zwischen die Musik (Musik 0–11 s | Sting | Musik 11–15 s).
   Everything a day changes lives in DailyProps (passed with --props=<file>.json). */

export const STING_FRAMES = 116;
export const DAILY_FRAMES = 450 + STING_FRAMES;

export type Decor = "neon" | "spooky" | "gold" | "winter" | "party";
export type DailyProps = {
  accent: string; // main glow colour, e.g. "#4ee5ff"
  accent2: string; // secondary, e.g. "#ff4fd8"
  highlight: string; // 2nd headline colour in scene 2
  decor: Decor;
  hookKicker: string; // small line, e.g. "Traust du dich?"
  hookTitle: string; // big line, e.g. "Grusel-Halloween" (use \n for a break)
  slotsLine1: string;
  slotsLine2: string;
  tiles: number[]; // 4 indices into TILES (0–7)
  messageTitle: string; // use \n for a break
  messageLines: string[]; // exactly 3 short lines
  ctaSub: string; // e.g. "Jetzt gratis spielen"
};

export const DAILY_DEFAULT: DailyProps = {
  accent: "#4ee5ff",
  accent2: "#ff4fd8",
  highlight: "#ffd84e",
  decor: "neon",
  hookKicker: "Bock auf Spaß?",
  hookTitle: "Dein Social\nCasino!",
  slotsLine1: "888+",
  slotsLine2: "Top Slots",
  tiles: [0, 1, 2, 3],
  messageTitle: "Spiel einfach\ndrauf los!",
  messageLines: ["100% kostenlos", "Sicher & fair", "Tägliche Boni"],
  ctaSub: "Jetzt gratis spielen",
};

export const TILES: [string, string][] = [
  ["tile_abde4df31_merkur_eye_of_horus_2x2.webp", "Eye of Horus"],
  ["tile_55082e12f_merkur_lucky_pharaoh_wild_2x2.webp", "Lucky Pharaoh Wild"],
  ["tile_0182f7a74_merkur_magic_mirror_deluxe_2x2.webp", "Magic Mirror Deluxe"],
  ["tile_1b3be6b4f_merkur_dragons_treasure_2x2.webp", "Dragons Treasure"],
  ["tile_404b6301a_merkur_el_torero_2x2.webp", "El Torero"],
  ["tile_11eed89a7_merkur_BlazingStar_2x2.webp", "Blazing Star"],
  ["tile_256c6221c_merkur_Eye-Of-Horus-Power-Spins_2x2.webp", "Eye of Horus Power Spins"],
  ["tile_c5304c221_merkur_jollys_cap_2x2.webp", "Jolly's Cap"],
];

const FONT = "Inter, sans-serif";
const WHITE = "#ffffff";
const GREY = "#cfd3dc";
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const p = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const pop = (f: number, s: number, d = 12) =>
  interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.7, 0.64, 1) });
const rise = (f: number, s: number, d = 12, y = 50) => {
  const t = p(f, s, d);
  return { opacity: t, translate: `0px ${interpolate(t, [0, 1], [y, 0])}px` };
};
const hexA = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const glow = (c: string) => `0 0 10px ${hexA(c, 0.9)}, 0 0 26px ${hexA(c, 0.55)}, 0 0 54px ${hexA(c, 0.35)}`;
const lines = (s: string) => s.split("\n").map((l, i, a) => (
  <React.Fragment key={i}>
    {l}
    {i < a.length - 1 ? <br /> : null}
  </React.Fragment>
));

const H: React.FC<{ children: React.ReactNode; size?: number; color?: string; shadow?: string; style?: React.CSSProperties }> = ({ children, size = 88, color = WHITE, shadow, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.04, letterSpacing: -1, textTransform: "uppercase", textAlign: "center", color, textShadow: shadow ?? "0 4px 18px rgba(0,0,0,0.7)", ...style }}>
    {children}
  </div>
);

/* ---------- backgrounds per decor ---------- */
const Stars: React.FC<{ n?: number; maxY?: number }> = ({ n = 70, maxY = 1920 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(n).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`dx${i}`) * 1080, top: random(`dy${i}`) * maxY, width: 2.5, height: 2.5, borderRadius: "50%", background: "#fff", opacity: (0.3 + 0.7 * Math.abs(Math.sin(f / (9 + (i % 7)) + i))) * 0.65 }} />
      ))}
    </>
  );
};

const Falling: React.FC<{ kind: "coin" | "snow" | "confetti"; colors: string[]; n?: number }> = ({ kind, colors, n = 36 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const sp = (kind === "snow" ? 1.6 : 4) + random(`fs${i}`) * (kind === "snow" ? 2 : 5);
        const y = ((random(`fy${i}`) * 2200 + f * sp) % 2200) - 200;
        const x = random(`fx${i}`) * 1080 + Math.sin(f / 20 + i) * (kind === "snow" ? 30 : 12);
        const s = kind === "snow" ? 6 + random(`fz${i}`) * 10 : kind === "coin" ? 26 + random(`fz${i}`) * 26 : 12 + random(`fz${i}`) * 12;
        const col = colors[i % colors.length];
        if (kind === "coin") {
          const sx = Math.abs(Math.cos(f / 8 + i));
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #fff3b0, ${col} 55%, #9a6a00)`, scale: `${0.2 + sx * 0.8} 1`, boxShadow: `0 0 12px ${hexA(col, 0.6)}` }} />;
        }
        if (kind === "snow") return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: 0.8, filter: "blur(1px)" }} />;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s * 0.5, background: col, rotate: `${f * 6 + i * 40}deg`, opacity: 0.9 }} />;
      })}
    </>
  );
};

const HeroBand: React.FC<{ top: number; height?: number; dim?: number; cropX?: number }> = ({ top, height = 900, dim = 0.3, cropX = 0.64 }) => {
  const scale = height / 600;
  const w = 2560 * scale;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height, overflow: "hidden", mixBlendMode: "screen", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 75%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 75%, transparent 100%)" }}>
      <div style={{ position: "absolute", left: 540 - w * cropX, top: 0, width: w, height }}>
        <Loop durationInFrames={240}>
          <OffthreadVideo src={staticFile("crazybuzzer/sphere.mp4")} muted style={{ width: w, height }} />
        </Loop>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />
    </div>
  );
};

const Bg: React.FC<{ P: DailyProps; band?: boolean; lightning?: number[] }> = ({ P, band, lightning }) => {
  if (P.decor === "spooky") return <SpookyNight lightning={lightning} />;
  const grad =
    P.decor === "gold"
      ? "linear-gradient(180deg, #1a0f02 0%, #2b1a05 45%, #0b0702 100%)"
      : P.decor === "winter"
        ? "linear-gradient(180deg, #06142b 0%, #0d2a4d 45%, #050b17 100%)"
        : P.decor === "party"
          ? "linear-gradient(180deg, #13051f 0%, #24093a 45%, #07020d 100%)"
          : "linear-gradient(180deg, #05080f 0%, #0a1c2d 45%, #05080f 100%)";
  return (
    <AbsoluteFill style={{ background: grad, overflow: "hidden" }}>
      <Stars />
      {band ? <HeroBand top={600} /> : null}
      {P.decor === "gold" ? <Falling kind="coin" colors={["#ffcc33", "#f5b400"]} n={22} /> : null}
      {P.decor === "winter" ? <Falling kind="snow" colors={["#fff"]} n={70} /> : null}
      {P.decor === "party" ? <Falling kind="confetti" colors={[P.accent, P.accent2, P.highlight, "#fff"]} n={46} /> : null}
      <div style={{ position: "absolute", left: -200, right: -200, bottom: 0, height: 700, background: `radial-gradient(ellipse at 50% 100%, ${hexA(P.accent, 0.28)} 0%, transparent 70%)` }} />
    </AbsoluteFill>
  );
};

const Burst: React.FC<{ at: number; x: number; y: number; colors: string[]; n?: number }> = ({ at, x, y, colors, n = 48 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 42) return null;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const a = random(`ba${at}${i}`) * Math.PI * 2;
        const v = 12 + random(`bv${at}${i}`) * 22;
        const col = colors[i % colors.length];
        const s = 5 + random(`bs${at}${i}`) * 9;
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * v * f, top: y + Math.sin(a) * v * f + 0.45 * f * f, width: s, height: s, borderRadius: "50%", background: col, boxShadow: `0 0 ${s * 2}px ${col}`, opacity: 1 - f / 42 }} />;
      })}
    </>
  );
};

const Icon: React.FC<{ P: DailyProps; size: number; f: number }> = ({ P, size, f }) =>
  P.decor === "spooky" ? (
    <Pumpkin size={size} glow={0.7} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(180deg, ${hexA(P.accent, 0.9)}, ${hexA(P.accent2, 0.7)})`, border: `2px solid ${P.accent}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${10 + 6 * Math.abs(Math.sin(f / 6))}px ${hexA(P.accent, 0.7)}` }}>
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 48 48">
        <path d="M10 25l9 9 19-20" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

/* ---------- scenes ---------- */
const Hook: React.FC<{ P: DailyProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const press = interpolate(f, [30, 35, 44], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} band lightning={[2, 30]} />
      <div style={{ position: "absolute", left: 50, right: 50, top: 450, ...rise(f, 4, 12, 40) }}>
        <H size={P.hookKicker.length > 18 ? 54 : 70} color={GREY} style={{ whiteSpace: "nowrap" }}>{P.hookKicker}</H>
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 560, scale: String(pop(f, 34, 14)) }}>
        <H size={P.hookTitle.length > 22 ? 104 : 124} color={P.accent} shadow={glow(P.accent)} style={{ letterSpacing: -3 }}>
          {lines(P.hookTitle)}
        </H>
      </div>
      <div style={{ position: "absolute", left: 540 - 150, top: 920, width: 300, height: 300, scale: String(pop(f, 6, 12) * (1 - press * 0.12)), filter: `drop-shadow(0 0 ${30 + press * 60}px ${hexA(P.accent, 0.9)})` }}>
        <Img src={staticFile("crazybuzzer/buzzer_btn.webp")} style={{ width: 300, height: 300 }} />
      </div>
      <Burst at={35} x={540} y={1070} n={56} colors={[P.accent, P.accent2, P.highlight, WHITE]} />
      {P.decor === "spooky" ? (
        <>
          <div style={{ position: "absolute", left: 90, top: 1120, scale: String(pop(f, 40, 12)) }}>
            <Pumpkin size={170} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 5))} />
          </div>
          <div style={{ position: "absolute", right: 90, top: 1130, scale: String(pop(f, 46, 12)) }}>
            <Pumpkin size={150} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 4 + 1))} grin={0.5} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const Slots: React.FC<{ P: DailyProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const tiles = (P.tiles.length >= 4 ? P.tiles : DAILY_DEFAULT.tiles).slice(0, 4).map((i) => TILES[Math.max(0, Math.min(TILES.length - 1, i))]);
  const counter = /^\d+\+?$/.test(P.slotsLine1);
  const n = counter ? Math.round(interpolate(f, [4, 34], [0, parseInt(P.slotsLine1, 10)], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) })) : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} lightning={[60]} />
      {P.decor === "spooky" ? (
        <>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Web size={260} />
          </div>
          <div style={{ position: "absolute", right: 0, top: 0 }}>
            <Web size={260} flip />
          </div>
        </>
      ) : null}
      <div style={{ position: "absolute", left: 60, right: 60, top: 450 }}>
        <H size={counter ? 150 : 84} color={counter ? P.accent : WHITE} shadow={counter ? glow(P.accent) : undefined} style={rise(f, 0, 10, 40)}>
          {counter ? `${n}${P.slotsLine1.endsWith("+") ? "+" : ""}` : P.slotsLine1}
        </H>
        <H size={92} color={P.highlight} shadow={glow(P.highlight)} style={{ marginTop: 4, ...rise(f, 6, 10, 40) }}>
          {P.slotsLine2}
        </H>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 780, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24 }}>
        {tiles.map(([src, name], i) => {
          const t = pop(f, 16 + i * 8, 12);
          const fl = 0.75 + 0.25 * Math.abs(Math.sin(f / 3 + i * 2));
          const col = i % 2 ? P.accent2 : P.accent;
          return (
            <div key={src + i} style={{ position: "relative", height: 200, borderRadius: 22, overflow: "hidden", border: `4px solid ${col}`, boxShadow: `0 0 ${30 * fl}px ${col}`, opacity: Math.min(1, t * 1.5), scale: String(interpolate(t, [0, 1], [0.6, 1])), rotate: `${interpolate(t, [0, 1], [i % 2 ? 8 : -8, 0])}deg` }}>
              <Img src={staticFile(`crazybuzzer/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0) 55%)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, color: WHITE, fontSize: 26, fontWeight: 800, textAlign: "center" }}>{name}</div>
            </div>
          );
        })}
      </div>
      {P.decor === "spooky" ? (
        <div style={{ position: "absolute", left: interpolate(f, [40, 120], [-220, 1140]), top: 1230 + Math.sin(f / 6) * 30, opacity: p(f, 40, 8) }}>
          <Ghost size={170} f={f} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Message: React.FC<{ P: DailyProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const shake = f > 4 && f < 16 ? Math.sin(f * 2.6) * 6 : 0;
  const ls = (P.messageLines.length ? P.messageLines : DAILY_DEFAULT.messageLines).slice(0, 3);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} band lightning={[4]} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 450, translate: `${shake}px 0px` }}>
        <H size={100} color={P.accent} shadow={glow(P.accent)} style={{ scale: String(pop(f, 2, 12)) }}>
          {lines(P.messageTitle)}
        </H>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 770, display: "flex", flexDirection: "column", gap: 28 }}>
        {ls.map((b, i) => {
          const s = 18 + i * 15;
          const t = p(f, s, 10);
          return (
            <div key={b + i} style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 30px", borderRadius: 999, background: "rgba(8,6,18,0.78)", border: `2px solid ${P.accent}`, boxShadow: `0 0 24px ${hexA(P.accent, 0.45)}, inset 0 0 18px ${hexA(P.accent2, 0.25)}`, opacity: t, translate: `${interpolate(t, [0, 1], [i % 2 ? 260 : -260, 0])}px 0px` }}>
              <div style={{ flexShrink: 0, scale: String(pop(f, s + 6, 10)) }}>
                <Icon P={P} size={70} f={f} />
              </div>
              <div style={{ fontSize: b.length > 22 ? 36 : 42, fontWeight: 900, color: WHITE, textTransform: "uppercase", lineHeight: 1.05 }}>{b}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ P: DailyProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const press = interpolate(f, [56, 60, 68], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.max(0, Math.sin(((f - 20) / 15) * Math.PI * 2)) * 0.04;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 420 }}>
        <div style={{ scale: String(interpolate(pop(f, 0, 14), [0, 1], [0.4, 1])), filter: `drop-shadow(0 0 30px ${hexA(P.accent, 0.55)})` }}>
          <Img src={staticFile("crazybuzzer/logo.webp")} style={{ width: 760 }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 150, top: 770, width: 300, height: 300, scale: String(pop(f, 14, 12) * pulse * (1 - press * 0.12)), filter: `drop-shadow(0 0 ${30 + press * 60}px ${hexA(P.accent, 0.85)})` }}>
        <Img src={staticFile("crazybuzzer/buzzer_btn.webp")} style={{ width: 300, height: 300 }} />
      </div>
      <Burst at={60} x={540} y={920} n={50} colors={[P.accent, P.accent2, P.highlight, WHITE]} />
      {P.decor === "spooky" ? (
        <>
          <div style={{ position: "absolute", left: 70, top: 840, scale: String(pop(f, 24, 12)) }}>
            <Pumpkin size={150} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 5))} />
          </div>
          <div style={{ position: "absolute", right: 70, top: 850, scale: String(pop(f, 28, 12)) }}>
            <Pumpkin size={140} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 4 + 2))} grin={0.4} />
          </div>
        </>
      ) : (
        <div style={{ position: "absolute", right: 70, top: 830, width: 170, ...rise(f, 22, 10, 20) }}>
          <Img src={staticFile("crazybuzzer/siegel.webp")} style={{ width: 170 }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", ...rise(f, 26, 10, 20) }}>
        <div style={{ fontSize: 58, fontWeight: 900, color: WHITE, textShadow: glow("#4ee5ff") }}>crazybuzzer.com</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 800, color: P.accent, letterSpacing: 3, textShadow: glow(P.accent), textTransform: "uppercase" }}>{P.ctaSub}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", gap: 16, ...rise(f, 32, 10, 20) }}>
        {["App Store", "Google Play", "Browser"].map((s) => (
          <div key={s} style={{ padding: "14px 24px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.4)", background: "#000", fontSize: 30, fontWeight: 800, color: WHITE }}>
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

const Notice: React.FC<{ P: DailyProps }> = ({ P }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 1395, padding: "14px 22px", borderRadius: 16, background: "rgba(8,6,18,0.9)", border: `2px solid ${P.accent}`, boxShadow: `0 0 18px ${hexA(P.accent, 0.4)}`, color: WHITE, fontFamily: FONT, display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", border: `4px solid ${P.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, fontWeight: 900 }}>18+</div>
    <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.25 }}>
      Social Casino · Kein Echtgeldspiel
      <div style={{ fontSize: 21, fontWeight: 500, color: GREY }}>Keine Echtgeldgewinne · Spielen mit Verantwortung</div>
    </div>
  </div>
);

const LogoSting: React.FC = () => (
  <AbsoluteFill style={{ background: "#04334b" }}>
    <OffthreadVideo src={staticFile("crazybuzzer/logo_sting.mp4")} muted style={{ width: 1080, height: 1920 }} />
  </AbsoluteFill>
);

const Flash: React.FC<{ P: DailyProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const o = [35, 90, 210, 330 + STING_FRAMES, 390 + STING_FRAMES].reduce((m, c) => Math.max(m, f >= c ? interpolate(f, [c, c + 6], [0.45, 0], { extrapolateRight: "clamp" }) : 0), 0);
  return <AbsoluteFill style={{ background: P.accent, opacity: o, mixBlendMode: "screen" }} />;
};

const Vignette: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />;

const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ scale: String(interpolate(f, [0, 8], [1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })) }}>{children}</AbsoluteFill>;
};

export const CrazyDaily: React.FC<Partial<DailyProps>> = (props) => {
  const P: DailyProps = { ...DAILY_DEFAULT, ...props };
  return (
    <AbsoluteFill style={{ background: "#05080f" }}>
      <Series>
        <Series.Sequence name="Hook" durationInFrames={90}>
          <Hook P={P} />
        </Series.Sequence>
        <Series.Sequence name="Slots" durationInFrames={120}>
          <Punch>
            <Slots P={P} />
          </Punch>
        </Series.Sequence>
        <Series.Sequence name="Message" durationInFrames={120}>
          <Punch>
            <Message P={P} />
          </Punch>
        </Series.Sequence>
        <Series.Sequence name="Logo-Sting" durationInFrames={STING_FRAMES}>
          <LogoSting />
        </Series.Sequence>
        <Series.Sequence name="CTA" durationInFrames={120}>
          <Punch>
            <Cta P={P} />
          </Punch>
        </Series.Sequence>
      </Series>
      <Sequence durationInFrames={330}>
        <Vignette />
      </Sequence>
      <Sequence from={330 + STING_FRAMES}>
        <Vignette />
      </Sequence>
      <Flash P={P} />
      <PinnedLogo />
      <Notice P={P} />
    </AbsoluteFill>
  );
};
