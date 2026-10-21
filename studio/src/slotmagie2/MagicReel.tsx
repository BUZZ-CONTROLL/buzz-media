import React from "react";
import { AbsoluteFill, interpolate, Series, useCurrentFrame } from "remotion";
import { C, FONT, Logo, Stage, p, pop, rise } from "../slotmagie/theme";
import { Burst, CardFront, MagicCard, TopHat, Wand, goldShadow, goldText } from "./Props";

/* Feed-safe layout: logo 300–420, content 460–1330, legal 1350–1470 (all inside 4:5 crop + above Reels UI). */

const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 96, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: size, lineHeight: 1.02, color: C.white, textAlign: "center", ...style }}>{children}</div>
);

/* ---------- 1 · HOOK (75 f) ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 2.2) * interpolate(f, [0, 16, 40, 60], [0, 5, 3, 0], { extrapolateRight: "clamp" });
  const tap = (c: number) => interpolate(f, [c - 4, c, c + 5], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wandIn = p(f, 4, 12);
  const ang = 118 + 22 * Math.max(tap(22), tap(37)) - (1 - wandIn) * 40;
  const glow = Math.min(1, p(f, 22, 10) * 0.6 + p(f, 37, 10) * 0.5);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: 90, right: 90, top: 470 }}>
        <Title size={84} style={rise(f, 6, 10, 40)}>
          Deine erste
          <br />
          Einzahlung?
        </Title>
        <Title size={92} style={{ marginTop: 18, ...goldText, filter: goldShadow, ...rise(f, 40, 10, 40) }}>
          Wir zaubern
          <br />
          was draus.
        </Title>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 230,
          top: 900,
          width: 460,
          rotate: `${wob}deg`,
          transformOrigin: "50% 100%",
          scale: String(pop(f, 0, 14)),
        }}
      >
        <TopHat width={460} glow={glow} />
      </div>
      {/* wand pivot at (950,620) */}
      <div style={{ position: "absolute", left: 950, top: 600, width: 440, height: 40, transformOrigin: "0px 20px", rotate: `${ang}deg`, opacity: wandIn }}>
        <Wand length={440} />
      </div>
      <Burst x={600} y={965} at={22} seed="h1" />
      <Burst x={560} y={965} at={37} n={36} spread={340} seed="h2" />
    </AbsoluteFill>
  );
};

