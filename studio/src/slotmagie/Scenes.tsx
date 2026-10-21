import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, GOLD, Stage, p, pop, rise } from "./theme";
import { GoldDrum } from "./GoldDrum";
import { SparkleTrail } from "./Sparkles";

const goldText: React.CSSProperties = {
  backgroundImage: GOLD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
const goldShadow = "drop-shadow(0 6px 0 #6b3d00) drop-shadow(0 0 40px rgba(246,197,68,0.45))";

/** A single digit that spins like a slot reel and lands on `target`. */
const ReelDigit: React.FC<{ target: number; stopAt: number; size: number }> = ({
  target,
  stopAt,
  size,
}) => {
  const f = useCurrentFrame();
  const h = size * 1.05;
  const loops = 3;
  const total = loops * 10 + target;
  const t = interpolate(f, [0, stopAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 4),
  });
  const pos = t * total;
  const blur = Math.max(0, (1 - t) * 14);
  return (
    <div style={{ filter: goldShadow }}>
    <div style={{ height: h, overflow: "hidden", position: "relative" }}>
      <div
        style={{
          translate: `0px ${-pos * h}px`,
          filter: `blur(${blur}px)`,
        }}
      >
        {new Array(total + 1).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              height: h,
              lineHeight: `${h}px`,
              fontSize: size,
              fontWeight: 900,
              fontStyle: "italic",
              textAlign: "center",
              ...goldText,
            }}
          >
            {i % 10}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const land = pop(f, 30, 10);
  const shake = f >= 30 && f < 40 ? Math.sin(f * 3.1) * (40 - f) * 1.6 : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 370, translate: `${shake}px ${-shake * 0.6}px` }}>
        <Interactive.Div
          name="Hook eyebrow"
          style={{
            fontSize: 56,
            fontWeight: 900,
            letterSpacing: 6,
            color: C.white,
            scale: String(pop(f, 0, 8)),
          }}
        >
          WIR SCHENKEN DIR
        </Interactive.Div>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 0,
            scale: String(interpolate(land, [0, 1], [1, 1.06])),
          }}
        >
          <ReelDigit target={5} stopAt={22} size={440} />
          <ReelDigit target={0} stopAt={30} size={440} />
        </div>
        <Interactive.Div
          name="Hook FREISPIELE"
          style={{
            marginTop: -10,
            fontSize: 150,
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: -2,
            color: C.white,
            textShadow: `0 0 50px ${C.red}`,
            opacity: p(f, 30, 6),
            scale: String(interpolate(pop(f, 30, 10), [0, 1], [1.6, 1])),
          }}
        >
          FREISPIELE
        </Interactive.Div>
        <Interactive.Div
          name="Hook badge"
          style={{
            marginTop: 40,
            padding: "18px 44px",
            backgroundColor: C.red,
            borderRadius: 8,
            fontSize: 52,
            fontWeight: 900,
            color: C.white,
            letterSpacing: 2,
            rotate: "-3deg",
            scale: String(pop(f, 45, 10)),
            boxShadow: `0 12px 40px ${C.red}88`,
          }}
        >
          OHNE EINZAHLUNG
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const STEPS = [
  { n: "1", t: "Konto eröffnen", s: "kostenlos bei SlotMagie" },
  { n: "2", t: "Daten vervollständigen", s: "deine Personendaten" },
  { n: "3", t: "Verifizieren", s: "Freispiele werden gutgeschrieben" },
];

