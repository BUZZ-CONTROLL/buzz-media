import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, GOLD, Logo } from "./theme";
import { GoldDrum } from "./GoldDrum";
import { SparkleTrail } from "./Sparkles";

/* TV spot 16:9 — designed at 1920x1080, rendered at scale 2 => 3840x2160, 25 fps.
   All timings are in seconds so they stay locked to the 120 BPM music. */

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const useS = () => {
  const { fps } = useVideoConfig();
  return (sec: number) => Math.round(sec * fps);
};
const prog = (f: number, a: number, d: number) =>
  interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const popE = (f: number, a: number, d: number) =>
  interpolate(f, [a, a + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.6, 0.64, 1),
  });
const riseS = (f: number, a: number, d: number, y = 40) => {
  const t = prog(f, a, d);
  return { opacity: t, translate: `0px ${interpolate(t, [0, 1], [y, 0])}px` };
};

const goldText: React.CSSProperties = {
  backgroundImage: GOLD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
const goldShadow = "drop-shadow(0 5px 0 #6b3d00) drop-shadow(0 0 34px rgba(246,197,68,0.45))";

// Scene boundaries (seconds) — on the beat grid of the music
export const TV_CUTS = [2.5, 6.0, 9.5];
export const TV_DURATION = 15;

/* ------------------------------------------------------------ */
const TvStage: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = 30 / fps;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          bottom: -620,
          height: 1100,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${C.red}d0 0%, ${C.red}44 38%, transparent 70%)`,
          opacity: 0.85 + Math.sin((f * k) / 12) * 0.08,
        }}
      />
      {new Array(46).fill(0).map((_, i) => {
        const x = random(`tx${i}`) * 1920;
        const speed = 0.6 + random(`ts${i}`) * 1.6;
        const y = 1080 - ((f * k * speed * 2.2 + random(`ty${i}`) * 1080) % 1200);
        const size = 2 + random(`tz${i}`) * 5;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin((f * k) / 8 + i));
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
              opacity: tw * 0.75,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Camera punch-in on each cut */
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = useS();
  return (
    <AbsoluteFill style={{ scale: String(interpolate(f, [0, s(0.27)], [1.07, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })) }}>
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ */
const ReelDigit: React.FC<{ target: number; stopAt: number; size: number }> = ({ target, stopAt, size }) => {
  const f = useCurrentFrame();
  const h = size * 1.05;
  const total = 30 + target;
  const t = interpolate(f, [0, stopAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 4),
  });
  return (
    <div style={{ filter: goldShadow }}>
      <div style={{ height: h, overflow: "hidden" }}>
        <div style={{ translate: `0px ${-t * total * h}px`, filter: `blur(${(1 - t) * 12}px)` }}>
          {new Array(total + 1).fill(0).map((_, i) => (
            <div
              key={i}
              style={{ height: h, lineHeight: `${h}px`, fontSize: size, fontWeight: 900, fontStyle: "italic", textAlign: "center", ...goldText }}
            >
              {i % 10}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const land = s(1.0);
  const shake = f >= land && f < land + s(0.33) ? Math.sin(f * 3.1) * (land + s(0.33) - f) * 1.4 : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <TvStage />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150, translate: `${shake}px ${-shake * 0.5}px` }}>
        <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: 8, color: C.white, scale: String(popE(f, 0, s(0.27))) }}>
          WIR SCHENKEN DIR
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 6 }}>
          <div style={{ display: "flex", scale: String(interpolate(popE(f, land, s(0.33)), [0, 1], [1, 1.05])) }}>
            <ReelDigit target={5} stopAt={s(0.73)} size={380} />
            <ReelDigit target={0} stopAt={land} size={380} />
          </div>
        </div>
        <div
          style={{
            marginTop: -24,
            fontSize: 140,
            fontWeight: 900,
            fontStyle: "italic",
            color: C.white,
            textShadow: `0 0 50px ${C.red}`,
            opacity: prog(f, land, s(0.2)),
            scale: String(interpolate(popE(f, land, s(0.33)), [0, 1], [1.6, 1])),
            lineHeight: 1,
          }}
        >
          FREISPIELE
        </div>
        <div
          style={{
            marginTop: 30,
            padding: "14px 40px",
            backgroundColor: C.red,
            borderRadius: 8,
            fontSize: 46,
            fontWeight: 900,
            color: C.white,
            letterSpacing: 2,
            rotate: "-2.5deg",
            scale: String(popE(f, s(1.5), s(0.33))),
            boxShadow: `0 12px 40px ${C.red}88`,
          }}
        >
          OHNE EINZAHLUNG
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const STEPS = [
  { n: "1", t: "Konto eröffnen", s: "kostenlos bei SlotMagie" },
  { n: "2", t: "Daten vervollständigen", s: "deine Personendaten" },
  { n: "3", t: "Verifizieren", s: "Freispiele werden gutgeschrieben" },
];

const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <TvStage />
      <div style={{ position: "absolute", left: 170, right: 170, top: 190, textAlign: "center" }}>
        <div style={{ fontSize: 74, fontWeight: 900, lineHeight: 1, color: C.white, whiteSpace: "nowrap", ...riseS(f, 0, s(0.33)) }}>
          50 FREISPIELE <span style={{ color: C.red2 }}>FÜR DEINE REGISTRIERUNG</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 40, color: C.grey, ...riseS(f, s(0.2), s(0.33), 20) }}>
          So einfach geht’s – in drei Schritten:
        </div>
      </div>
      <div style={{ position: "absolute", left: 170, right: 170, top: 470, display: "flex", gap: 34 }}>
        {STEPS.map((st, i) => {
          const a = s(0.4 + i * 0.5);
          const t = prog(f, a, s(0.33));
          const check = prog(f, a + s(0.23), s(0.27));
          return (
            <div
              key={st.n}
              style={{
                flex: 1,
                height: 340,
                padding: "40px 38px",
                borderRadius: 22,
                backgroundColor: C.panel,
                border: `2px solid ${i === 2 ? C.gold2 : "rgba(255,255,255,0.12)"}`,
                display: "flex",
                flexDirection: "column",
                opacity: t,
                translate: `0px ${interpolate(t, [0, 1], [120, 0])}px`,
                scale: String(interpolate(t, [0, 1], [1.08, 1])),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: C.red,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 56,
                    fontWeight: 900,
                    color: C.white,
                  }}
                >
                  {st.n}
                </div>
                <svg width="74" height="74" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="29" fill="none" stroke={C.gold2} strokeWidth="4" opacity={check} />
                  <path d="M19 33 L28 42 L46 23" fill="none" stroke={C.gold2} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44" strokeDashoffset={44 * (1 - check)} />
                </svg>
              </div>
              <div style={{ marginTop: "auto", fontSize: 50, fontWeight: 900, color: C.white, lineHeight: 1.1 }}>{st.t}</div>
              <div style={{ marginTop: 10, fontSize: 32, color: C.mute }}>{st.s}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Reels: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const stops: [number, number, number] = [s(1.0), s(1.5), s(2.0)];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <TvStage />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", zIndex: 3 }}>
        <div style={{ fontSize: 76, fontWeight: 900, fontStyle: "italic", color: C.white, ...riseS(f, 0, s(0.33)) }}>
          Dreh die Walzen <span style={{ color: C.red2 }}>eines Top-Slots</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 44, fontWeight: 700, color: C.white, scale: String(popE(f, s(2.07), s(0.33))) }}>
          Jedes Freispiel: <span style={{ ...goldText, filter: goldShadow, fontWeight: 900 }}>0,10 €</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 230, width: 1920, height: 800, opacity: prog(f, 0, s(0.27)) }}>
        <div style={{ position: "absolute", left: 300, top: 40, width: 1320, height: 720 }}>
          <SparkleTrail width={1320} height={720} start={s(0.13)} layer="back" />
        </div>
        <GoldDrum width={1920} height={800} start={s(0.2)} stops={stops} finals={[1, 0, 3]} view="front" coins={false} cameraZ={9.3} />
        <div style={{ position: "absolute", left: 300, top: 40, width: 1320, height: 720 }}>
          <SparkleTrail width={1320} height={720} start={s(0.13)} layer="front" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const beat = s(0.5);
  const pulse = 1 + Math.max(0, Math.sin(((f - s(0.5)) / beat) * Math.PI * 2)) * 0.04;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <TvStage />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: C.grey, letterSpacing: 1, ...riseS(f, 0, s(0.33), 20) }}>
          Deine Online-Spielothek in Deutschland
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 170,
            fontWeight: 900,
            fontStyle: "italic",
            lineHeight: 1,
            ...goldText,
            filter: goldShadow,
            scale: String(interpolate(popE(f, 0, s(0.33)), [0, 1], [1.45, 1])),
            opacity: prog(f, 0, s(0.17)),
          }}
        >
          50 FREISPIELE
        </div>
        <div style={{ marginTop: 18, fontSize: 52, fontWeight: 900, letterSpacing: 4, color: C.white, scale: String(popE(f, s(0.27), s(0.33))) }}>
          OHNE EINZAHLUNG
        </div>
        <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 50 }}>
          <div
            style={{
              padding: "26px 74px",
              borderRadius: 8,
              backgroundColor: C.red,
              color: C.white,
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: 2,
              boxShadow: `0 16px 50px ${C.red}aa`,
              scale: String(popE(f, s(0.5), s(0.33)) * pulse),
            }}
          >
            JETZT REGISTRIEREN
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: C.white, ...riseS(f, s(0.8), s(0.33), 20) }}>slotmagie.de</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 170,
            right: 170,
            top: 815,
            fontSize: 24,
            lineHeight: 1.4,
            color: C.mute,
            textAlign: "center",
            opacity: prog(f, s(0.67), s(0.33)),
          }}
        >
          Nur für Neukunden nach Registrierung & Verifizierung, ohne Einzahlung. 50 Freispiele à 0,10 €. Gewinne 40× innerhalb von 5 Tagen
          umsetzen, max. 100 € auszahlbar. Einmal pro Kunde/Haushalt. Bonusbedingungen & AGB von slotmagie.de gelten.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ */
const TvLegal: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 170,
      right: 170,
      bottom: 64,
      padding: "14px 26px",
      borderRadius: 12,
      backgroundColor: C.white,
      fontFamily: FONT,
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
        width: 62,
        height: 62,
        borderRadius: "50%",
        border: `4px solid ${C.red}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 25,
        fontWeight: 900,
      }}
    >
      18+
    </div>
    <div style={{ fontSize: 30, fontWeight: 700 }}>Glücksspiel kann süchtig machen. Hilfe unter buwei.de</div>
    <div style={{ marginLeft: "auto", fontSize: 22, color: "#222", textAlign: "right", lineHeight: 1.3 }}>
      Lizenziert · GGL-Whitelist
      <br />
      Es gelten die AGB von slotmagie.de
    </div>
  </div>
);

