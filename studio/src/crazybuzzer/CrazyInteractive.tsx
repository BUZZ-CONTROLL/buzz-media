import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Loop, OffthreadVideo, random, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { Night as SpookyNight, Pumpkin } from "./CrazyHalloween";
import { STING_FRAMES, TILES } from "./CrazyDaily";

/* CrazyBuzzer · interaktive Reels (Quiz, Stopp-Challenge, Duell, Bewerten).
   Gleiches Raster wie CrazyDaily: Inhalt 0–330 (11 s) · offizieller Logo-Sting 330–446 · CTA 446–566.
   So passt der Audio-Mix aus make_daily.sh (Musik 0–11 s | Sting | Musik 11–15 s).
   Formate:
   - quiz:     Frage (0–2,5 s) · 4 Antworten + Countdown 5→1 (2,5–7,5 s) · Auflösung (7,5–11 s)
   - stopp:    "Halte das Video an!" · Slots rattern durch · "Welchen hast du erwischt?"
   - duell:    3 Runden "Links oder rechts?" (je 2,5 s) · "Deine Kombi in die Kommentare"
   - bewerten: Ein Slot im Rampenlicht · Skala 1–10 · "Deine Note?"
   Alle Inhalte kommen aus InteractiveProps (--props=<file>.json). */

export const INTERACTIVE_FRAMES = 450 + STING_FRAMES;

export type Format = "quiz" | "stopp" | "duell" | "bewerten";
export type Decor = "neon" | "spooky" | "gold" | "winter" | "party";
export type InteractiveProps = {
  format: Format;
  accent: string;
  accent2: string;
  highlight: string;
  decor: Decor;
  hookKicker: string; // kleine Zeile über dem Titel, z. B. "Quiz-Zeit!"
  hookTitle: string; // große Zeile, \n für Umbruch (wird auch Titelbild)
  // quiz
  question: string; // \n für Umbruch
  options: string[]; // genau 4 kurze Antworten
  correct: number; // 0–3
  revealText: string; // z. B. "Ägypten!"
  // alle Formate: Slot-Kacheln (Indizes 0–7)
  // quiz: 2 Kacheln zur Auflösung · stopp: beliebig viele (Reihenfolge des Durchlaufs)
  // duell: 6 Kacheln = 3 Paare · bewerten: 1 Kachel
  tiles: number[];
  tilesLabel: string; // Zeile über den Kacheln (quiz-Auflösung / bewerten)
  prompt: string; // Kommentar-Aufforderung im Video, \n für Umbruch
  ctaSub: string;
};

export const INTERACTIVE_DEFAULT: InteractiveProps = {
  format: "quiz",
  accent: "#4ee5ff",
  accent2: "#ff4fd8",
  highlight: "#ffd84e",
  decor: "neon",
  hookKicker: "Quiz-Zeit!",
  hookTitle: "Weißt du\ndas?",
  question: "Wo steht die\nCheops-Pyramide?",
  options: ["Mexiko", "Ägypten", "Peru", "Griechenland"],
  correct: 1,
  revealText: "Ägypten!",
  tiles: [0, 1],
  tilesLabel: "Ägypten-Feeling bei uns:",
  prompt: "Richtig getippt?\nAb in die Kommentare!",
  ctaSub: "Jetzt gratis spielen",
};

const FONT = "Inter, sans-serif";
const WHITE = "#ffffff";
const GREY = "#cfd3dc";
const GREEN = "#3dff8f";
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], { ...cl, easing: ease });
const pop = (f: number, s: number, d = 12) => interpolate(f, [s, s + d], [0, 1], { ...cl, easing: Easing.bezier(0.34, 1.7, 0.64, 1) });
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
const tile = (i: number) => TILES[Math.max(0, Math.min(TILES.length - 1, i))];

