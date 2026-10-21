import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./shared";
import { C, FONT, ease } from "./theme";

const line = (frame: number, start: number) => ({
  opacity: interpolate(frame, [start, start + 10], [0, 1], {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  }),
  translate: `0px ${interpolate(frame, [start, start + 16], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  })}px`,
});

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: "0 90px",
          fontWeight: 900,
          fontSize: 132,
          lineHeight: 1.02,
          letterSpacing: -4,
          color: C.text,
        }}
      >
        <Interactive.Div name="Hook line 1" style={line(frame, 2)}>
          Lust auf Sport,
        </Interactive.Div>
        <Interactive.Div name="Hook line 2" style={line(frame, 14)}>
          aber keiner
        </Interactive.Div>
        <Interactive.Div
          name="Hook line 3"
          style={{ ...line(frame, 26), color: C.blue }}
        >
          hat Zeit?
        </Interactive.Div>
        <Interactive.Div
          name="Hook underline"
          style={{
            marginTop: 30,
            height: 14,
            borderRadius: 7,
            backgroundColor: C.blue,
            width: interpolate(frame, [36, 52], [0, 520], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: ease,
            }),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
