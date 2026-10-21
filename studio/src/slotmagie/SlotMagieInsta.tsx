import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { CtaScene, HookScene, ReelsScene, StepsScene } from "./Scenes";
import { Flash, LegalBar, PinnedLogo, Punch } from "./theme";

// 120 BPM grid: 1 beat = 15 frames. Hard cuts land on beats 5, 12 and 19.
export const CUTS = [75, 180, 285];

export const SlotMagieInsta: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Hook 50" durationInFrames={75}>
        <HookScene />
      </Series.Sequence>
      <Series.Sequence name="3 Schritte" durationInFrames={105}>
        <Punch>
          <StepsScene />
        </Punch>
      </Series.Sequence>
      <Series.Sequence name="Walzen" durationInFrames={105}>
        <Punch>
          <ReelsScene />
        </Punch>
      </Series.Sequence>
      <Series.Sequence name="CTA" durationInFrames={165}>
        <Punch>
          <CtaScene />
        </Punch>
      </Series.Sequence>
    </Series>
    <Flash at={CUTS} />
    <PinnedLogo />
    <LegalBar />
  </AbsoluteFill>
);