const H: React.FC<{ children: React.ReactNode; size?: number; color?: string; shadow?: string; style?: React.CSSProperties }> = ({ children, size = 88, color = WHITE, shadow, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.04, letterSpacing: -1, textTransform: "uppercase", textAlign: "center", color, textShadow: shadow ?? "0 4px 18px rgba(0,0,0,0.7)", ...style }}>
    {children}
  </div>
);

/* ---------- Hintergrund ---------- */
const Stars: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(70).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`dx${i}`) * 1080, top: random(`dy${i}`) * 1920, width: 2.5, height: 2.5, borderRadius: "50%", background: "#fff", opacity: (0.3 + 0.7 * Math.abs(Math.sin(f / (9 + (i % 7)) + i))) * 0.65 }} />
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
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #fff3b0, ${col} 55%, #9a6a00)`, scale: `${0.2 + sx * 0.8} 1` }} />;
        }
        if (kind === "snow") return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: 0.8, filter: "blur(1px)" }} />;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s * 0.5, background: col, rotate: `${f * 6 + i * 40}deg`, opacity: 0.9 }} />;
      })}
    </>
  );
};

const HeroBand: React.FC<{ top: number }> = ({ top }) => {
  const height = 900;
  const w = 2560 * (height / 600);
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height, overflow: "hidden", mixBlendMode: "screen", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 75%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 75%, transparent 100%)" }}>
      <div style={{ position: "absolute", left: 540 - w * 0.64, top: 0, width: w, height }}>
        <Loop durationInFrames={240}>
          <OffthreadVideo src={staticFile("crazybuzzer/sphere.mp4")} muted style={{ width: w, height }} />
        </Loop>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.45 }} />
    </div>
  );
};

const Bg: React.FC<{ P: InteractiveProps; band?: boolean }> = ({ P, band }) => {
  if (P.decor === "spooky") return <SpookyNight lightning={[]} />;
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
      {band ? <HeroBand top={700} /> : null}
      {P.decor === "gold" ? <Falling kind="coin" colors={["#ffcc33", "#f5b400"]} n={18} /> : null}
      {P.decor === "winter" ? <Falling kind="snow" colors={["#fff"]} n={60} /> : null}
      {P.decor === "party" ? <Falling kind="confetti" colors={[P.accent, P.accent2, P.highlight, "#fff"]} n={36} /> : null}
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

/* Sprechblase mit Pfeil nach unten = "Kommentiere!" (keine Emojis, die rendert Chromium headless nicht zuverlässig) */
const CommentBubble: React.FC<{ P: InteractiveProps; text: string; top: number; at: number; arrow?: boolean }> = ({ P, text, top, at, arrow = true }) => {
  const f = useCurrentFrame();
  const t = pop(f, at, 14);
  const bob = Math.sin((f - at) / 6) * 8;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, t * 1.4), scale: String(interpolate(t, [0, 1], [0.6, 1])) }}>
      <div style={{ position: "relative", padding: "26px 40px", borderRadius: 36, background: P.highlight, boxShadow: `0 0 40px ${hexA(P.highlight, 0.6)}` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, lineHeight: 1.08, textTransform: "uppercase", textAlign: "center", color: "#111" }}>{lines(text)}</div>
        <div style={{ position: "absolute", left: "50%", bottom: -26, marginLeft: -28, width: 0, height: 0, borderLeft: "28px solid transparent", borderRight: "28px solid transparent", borderTop: `30px solid ${P.highlight}` }} />
      </div>
      {arrow ? <svg width={70} height={70} viewBox="0 0 48 48" style={{ marginTop: 34, translate: `0px ${bob}px`, filter: `drop-shadow(0 0 12px ${P.highlight})` }}>
        <path d="M24 6v32M10 26l14 14 14-14" fill="none" stroke={P.highlight} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg> : null}
    </div>
  );
};

