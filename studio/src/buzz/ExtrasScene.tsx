import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, C, Eyebrow, FONT, Icon, p, reveal } from "./theme";

const TILES = [
  { icon: "snow", title: "Kältekammer", sub: "bis −110 °C" },
  { icon: "sun", title: "Rotlicht", sub: "Regeneration" },
  { icon: "scan", title: "Bodyscan", sub: "Körperanalyse" },
  { icon: "group", title: "Kleine Gruppen", sub: "max. 16 Personen" },
  { icon: "cup", title: "Café & Lounge", sub: "Shakes & Frühstück" },
];

export const ExtrasScene: React.FC = () => {
  const f = useCurrentFrame();
  const rating = interpolate(f, [70, 110], [0, 4.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 200, top: 130, right: 200 }}>
        <Interactive.Div name="Extras eyebrow" style={reveal(f, 0, 20, 20)}>
          <Eyebrow>Mehr als ein Studio</Eyebrow>
        </Interactive.Div>
        <Interactive.Div
          name="Extras headline"
          style={{
            marginTop: 30,
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.02,
            color: C.paper,
            ...reveal(f, 6, 24, 40),
          }}
        >
          Training. Regeneration. <span style={{ color: C.cyan }}>Genuss.</span>
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 470,
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 24,
        }}
      >
        {TILES.map((t, i) => {
          const r = p(f, 20 + i * 7, 22);
          return (
            <div
              key={t.title}
              style={{
                height: 330,
                padding: "40px 32px",
                borderRadius: 28,
                backgroundColor: i === 0 ? "rgba(0,176,235,0.12)" : C.card,
                border: `1.5px solid ${i === 0 ? C.cyan : C.line}`,
                display: "flex",
                flexDirection: "column",
                opacity: r,
                translate: `0px ${interpolate(r, [0, 1], [70, 0])}px`,
              }}
            >
              <Icon name={t.icon} size={72} />
              <div style={{ marginTop: "auto", fontSize: 36, fontWeight: 800, color: C.paper, lineHeight: 1.1 }}>
                {t.title}
              </div>
              <div style={{ marginTop: 8, fontSize: 26, fontWeight: 400, color: C.muted }}>
                {t.sub}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          bottom: 110,
          display: "flex",
          alignItems: "center",
          gap: 60,
          fontSize: 38,
          fontWeight: 600,
          color: C.muted,
          ...reveal(f, 60, 22, 20),
        }}
      >
        <div>
          <span style={{ color: C.paper, fontWeight: 800 }}>1.100 m²</span> ruhige Wohlfühl-Atmosphäre
        </div>
        <div style={{ width: 2, height: 44, backgroundColor: C.line }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: C.paper, fontWeight: 800 }}>
            {rating.toFixed(1).replace(".", ",")}
          </span>
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