export const StepsScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: 80, right: 80, top: 360 }}>
        <Interactive.Div
          name="Steps title"
          style={{
            fontSize: 100,
            fontWeight: 900,
            lineHeight: 1,
            color: C.white,
            ...rise(f, 0, 10, 40),
          }}
        >
          50 FREISPIELE
        </Interactive.Div>
        <Interactive.Div
          name="Steps subtitle"
          style={{
            marginTop: 14,
            fontSize: 62,
            fontWeight: 900,
            color: C.red2,
            ...rise(f, 3, 10, 30),
          }}
        >
          FÜR DEINE REGISTRIERUNG
        </Interactive.Div>
        <Interactive.Div
          name="Steps intro"
          style={{
            marginTop: 30,
            fontSize: 42,
            fontWeight: 400,
            color: C.grey,
            ...rise(f, 6, 10, 20),
          }}
        >
          So einfach geht’s:
        </Interactive.Div>

        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 28 }}>
          {STEPS.map((s, i) => {
            const st = 12 + i * 15;
            const t = p(f, st, 10);
            const check = p(f, st + 7, 8);
            return (
              <div
                key={s.n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 34,
                  padding: "30px 36px",
                  borderRadius: 18,
                  backgroundColor: C.panel,
                  border: `2px solid ${i === 2 ? C.gold2 : "rgba(255,255,255,0.12)"}`,
                  opacity: t,
                  translate: `${interpolate(t, [0, 1], [-260, 0])}px 0px`,
                  scale: String(interpolate(t, [0, 1], [1.08, 1])),
                }}
              >
                <div
                  style={{
                    width: 104,
                    height: 104,
                    flexShrink: 0,
                    borderRadius: "50%",
                    backgroundColor: C.red,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 58,
                    fontWeight: 900,
                    color: C.white,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 52, fontWeight: 900, color: C.white }}>{s.t}</div>
                  <div style={{ fontSize: 34, fontWeight: 400, color: C.mute, marginTop: 4 }}>{s.s}</div>
                </div>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="29" fill="none" stroke={C.gold2} strokeWidth="4" opacity={check} />
                  <path
                    d="M19 33 L28 42 L46 23"
                    fill="none"
                    stroke={C.gold2}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="44"
                    strokeDashoffset={44 * (1 - check)}
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ReelsScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 360 }}>
        <Interactive.Div
          name="Reels title"
          style={{
            fontSize: 88,
            fontWeight: 900,
            fontStyle: "italic",
            color: C.white,
            textAlign: "center",
            lineHeight: 1.05,
            ...rise(f, 0, 10, 30),
          }}
        >
          Dreh die Walzen
          <br />
          <span style={{ color: C.red2 }}>eines Top-Slots</span>
        </Interactive.Div>
        <div style={{ position: "absolute", left: 0, top: 560, width: 1080, height: 1000 }}>
          <div style={{ position: "absolute", inset: 0, opacity: p(f, 0, 8), scale: String(interpolate(p(f, 0, 12), [0, 1], [0.85, 1])) }}>
            <SparkleTrail width={1080} height={1000} start={4} layer="back" />
            <GoldDrum width={1080} height={1000} start={6} stops={[30, 45, 60]} finals={[1, 0, 3]} cameraZ={10.9} />
            <SparkleTrail width={1080} height={1000} start={4} layer="front" />
          </div>
        </div>
        <Interactive.Div
          name="Spin value"
          style={{
            position: "absolute",
            top: 585,
            fontSize: 56,
            fontWeight: 700,
            color: C.white,
            scale: String(pop(f, 62, 10)),
            zIndex: 5,
          }}
        >
          Jedes Freispiel: <span style={{ ...goldText, fontWeight: 900, filter: goldShadow }}>0,10 €</span>
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.max(0, Math.sin(((f - 15) / 15) * Math.PI * 2)) * 0.04;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 360 }}>
        <Interactive.Div
          name="CTA claim"
          style={{
            fontSize: 50,
            fontWeight: 700,
            color: C.grey,
            letterSpacing: 1,
            ...rise(f, 0, 10, 20),
          }}
        >
          Deine Online-Spielothek in Deutschland
        </Interactive.Div>
        <Interactive.Div
          name="CTA offer"
          style={{
            marginTop: 40,
            fontSize: 150,
            fontWeight: 900,
            fontStyle: "italic",
            lineHeight: 1,
            textAlign: "center",
            ...goldText,
            filter: goldShadow,
            scale: String(interpolate(pop(f, 0, 10), [0, 1], [1.5, 1])),
            opacity: p(f, 0, 5),
          }}
        >
          50
          <br />
          FREISPIELE
        </Interactive.Div>
        <Interactive.Div
          name="CTA no deposit"
          style={{
            marginTop: 30,
            fontSize: 56,
            fontWeight: 900,
            color: C.white,
            letterSpacing: 3,
            scale: String(pop(f, 8, 10)),
          }}
        >
          OHNE EINZAHLUNG
        </Interactive.Div>
        <Interactive.Div
          name="CTA button"
          style={{
            marginTop: 54,
            padding: "34px 90px",
            borderRadius: 8,
            backgroundColor: C.red,
            color: C.white,
            fontSize: 66,
            fontWeight: 900,
            letterSpacing: 2,
            boxShadow: `0 16px 50px ${C.red}aa`,
            scale: String(pop(f, 15, 10) * pulse),
          }}
        >
          JETZT REGISTRIEREN
        </Interactive.Div>
        <Interactive.Div
          name="CTA url"
          style={{ marginTop: 36, fontSize: 48, fontWeight: 700, color: C.white, ...rise(f, 24, 10, 20) }}
        >
          slotmagie.de
        </Interactive.Div>
        <Interactive.Div
          name="CTA terms"
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            bottom: 460,
            fontSize: 23,
            fontWeight: 400,
            lineHeight: 1.4,
            color: C.mute,
            textAlign: "center",
            opacity: p(f, 20, 10),
          }}
        >
          Nur für Neukunden nach Registrierung & Verifizierung, ohne Einzahlung. 50 Freispiele à 0,10 €.
          Gewinne 40× innerhalb von 5 Tagen umsetzen, max. 100 € auszahlbar. Einmal pro Kunde/Haushalt.
          Bonusbedingungen & AGB von slotmagie.de gelten.
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
