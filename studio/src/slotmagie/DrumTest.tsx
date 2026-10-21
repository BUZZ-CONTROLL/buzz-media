import React from "react";
import { AbsoluteFill } from "remotion";
import { GoldDrum } from "./GoldDrum";
import { SparkleTrail } from "./Sparkles";

export const DrumTest: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #b3000b 0%, #3a0003 45%, #000 75%)" }}>
    <SparkleTrail width={1080} height={1080} start={10} layer="back" />
    <GoldDrum width={1080} height={1080} start={10} stops={[40, 55, 70]} finals={[1, 0, 3]} />
    <SparkleTrail width={1080} height={1080} start={10} layer="front" />
  </AbsoluteFill>
);
