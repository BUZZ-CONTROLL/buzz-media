import React from "react";
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HookScene } from "./HookScene";
import { LogoScene } from "./LogoScene";
import { PlacesScene } from "./PlacesScene";
import { PartnerScene } from "./PartnerScene";
import { MatchScene } from "./MatchScene";
import { CtaScene } from "./CtaScene";

const slideT = springTiming({ config: { damping: 200 }, durationInFrames: 10 });

export const Teaser: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Hook" durationInFrames={75}>
      <HookScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />
    <TransitionSeries.Sequence name="Logo" durationInFrames={80}>
      <LogoScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={slideT} />
    <TransitionSeries.Sequence name="Plätze" durationInFrames={90}>
      <PlacesScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideT} />
    <TransitionSeries.Sequence name="Partner" durationInFrames={90}>
      <PartnerScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideT} />
    <TransitionSeries.Sequence name="Match" durationInFrames={90}>
      <MatchScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />
    <TransitionSeries.Sequence name="CTA" durationInFrames={75}>
      <CtaScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
