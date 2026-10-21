import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop, C, Eyebrow, FONT, Icon, p, reveal } from "../theme";

/* Instagram-Reel (1080x1920) versions of the BUZZ explainer scenes.
   Key content stays between y=230 and y=1500 (Reels UI safe area). */

const WORDS = ["Energie.", "Kraft.", "Balance.", "Gesundheit."];
const STEP = 22;

export const ReelIntro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 90, right: 90, top: 620 }}>
        <div style={reveal(f, 0, 20, 20)}>
          <Eyebrow>Fitness · Health · Recovery</Eyebrow>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
            color: C.paper,
            ...reveal(f, 4, 22, 60),
          }}
        >
          Mehr
        </div>
        <div style={{ position: "relative", height: 200, marginTop: 10, overflow: "hidden" }}>
          {WORDS.map((w, i) => {
            const s = 8 + i * STEP;
            const last = i === WORDS.length - 1;
            const inP = p(f, s, 14);
            const outP = last ? 0 : p(f, s + STEP, 12);
            return (
              <div
                key={w}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  fontSize: w.length > 9 ? 168 : 190,
                  fontWeight: 800,
                  letterSpacing: -4,
                  lineHeight: 1,
                  color: C.cyan,
                  opacity: inP * (1 - outP),
                  translate: `0px ${interpolate(inP, [0, 1], [120, 0]) + interpolate(outP, [0, 1], [0, -120])}px`,
                  filter: `blur(${(1 - inP) * 8 + outP * 8}px)`,
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 50, height: 4, backgroundColor: C.line, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              backgroundColor: C.cyan,
              width: `${interpolate(f, [8, 8 + STEP * 4], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FACTS = [
  { icon: "person", big: "1:1", text: "Personal Training" },
  { icon: "group", big: "6", text: "Personal Coaches" },
  { icon: "group", big: "max. 16", text: "pro Kurs" },
];

export const ReelPromise: React.FC = () => {
  const f = useCurrentFrame();
  const cup = p(f, 0, 30);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop ring={false} />
      <Img
        src={staticFile("buzz/icon_claim_ondark.svg")}
        style={{
          position: "absolute",
          width: 380,
          left: 350,
          top: 305,
          opacity: cup,
          scale: String(interpolate(cup, [0, 1], [0.9, 1])),
          rotate: `${interpolate(f, [0, 135], [-8, 4])}deg`,
          filter: `drop-shadow(0 0 60px ${C.cyan}55)`,
        }}
      />
      <div style={{ position: "absolute", left: 90, right: 90, top: 720 }}>
        <div style={reveal(f, 4, 20, 20)}>
          <Eyebrow>Personal Support</Eyebrow>
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 86,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: C.paper,
            ...reveal(f, 10, 26, 50),
          }}
        >
          Persönliche Betreuung <span style={{ color: C.cyan }}>statt anonymem Studio.</span>
        </div>
        <div style={{ marginTop: 30, fontSize: 40, lineHeight: 1.35, color: C.muted, ...reveal(f, 24, 24, 30) }}>
          Ein Team, das dich kennt – vom ersten Gespräch bis zu deinem Ziel.
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1240, display: "flex", gap: 20 }}>
        {FACTS.map((x, i) => (
          <div
            key={x.text}
            style={{
              flex: 1,
              padding: "26px 22px",
              borderRadius: 22,
              backgroundColor: C.card,
              border: `1.5px solid ${C.line}`,
              ...reveal(f, 44 + i * 8, 22, 40),
            }}
          >
            <Icon name={x.icon} size={50} />
            <div style={{ marginTop: 12, fontSize: 50, fontWeight: 800, color: C.paper, lineHeight: 1 }}>{x.big}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: C.muted, marginTop: 6 }}>{x.text}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const TILES = [
  { icon: "snow", title: "Kältekammer", sub: "bis −110 °C" },
  { icon: "sun", title: "Rotlicht", sub: "Regeneration" },
  { icon: "scan", title: "Bodyscan", sub: "Körperanalyse" },
  { icon: "group", title: "Kleine Gruppen", sub: "max. 16 Personen" },
  { icon: "cup", title: "Café & Lounge", sub: "Shakes & Frühstück" },
];

export const ReelExtras: React.FC = () => {
  const f = useCurrentFrame();
  const rating = interpolate(f, [70, 110], [0, 4.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 90, right: 90, top: 305 }}>
        <div style={reveal(f, 0, 20, 20)}>
          <Eyebrow>Mehr als ein Studio</Eyebrow>
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.02,
            color: C.paper,
            ...reveal(f, 6, 24, 40),
          }}
        >
          Training.
          <br />
          Regeneration.
          <br />
          <span style={{ color: C.cyan }}>Genuss.</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 690,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 22,
        }}
      >
        {TILES.map((t, i) => {
          const r = p(f, 20 + i * 7, 22);
          const wide = i === TILES.length - 1;
          return (
            <div
              key={t.title}
              style={{
                gridColumn: wide ? "1 / span 2" : undefined,
                height: 190,
                padding: "26px 30px",
                borderRadius: 26,
                backgroundColor: i === 0 ? "rgba(0,176,235,0.12)" : C.card,
                border: `1.5px solid ${i === 0 ? C.cyan : C.line}`,
                display: "flex",
                flexDirection: wide ? "row" : "column",
                alignItems: wide ? "center" : undefined,
                gap: wide ? 30 : 0,
                opacity: r,
                translate: `0px ${interpolate(r, [0, 1], [70, 0])}px`,
              }}
            >
              <Icon name={t.icon} size={60} />
              <div style={{ marginTop: wide ? 0 : "auto" }}>
                <div style={{ fontSize: 38, fontWeight: 800, color: C.paper, lineHeight: 1.1 }}>{t.title}</div>
                <div style={{ marginTop: 6, fontSize: 27, color: C.muted }}>{t.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1345,
          fontSize: 36,
          fontWeight: 600,
          color: C.muted,
          ...reveal(f, 60, 22, 20),
        }}
      >
        <div>
          <span style={{ color: C.paper, fontWeight: 800 }}>1.100 m²</span> ruhige Wohlfühl-Atmosphäre
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: C.paper, fontWeight: 800 }}>{rating.toFixed(1).replace(".", ",")}</span>
          {[0, 1, 2, 3, 4].map((k) => (
            <span key={k} style={{ opacity: p(f, 74 + k * 5, 10) }}>
              <Icon name="star" size={36} color={C.sky} />
            </span>
          ))}
          <span>bei Google</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LOGO_H = 230;
const ICON_W = (560 / 546) * LOGO_H;
const WORD_W = (1301 / 546) * LOGO_H;
const GAP = (102 / 546) * LOGO_H;

export const ReelCta: React.FC = () => {
  const f = useCurrentFrame();
  const icon = p(f, 4, 30);
  const word = p(f, 18, 30);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop ring={false} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 470, paddingLeft: 90, paddingRight: 90, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: GAP }}>
          <Img
            src={staticFile("buzz/icon_claim_ondark.svg")}
            style={{
              width: ICON_W,
              height: LOGO_H,
              opacity: icon,
              scale: String(interpolate(icon, [0, 1], [0.7, 1])),
              rotate: `${interpolate(icon, [0, 1], [-50, 0])}deg`,
            }}
          />
          <div style={{ width: WORD_W, height: LOGO_H, clipPath: `inset(0 ${100 - word * 100}% 0 0)` }}>
            <Img src={staticFile("buzz/word_claim_ondark.svg")} style={{ width: WORD_W, height: LOGO_H }} />
          </div>
        </div>
        <div style={{ marginTop: 90, fontSize: 62, fontWeight: 300, fontStyle: "italic", lineHeight: 1.2, color: C.paper, ...reveal(f, 46, 26, 30) }}>
          Weil deine beste Zeit
          <br />
          es wert ist.
        </div>
        <div
          style={{
            marginTop: 70,
            padding: "32px 60px",
            borderRadius: 999,
            backgroundColor: C.cyan,
            color: C.ink,
            fontSize: 44,
            fontWeight: 800,
            lineHeight: 1.15,
            boxShadow: `0 0 ${50 + Math.sin(f / 9) * 14}px ${C.cyan}66`,
            ...reveal(f, 64, 24, 30),
          }}
        >
          Kostenloses Erstgespräch
          <br />
          buchen
        </div>
        <div style={{ marginTop: 50, fontSize: 36, fontWeight: 600, letterSpacing: 1, lineHeight: 1.45, color: C.muted, ...reveal(f, 80, 24, 20) }}>
          buzz.wien
          <br />
          Dirmhirngasse 112, 1230 Wien
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