const Kicker: React.FC<{ P: InteractiveProps; text: string; at?: number }> = ({ P, text, at = 0 }) => {
  const f = useCurrentFrame();
  const t = pop(f, at, 12);
  const wob = Math.sin(f / 5) * 2;
  return (
    <div style={{ display: "flex", justifyContent: "center", scale: String(t), rotate: `${-3 + wob}deg` }}>
      <div style={{ padding: "14px 34px", borderRadius: 18, background: P.accent2, boxShadow: `0 0 34px ${hexA(P.accent2, 0.7)}`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: WHITE, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

/* ---------- gemeinsamer Hook ---------- */
const Hook: React.FC<{ P: InteractiveProps; sub?: string }> = ({ P, sub }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} band />
      <div style={{ position: "absolute", left: 40, right: 40, top: 470 }}>
        <Kicker P={P} text={P.hookKicker} at={2} />
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 610, scale: String(pop(f, 10, 14)) }}>
        <H size={P.hookTitle.replace(/\n/g, "").length > 22 ? 104 : 124} color={P.accent} shadow={glow(P.accent)} style={{ letterSpacing: -3 }}>
          {lines(P.hookTitle)}
        </H>
      </div>
      {sub ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1060, ...rise(f, 26, 12, 30) }}>
          <H size={46} color={GREY}>{lines(sub)}</H>
        </div>
      ) : null}
      <Burst at={12} x={540} y={760} n={46} colors={[P.accent, P.accent2, P.highlight, WHITE]} />
    </AbsoluteFill>
  );
};

/* ---------- QUIZ ---------- */
const QUIZ_HOOK = 75;
const QUIZ_ASK = 150;
const QuizAsk: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const left = Math.max(1, 5 - Math.floor(f / 30));
  const inSec = (f % 30) / 30;
  const ring = 1 - f / QUIZ_ASK;
  const letters = ["A", "B", "C", "D"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 430 }}>
        <H size={P.question.replace(/\n/g, "").length > 26 ? 66 : 76} color={WHITE} style={rise(f, 0, 10, 30)}>{lines(P.question)}</H>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 680, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {P.options.slice(0, 4).map((o, i) => {
          const t = pop(f, 6 + i * 6, 12);
          const col = i % 2 ? P.accent2 : P.accent;
          return (
            <div key={i} style={{ height: 150, borderRadius: 28, background: "rgba(8,6,18,0.85)", border: `4px solid ${col}`, boxShadow: `0 0 26px ${hexA(col, 0.5)}`, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", opacity: Math.min(1, t * 1.5), scale: String(interpolate(t, [0, 1], [0.5, 1])) }}>
              <div style={{ flexShrink: 0, width: 74, height: 74, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 900, color: "#0a0a12" }}>{letters[i]}</div>
              <div style={{ fontSize: o.length > 10 ? 32 : 40, fontWeight: 900, color: WHITE, textTransform: "uppercase", lineHeight: 1.05 }}>{o}</div>
            </div>
          );
        })}
      </div>
      {/* Countdown */}
      <div style={{ position: "absolute", left: 540 - 120, top: 1065, width: 240, height: 240, scale: String(pop(f, 20, 10) * (1 + (1 - inSec) * 0.08)) }}>
        <svg width={240} height={240} viewBox="0 0 240 240" style={{ position: "absolute", inset: 0 }}>
          <circle cx={120} cy={120} r={104} fill="rgba(8,6,18,0.85)" stroke={hexA(P.highlight, 0.25)} strokeWidth={16} />
          <circle cx={120} cy={120} r={104} fill="none" stroke={P.highlight} strokeWidth={16} strokeLinecap="round" strokeDasharray={2 * Math.PI * 104} strokeDashoffset={2 * Math.PI * 104 * (1 - ring)} transform="rotate(-90 120 120)" style={{ filter: `drop-shadow(0 0 10px ${P.highlight})` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 130, fontWeight: 900, color: P.highlight, textShadow: glow(P.highlight) }}>{left}</div>
      </div>
    </AbsoluteFill>
  );
};

