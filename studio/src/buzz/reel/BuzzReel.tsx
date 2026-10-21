import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { StepsScene } from "../StepsScene";
import { ReelCta, ReelExtras, ReelIntro, ReelPromise } from "./ReelScenes";

const T = () => <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />;

export const BuzzReel: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Intro" durationInFrames={105}>
      <ReelIntro />
    </TransitionSeries.Sequence>
    {T()}
    <TransitionSeries.Sequence name="Versprechen" durationInFrames={135}>
      <ReelPromise />
    </TransitionSeries.Sequence>
    {T()}
    <TransitionSeries.Sequence name="Weg zum Ziel" durationInFrames={330}>
      <StepsScene vertical />
    </TransitionSeries.Sequence>
    {T()}
    <TransitionSeries.Sequence name="Extras" durationInFrames={165}>
      <ReelExtras />
    </TransitionSeries.Sequence>
    {T()}
    <TransitionSeries.Sequence name="CTA" durationInFrames={225}>
      <ReelCta />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
