import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop, C, Eyebrow, FONT, Icon, p, reveal } from "./theme";

const FACTS = [
  { icon: "person", big: "1:1", text: "Personal Training" },
  { icon: "group", big: "6", text: "Personal Coaches" },
  { icon: "group", big: "max. 16", text: "pro Kurs" },
];

export const PromiseScene: React.FC = () => {
  const f = useCurrentFrame();
  const cup = p(f, 0, 30);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop ring={false} />
      <Img
        name="Cup icon"
        src={staticFile("buzz/icon_claim_ondark.svg")}
        style={{
          position: "absolute",
          width: 520,
          right: 150,
          top: 170,
          opacity: cup,
          scale: String(interpolate(cup, [0, 1], [0.9, 1])),
          rotate: `${interpolate(f, [0, 135], [-8, 4])}deg`,
          filter: `drop-shadow(0 0 60px ${C.cyan}55)`,
        }}
      />
      <div style={{ position: "absolute", left: 200, top: 210, width: 980 }}>
        <Interactive.Div name="Promise eyebrow" style={reveal(f, 4, 20, 20)}>
          <Eyebrow>Personal Support</Eyebrow>
        </Interactive.Div>
        <Interactive.Div
          name="Promise headline"
          style={{
            marginTop: 34,
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: C.paper,
            ...reveal(f, 10, 26, 50),
          }}
        >
          Persönliche Betreuung
          <br />
          <span style={{ color: C.cyan }}>statt anonymem Studio.</span>
        </Interactive.Div>
        <Interactive.Div
          name="Promise sub"
          style={{
            marginTop: 34,
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.35,
            color: C.muted,
            ...reveal(f, 24, 24, 30),
          }}
        >
          Ein Team, das dich kennt – vom ersten Gespräch bis zu deinem Ziel.
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          bottom: 130,
          display: "flex",
          gap: 30,
        }}
      >
        {FACTS.map((x, i) => (
          <div
            key={x.text}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "30px 36px",
              borderRadius: 22,
              backgroundColor: C.card,
              border: `1.5px solid ${C.line}`,
              ...reveal(f, 44 + i * 8, 22, 40),
            }}
          >
            <Icon name={x.icon} size={58} />
            <div>
              <div style={{ fontSize: 54, fontWeight: 800, color: C.paper, lineHeight: 1 }}>
                {x.big}
              </div>
              <div style={{ fontSize: 30, fontWeight: 600, color: C.muted, marginTop: 6 }}>
                {x.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