const TvLogo: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const p = popE(f, 0, s(0.33));
  return (
    <div
      style={{
        position: "absolute",
        top: 58,
        left: 170,
        scale: String(interpolate(p, [0, 1], [0.7, 1])),
        opacity: Math.min(1, p * 1.5),
        transformOrigin: "left top",
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.8))",
      }}
    >
      <Logo width={340} />
    </div>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const o = TV_CUTS.map(s).reduce(
    (m, c) => Math.max(m, f >= c ? interpolate(f, [c, c + s(0.2)], [0.5, 0], { extrapolateRight: "clamp" }) : 0),
    0,
  );
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: o }} />;
};

export const SlotMagieTv: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  const [c1, c2, c3] = TV_CUTS.map(s);
  const end = s(TV_DURATION);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence name="Hook 50" from={0} durationInFrames={c1}>
        <Hook />
      </Sequence>
      <Sequence name="3 Schritte" from={c1} durationInFrames={c2 - c1}>
        <Punch>
          <Steps />
        </Punch>
      </Sequence>
      <Sequence name="Walze" from={c2} durationInFrames={c3 - c2}>
        <Punch>
          <Reels />
        </Punch>
      </Sequence>
      <Sequence name="CTA" from={c3} durationInFrames={end - c3}>
        <Punch>
          <Cta />
        </Punch>
      </Sequence>
      <Flash />
      <TvLogo />
      <TvLegal />
    </AbsoluteFill>
  );
};
