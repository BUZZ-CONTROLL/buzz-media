import React from "react";
import { AbsoluteFill, interpolate, Series, useCurrentFrame } from "remotion";
import { Punch } from "./theme";
import { S1Hook, S2Access, S3Hygiene, S4Equipment, S5Coach, S6Prices, S7Cta } from "./Scenes";

// 120 BPM grid: 1 beat = 15 frames. Hard cuts on beats 6, 14, 24, 34, 42, 52.
export const B24_SCENES: [string, number, React.FC][] = [
  ["Hook", 90, S1Hook],
  ["Zutritt", 120, S2Access],
  ["Hygiene", 150, S3Hygiene],
  ["Geräte", 150, S4Equipment],
  ["Coach", 120, S5Coach],
  ["Preise", 150, S6Prices],
  ["CTA", 120, S7Cta],
];

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  let acc = 0;
  let o = 0;
  for (const [, d] of B24_SCENES.slice(0, -1)) {
    acc += d;
    if (f >= acc) o = Math.max(o, interpolate(f, [acc, acc + 6], [0.35, 0], { extrapolateRight: "clamp" }));
  }
  return <AbsoluteFill style={{ backgroundColor: "#00b0eb", opacity: o, mixBlendMode: "screen" }} />;
};

export const Buzz24Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
    <Series>
      {B24_SCENES.map(([name, d, Comp], i) => (
        <Series.Sequence key={name} name={name} durationInFrames={d}>
          {i === 0 ? <Comp /> : (
            <Punch>
              <Comp />
            </Punch>
          )}
        </Series.Sequence>
      ))}
    </Series>
    <Flash />
  </AbsoluteFill>
);