const QuizReveal: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const letters = ["A", "B", "C", "D"];
  const c = Math.max(0, Math.min(3, P.correct));
  const ts = P.tiles.slice(0, 2);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 430, ...rise(f, 0, 8, 20) }}>
        <H size={48} color={GREY}>Die Antwort:</H>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 510, display: "flex", justifyContent: "center", scale: String(pop(f, 2, 14)) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 40px", borderRadius: 32, background: hexA(GREEN, 0.15), border: `5px solid ${GREEN}`, boxShadow: `0 0 50px ${hexA(GREEN, 0.6)}` }}>
          <div style={{ flexShrink: 0, width: 96, height: 96, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58, fontWeight: 900, color: "#06210f" }}>{letters[c]}</div>
          <div style={{ fontSize: P.revealText.length > 14 ? 64 : 82, fontWeight: 900, color: WHITE, textTransform: "uppercase", textShadow: glow(GREEN), whiteSpace: "nowrap" }}>{P.revealText}</div>
        </div>
      </div>
      <Burst at={4} x={540} y={590} n={60} colors={[GREEN, P.highlight, WHITE, P.accent]} />
      {ts.length ? (
        <>
          <div style={{ position: "absolute", left: 40, right: 40, top: 720, ...rise(f, 14, 10, 20) }}>
            <H size={40} color={P.highlight} shadow={glow(P.highlight)}>{P.tilesLabel}</H>
          </div>
          <div style={{ position: "absolute", left: 90, right: 90, top: 790, display: "grid", gridTemplateColumns: `repeat(${ts.length}, 1fr)`, gap: 24 }}>
            {ts.map((ti, i) => {
              const [src, name] = tile(ti);
              const t = pop(f, 18 + i * 6, 12);
              const col = i % 2 ? P.accent2 : P.accent;
              return (
                <div key={i} style={{ position: "relative", height: 190, borderRadius: 22, overflow: "hidden", border: `4px solid ${col}`, boxShadow: `0 0 26px ${col}`, opacity: Math.min(1, t * 1.5), scale: String(interpolate(t, [0, 1], [0.6, 1])) }}>
                  <Img src={staticFile(`crazybuzzer/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 55%)" }} />
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, color: WHITE, fontSize: 24, fontWeight: 800, textAlign: "center" }}>{name}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
      <CommentBubble P={P} text={P.prompt} top={1030} at={34} />
    </AbsoluteFill>
  );
};

const Quiz: React.FC<{ P: InteractiveProps }> = ({ P }) => (
  <Series>
    <Series.Sequence durationInFrames={QUIZ_HOOK}>
      <Hook P={P} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={QUIZ_ASK}>
      <Punch>
        <QuizAsk P={P} />
      </Punch>
    </Series.Sequence>
    <Series.Sequence durationInFrames={330 - QUIZ_HOOK - QUIZ_ASK}>
      <Punch>
        <QuizReveal P={P} />
      </Punch>
    </Series.Sequence>
  </Series>
);

/* ---------- STOPP-CHALLENGE ---------- */
const STOPP_HOOK = 75;
const STOPP_SPIN = 180;
const StoppSpin: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const list = P.tiles.length ? P.tiles : [0, 1, 2, 3, 4, 5, 6, 7];
  const step = 3; // alle 3 Frames ein neuer Slot (10 pro Sekunde)
  const idx = Math.floor(f / step) % list.length;
  const [src, name] = tile(list[idx]);
  const flick = (f % step) / step;
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 430 }}>
        <H size={76} color={blink ? P.highlight : WHITE} shadow={glow(P.highlight)}>Jetzt antippen<br />&amp; halten!</H>
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 650, height: 470, borderRadius: 34, overflow: "hidden", border: `6px solid ${P.accent}`, boxShadow: `0 0 50px ${hexA(P.accent, 0.8)}, inset 0 0 40px rgba(0,0,0,0.6)`, scale: String(pop(f, 0, 10)) }}>
        <Img src={staticFile(`crazybuzzer/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", translate: `0px ${interpolate(flick, [0, 1], [-30, 30])}px`, scale: "1.15" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 45%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, color: WHITE, fontSize: 46, fontWeight: 900, textAlign: "center", textTransform: "uppercase" }}>{name}</div>
      </div>
      {/* Pfeile links/rechts wie ein Slot-Fenster */}
      {[0, 1].map((s) => (
        <svg key={s} width={70} height={110} viewBox="0 0 70 110" style={{ position: "absolute", top: 830, left: s ? undefined : 24, right: s ? 24 : undefined, rotate: s ? "180deg" : "0deg", filter: `drop-shadow(0 0 10px ${P.accent2})` }}>
          <path d="M10 10 L60 55 L10 100 Z" fill={P.accent2} />
        </svg>
      ))}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1170, ...rise(f, 10, 10, 20) }}>
        <H size={44} color={GREY}>Welchen Slot erwischst du?</H>
      </div>
    </AbsoluteFill>
  );
};

const StoppEnd: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const list = (P.tiles.length ? P.tiles : [0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 8);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} />
      <div style={{ position: "absolute", left: 50, right: 50, top: 430, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {list.map((ti, i) => {
          const [src] = tile(ti);
          const t = pop(f, i * 2, 10);
          return (
            <div key={i} style={{ height: 130, borderRadius: 14, overflow: "hidden", border: `3px solid ${i % 2 ? P.accent2 : P.accent}`, opacity: Math.min(1, t * 1.5), scale: String(interpolate(t, [0, 1], [0.5, 1])) }}>
              <Img src={staticFile(`crazybuzzer/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </div>
      <CommentBubble P={P} text={P.prompt} top={800} at={12} />
    </AbsoluteFill>
  );
};

const Stopp: React.FC<{ P: InteractiveProps }> = ({ P }) => (
  <Series>
    <Series.Sequence durationInFrames={STOPP_HOOK}>
      <Hook P={P} sub={"Halte das Video an –\ndein Slot für heute!"} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={STOPP_SPIN}>
      <StoppSpin P={P} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={330 - STOPP_HOOK - STOPP_SPIN}>
      <Punch>
        <StoppEnd P={P} />
      </Punch>
    </Series.Sequence>
  </Series>
);

/* ---------- DUELL ---------- */
const DUELL_HOOK = 60;
const DUELL_ROUND = 75;
const DuellRound: React.FC<{ P: InteractiveProps; a: number; b: number; n: number }> = ({ P, a, b, n }) => {
  const f = useCurrentFrame();
  const vs = pop(f, 10, 12);
  const side = (ti: number, s: number) => {
    const [src, name] = tile(ti);
    const t = p(f, 0, 10);
    const col = s ? P.accent2 : P.accent;
    return (
      <div style={{ position: "relative", width: 450, height: 480, borderRadius: 30, overflow: "hidden", background: "rgba(8,6,18,0.92)", border: `5px solid ${col}`, boxShadow: `0 0 36px ${hexA(col, 0.7)}`, opacity: t, translate: `${interpolate(t, [0, 1], [s ? 400 : -400, 0])}px 0px` }}>
        <Img src={staticFile(`crazybuzzer/${src}`)} style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }} />
        <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 14px", color: WHITE, fontSize: name.length > 16 ? 30 : 36, fontWeight: 900, textAlign: "center", textTransform: "uppercase", lineHeight: 1.05 }}>{name}</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "6px 30px", borderRadius: 999, background: col, color: "#0a0a12", fontSize: 36, fontWeight: 900 }}>{s ? "RECHTS" : "LINKS"}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 430, ...rise(f, 0, 8, 20) }}>
        <H size={54} color={P.highlight} shadow={glow(P.highlight)}>Runde {n} von 3</H>
      </div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 560, display: "flex", justifyContent: "space-between" }}>
        {side(a, 0)}
        {side(b, 1)}
      </div>
      <div style={{ position: "absolute", left: 540 - 85, top: 620, width: 170, height: 170, borderRadius: "50%", background: "#e8202e", border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, fontWeight: 900, color: WHITE, fontStyle: "italic", scale: String(vs), rotate: `${interpolate(vs, [0, 1], [-90, -8])}deg`, boxShadow: "0 0 40px rgba(232,32,46,0.8)" }}>VS</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1110, ...rise(f, 14, 10, 20) }}>
        <H size={56} color={WHITE}>Links oder rechts?</H>
      </div>
    </AbsoluteFill>
  );
};

const DuellEnd: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 470, ...rise(f, 0, 8, 20) }}>
        <H size={60} color={GREY}>Deine Kombi?</H>
        <H size={100} color={P.accent} shadow={glow(P.accent)} style={{ marginTop: 10 }}>L · R · L ?</H>
      </div>
      <CommentBubble P={P} text={P.prompt} top={850} at={4} />
    </AbsoluteFill>
  );
};

const Duell: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const t = P.tiles.length >= 6 ? P.tiles : [0, 5, 3, 4, 2, 7];
  return (
    <Series>
      <Series.Sequence durationInFrames={DUELL_HOOK}>
        <Hook P={P} />
      </Series.Sequence>
      {[0, 1, 2].map((r) => (
        <Series.Sequence key={r} durationInFrames={DUELL_ROUND}>
          <Punch>
            <DuellRound P={P} a={t[r * 2]} b={t[r * 2 + 1]} n={r + 1} />
          </Punch>
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={330 - DUELL_HOOK - 3 * DUELL_ROUND}>
        <Punch>
          <DuellEnd P={P} />
        </Punch>
      </Series.Sequence>
    </Series>
  );
};

/* ---------- BEWERTEN ---------- */
const BEW_HOOK = 75;
const Bewerten: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const Body: React.FC = () => {
    const f = useCurrentFrame();
    const [src, name] = tile(P.tiles[0] ?? 5);
    const sweep = interpolate(f, [20, 120], [0, 10], cl);
    return (
      <AbsoluteFill style={{ fontFamily: FONT }}>
        <Bg P={P} />
        <div style={{ position: "absolute", left: 40, right: 40, top: 425, ...rise(f, 0, 8, 20) }}>
          <H size={44} color={P.highlight} shadow={glow(P.highlight)}>{P.tilesLabel}</H>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 500, height: 440, borderRadius: 34, overflow: "hidden", border: `6px solid ${P.accent}`, boxShadow: `0 0 60px ${hexA(P.accent, 0.8)}`, scale: String(pop(f, 0, 14) * (1 + Math.sin(f / 10) * 0.01)) }}>
          <Img src={staticFile(`crazybuzzer/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 45%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, color: WHITE, fontSize: 50, fontWeight: 900, textAlign: "center", textTransform: "uppercase" }}>{name}</div>
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 975, ...rise(f, 12, 10, 20) }}>
          <H size={54} color={WHITE}>Deine Note von 1–10?</H>
        </div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 1065, display: "flex", justifyContent: "space-between" }}>
          {new Array(10).fill(0).map((_, i) => {
            const on = sweep > i;
            const col = i < 4 ? P.accent : i < 7 ? P.accent2 : P.highlight;
            return (
              <div key={i} style={{ width: 88, height: 88, borderRadius: "50%", border: `4px solid ${col}`, background: on ? col : "rgba(8,6,18,0.85)", boxShadow: on ? `0 0 22px ${col}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, color: on ? "#0a0a12" : WHITE, scale: String(on ? 1 + Math.max(0, 1 - (sweep - i)) * 0.25 : 1) }}>{i + 1}</div>
            );
          })}
        </div>
        <Sequence from={140}>
          <CommentBubble P={P} text={P.prompt} top={1185} at={0} arrow={false} />
        </Sequence>
      </AbsoluteFill>
    );
  };
  return (
    <Series>
      <Series.Sequence durationInFrames={BEW_HOOK}>
        <Hook P={P} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={330 - BEW_HOOK}>
        <Punch>
          <Body />
        </Punch>
      </Series.Sequence>
    </Series>
  );
};

/* ---------- CTA mit Kommentar-Aufruf ---------- */
const Cta: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const f = useCurrentFrame();
  const press = interpolate(f, [56, 60, 68], [0, 1, 0], cl);
  const pulse = 1 + Math.max(0, Math.sin(((f - 20) / 15) * Math.PI * 2)) * 0.04;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Bg P={P} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 380 }}>
        <div style={{ scale: String(interpolate(pop(f, 0, 14), [0, 1], [0.4, 1])), filter: `drop-shadow(0 0 30px ${hexA(P.accent, 0.55)})` }}>
          <Img src={staticFile("crazybuzzer/logo.webp")} style={{ width: 720 }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 140, top: 700, width: 280, height: 280, scale: String(pop(f, 14, 12) * pulse * (1 - press * 0.12)), filter: `drop-shadow(0 0 ${30 + press * 60}px ${hexA(P.accent, 0.85)})` }}>
        <Img src={staticFile("crazybuzzer/buzzer_btn.webp")} style={{ width: 280, height: 280 }} />
      </div>
      <Burst at={60} x={540} y={840} n={50} colors={[P.accent, P.accent2, P.highlight, WHITE]} />
      {P.decor === "spooky" ? (
        <div style={{ position: "absolute", left: 70, top: 780, scale: String(pop(f, 24, 12)) }}>
          <Pumpkin size={150} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 5))} />
        </div>
      ) : (
        <div style={{ position: "absolute", right: 70, top: 760, width: 160, ...rise(f, 22, 10, 20) }}>
          <Img src={staticFile("crazybuzzer/siegel.webp")} style={{ width: 160 }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center", ...rise(f, 26, 10, 20) }}>
        <div style={{ fontSize: 58, fontWeight: 900, color: WHITE, textShadow: glow("#4ee5ff") }}>crazybuzzer.com</div>
        <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: P.accent, letterSpacing: 3, textShadow: glow(P.accent), textTransform: "uppercase" }}>{P.ctaSub}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center", ...rise(f, 34, 10, 20) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 30px", borderRadius: 999, background: P.highlight, color: "#111", fontSize: 36, fontWeight: 900, textTransform: "uppercase" }}>
          <svg width={44} height={44} viewBox="0 0 48 48">
            <path d="M6 8h36v24H20l-10 8v-8H6z" fill="none" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
          </svg>
          Kommentiere unten!
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Ebenen ---------- */
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

const Notice: React.FC<{ P: InteractiveProps }> = ({ P }) => (
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

const Vignette: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />;

const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ scale: String(interpolate(f, [0, 8], [1.08, 1], { ...cl, easing: ease })) }}>{children}</AbsoluteFill>;
};

/* Fortschrittsbalken oben – hält die Leute bis zum Ende */
const Progress: React.FC<{ P: InteractiveProps }> = ({ P }) => {
  const f = useCurrentFrame();
  if (f >= 330) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 250, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
      <div style={{ width: `${(f / 330) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${P.accent}, ${P.accent2})`, boxShadow: `0 0 12px ${P.accent}` }} />
    </div>
  );
};

export const CrazyInteractive: React.FC<Partial<InteractiveProps>> = (props) => {
  const P: InteractiveProps = { ...INTERACTIVE_DEFAULT, ...props };
  const Body = P.format === "stopp" ? Stopp : P.format === "duell" ? Duell : P.format === "bewerten" ? Bewerten : Quiz;
  return (
    <AbsoluteFill style={{ background: "#05080f" }}>
      <Series>
        <Series.Sequence name={`Inhalt (${P.format})`} durationInFrames={330}>
          <Body P={P} />
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
      <PinnedLogo />
      <Progress P={P} />
      <Notice P={P} />
    </AbsoluteFill>
  );
};
