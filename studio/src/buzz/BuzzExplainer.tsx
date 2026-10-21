import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { IntroScene } from "./IntroScene";
import { PromiseScene } from "./PromiseScene";
import { StepsScene } from "./StepsScene";
import { ExtrasScene } from "./ExtrasScene";
import { BuzzCtaScene } from "./CtaScene";

const T = () => (
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
);

export const BuzzExplainer: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Intro" durationInFrames={105}>
      <IntroScene />
    </TransitionSeries.Sequence>
    {T()}
    <TransitionSeries.Sequence name="Versprechen" durationInFrames={135}>
      <PromiseScene />
    </TransitionSeries.Sequence>
    {T()}
    <TransitionSeries.Sequence name="Weg zum Ziel" durationInFrames={330}>
      <StepsScene />
    </TransitionSeries.Sequence>
    {T()}
    <TransitionSeries.Sequence name="Extras" durationInFrames={165}>
      <ExtrasScene />
    </TransitionSeries.Sequence>
    {T()}
    <TransitionSeries.Sequence name="CTA" durationInFrames={225}>
      <BuzzCtaScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