/* ---------- 2 · THE CHOICE (165 f) ---------- */
const Choice: React.FC = () => {
  const f = useCurrentFrame();
  const riseCard = (s: number) => {
    const t = p(f, s, 20);
    return { translate: `0px ${interpolate(t, [0, 1], [420, 0])}px`, scale: String(interpolate(t, [0, 1], [0.4, 1])), opacity: Math.min(1, t * 2) };
  };
  const flip1 = p(f, 35, 14);
  const flip2 = p(f, 50, 14);
  // alternate highlight after both are revealed (on the beat)
  const hi = f > 75 ? Math.floor((f - 75) / 15) % 2 : -1;
  const lift = (i: number) => (hi === i ? -14 : 0);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <Title size={88} style={{ position: "absolute", left: 90, right: 90, top: 460, ...rise(f, 0, 10, 40) }}>
        Wähl deine <span style={{ ...goldText, filter: goldShadow }}>Magie:</span>
      </Title>
      <div style={{ position: "absolute", left: 540 - 190, top: 1010, width: 380 }}>
        <TopHat width={380} glow={0.9} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 600, display: "flex", justifyContent: "space-between" }}>
        <div style={{ ...riseCard(8), rotate: `${-4 + lift(0) * 0.1}deg`, marginTop: lift(0) }}>
          <MagicCard
            width={410}
            flip={flip1}
            variant="gold"
            front={<CardFront big="250" mid="FREISPIELE" small="schon ab 1 € Einzahlung" dark />}
          />
        </div>
        <div style={{ ...riseCard(18), rotate: `${4 - lift(1) * 0.1}deg`, marginTop: lift(1) }}>
          <MagicCard
            width={410}
            flip={flip2}
            variant="red"
            front={<CardFront big="100 %" mid="BONUS" small="wir verdoppeln bis 100 €" />}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 70,
          top: 820,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "#0b0b0b",
          border: `5px solid ${C.gold2}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          fontWeight: 900,
          fontStyle: "italic",
          color: C.white,
          boxShadow: `0 0 40px ${C.gold2}88`,
          scale: String(pop(f, 66, 12)),
        }}
      >
        oder
      </div>
      <Burst x={300} y={900} at={35} seed="c1" />
      <Burst x={780} y={900} at={50} seed="c2" />
    </AbsoluteFill>
  );
};

/* ---------- 3 · NO CODE (90 f) ---------- */
const STEPS = ["Registrieren", "Einzahlen", "Bonus wählen"];
const NoCode: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <Title size={92} style={{ position: "absolute", left: 90, right: 90, top: 470, ...rise(f, 0, 10, 40) }}>
        Kein Bonus-Code
        <br />
        <span style={{ color: C.red2 }}>nötig.</span>
      </Title>
      <div style={{ position: "absolute", left: 140, right: 140, top: 740, display: "flex", flexDirection: "column", gap: 22 }}>
        {STEPS.map((s, i) => {
          const t = p(f, 14 + i * 15, 10);
          return (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "22px 34px",
                borderRadius: 18,
                background: C.panel,
                border: "2px solid rgba(255,255,255,0.14)",
                opacity: t,
                translate: `${interpolate(t, [0, 1], [-200, 0])}px 0px`,
              }}
            >
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.red, color: C.white, fontSize: 40, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 50, fontWeight: 900, color: C.white }}>{s}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 1110,
          padding: "26px 30px",
          borderRadius: 22,
          background: "linear-gradient(160deg, #fff1b8, #f6c544 45%, #c98a12)",
          color: "#2a1600",
          textAlign: "center",
          fontSize: 44,
          fontWeight: 900,
          lineHeight: 1.15,
          boxShadow: `0 0 50px ${C.gold2}66`,
          scale: String(pop(f, 58, 12)),
        }}
      >
        + 50 FREISPIELE EXTRA
        <div style={{ fontSize: 30, fontWeight: 700 }}>für deine Verifizierung</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4 · CTA (120 f) ---------- */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.max(0, Math.sin(((f - 20) / 15) * Math.PI * 2)) * 0.04;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: 540 - 150, top: 470, width: 300, scale: String(pop(f, 0, 12)) }}>
        <TopHat width={300} glow={1} />
      </div>
      <Burst x={540} y={520} at={2} n={40} spread={380} seed="e1" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 790, paddingLeft: 90, paddingRight: 90 }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: C.grey, ...rise(f, 6, 10, 20) }}>Deine Online-Spielothek in Deutschland</div>
        <div
          style={{
            marginTop: 34,
            padding: "30px 80px",
            borderRadius: 8,
            background: C.red,
            color: C.white,
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: 2,
            boxShadow: `0 16px 50px ${C.red}aa`,
            scale: String(pop(f, 14, 12) * pulse),
          }}
        >
          JETZT REGISTRIEREN
        </div>
        <div style={{ marginTop: 28, fontSize: 52, fontWeight: 900, color: C.white, ...rise(f, 24, 10, 20) }}>slotmagie.de</div>
        <div style={{ marginTop: 22, fontSize: 36, fontWeight: 700, textAlign: "center", ...goldText, filter: goldShadow, ...rise(f, 30, 10, 20) }}>
          250 Freispiele ab 1 € oder 100 % bis 100 €
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1225,
          fontSize: 22,
          lineHeight: 1.35,
          color: "#9a9a9a",
          textAlign: "center",
          opacity: p(f, 30, 10),
        }}
      >
        Nur für Neukunden, einmalig bei der 1. Einzahlung. 250 Freispiele à 0,10 € in einem ausgewählten Slot: Gewinne 40× in 7 Tagen
        umsetzen, max. 100 € auszahlbar. 100 % Bonus bis 100 € (Mindesteinzahlung 1 €): Einzahlung + Bonus 30× in 7 Tagen umsetzen. AGB &
        Bonusbedingungen von slotmagie.de gelten.
      </div>
    </AbsoluteFill>
  );
};

/* ---------- persistent layers ---------- */
const PinnedLogo: React.FC = () => {
  const f = useCurrentFrame();
  const s = pop(f, 0, 10);
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", scale: String(interpolate(s, [0, 1], [0.7, 1])), opacity: Math.min(1, s * 1.5), filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.8))" }}>
      <Logo width={420} />
    </div>
  );
};

const Legal: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      top: 1350,
      padding: "14px 24px",
      borderRadius: 14,
      backgroundColor: C.white,
      fontFamily: FONT,
      color: C.black,
      display: "flex",
      alignItems: "center",
      gap: 20,
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    }}
  >
    <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: "50%", border: `5px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 29, fontWeight: 900 }}>18+</div>
    <div style={{ flex: 1, fontSize: 27, fontWeight: 700, lineHeight: 1.3 }}>
      Glücksspiel kann süchtig machen. Hilfe unter buwei.de
      <div style={{ fontWeight: 400, fontSize: 22, color: "#222" }}>Lizenziert · GGL-Whitelist · Es gelten die AGB von slotmagie.de</div>
    </div>
  </div>
);

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = [75, 240, 330].reduce((m, c) => Math.max(m, f >= c ? interpolate(f, [c, c + 6], [0.5, 0], { extrapolateRight: "clamp" }) : 0), 0);
  return <AbsoluteFill style={{ backgroundColor: "#fff4c2", opacity: o }} />;
};

const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ scale: String(interpolate(f, [0, 8], [1.07, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) }}>{children}</AbsoluteFill>;
};

export const MagicReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Hook" durationInFrames={75}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence name="Wahl" durationInFrames={165}>
        <Punch>
          <Choice />
        </Punch>
      </Series.Sequence>
      <Series.Sequence name="Ohne Code" durationInFrames={90}>
        <Punch>
          <NoCode />
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
    <Legal />
  </AbsoluteFill>
);
