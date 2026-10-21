import React from "react";
import { Composition, Folder } from "remotion";
import { Teaser } from "./teaser/Teaser";
import { HookScene } from "./teaser/HookScene";
import { LogoScene } from "./teaser/LogoScene";
import { PlacesScene } from "./teaser/PlacesScene";
import { PartnerScene } from "./teaser/PartnerScene";
import { MatchScene } from "./teaser/MatchScene";
import { CtaScene } from "./teaser/CtaScene";
import { BuzzExplainer } from "./buzz/BuzzExplainer";
import { IntroScene } from "./buzz/IntroScene";
import { PromiseScene } from "./buzz/PromiseScene";
import { StepsScene } from "./buzz/StepsScene";
import { ExtrasScene } from "./buzz/ExtrasScene";
import { BuzzCtaScene } from "./buzz/CtaScene";

import { SlotMagieInsta } from "./slotmagie/SlotMagieInsta";
import { DrumTest } from "./slotmagie/DrumTest";
import { SlotMagieTv } from "./slotmagie/TvSpot";
import { BuzzReel } from "./buzz/reel/BuzzReel";
import { Buzz24Reel } from "./buzz24/Buzz24Reel";
import { MagicReel } from "./slotmagie2/MagicReel";
import { CrazyReel } from "./crazybuzzer/CrazyReel";
import { CrazyReelCI } from "./crazybuzzer/CrazyReelCI";
import { CrazyHalloween } from "./crazybuzzer/CrazyHalloween";
import { CrazyDaily, DAILY_DEFAULT } from "./crazybuzzer/CrazyDaily";

const W = { width: 1920, height: 1080, fps: 30 };

const V = { width: 1080, height: 1920, fps: 30 };

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Teaser-Scenes">
      <Composition id="Hook" component={HookScene} durationInFrames={75} {...V} />
      <Composition id="Logo" component={LogoScene} durationInFrames={80} {...V} />
      <Composition id="Plaetze" component={PlacesScene} durationInFrames={90} {...V} />
      <Composition id="Partner" component={PartnerScene} durationInFrames={90} {...V} />
      <Composition id="Match" component={MatchScene} durationInFrames={90} {...V} />
      <Composition id="CTA" component={CtaScene} durationInFrames={75} {...V} />
    </Folder>
    <Composition id="Teaser-9x16" component={Teaser} durationInFrames={450} {...V} />
    <Folder name="BUZZ-Scenes">
      <Composition id="BUZZ-Intro" component={IntroScene} durationInFrames={105} {...W} />
      <Composition id="BUZZ-Versprechen" component={PromiseScene} durationInFrames={135} {...W} />
      <Composition id="BUZZ-Weg" component={StepsScene} durationInFrames={330} {...W} />
      <Composition id="BUZZ-Extras" component={ExtrasScene} durationInFrames={165} {...W} />
      <Composition id="BUZZ-CTA" component={BuzzCtaScene} durationInFrames={225} {...W} />
    </Folder>
    <Composition id="BUZZ-Erklaervideo-16x9" component={BuzzExplainer} durationInFrames={900} {...W} />
    <Composition id="SlotMagie-50FS-9x16" component={SlotMagieInsta} durationInFrames={450} width={1080} height={1920} fps={30} />
    <Composition id="DrumTest" component={DrumTest} durationInFrames={90} width={1080} height={1080} fps={30} />
    <Composition id="SlotMagie-TV-16x9-25fps" component={SlotMagieTv} durationInFrames={375} width={1920} height={1080} fps={25} />
    <Composition id="BUZZ-Reel-9x16" component={BuzzReel} durationInFrames={900} width={1080} height={1920} fps={30} />
    <Composition id="BUZZ24-Reel-9x16" component={Buzz24Reel} durationInFrames={900} width={1080} height={1920} fps={30} />
    <Composition id="SlotMagie-Magie-9x16" component={MagicReel} durationInFrames={450} width={1080} height={1920} fps={30} />
    <Composition id="CrazyBuzzer-Reel-9x16" component={CrazyReel} durationInFrames={600} width={1080} height={1920} fps={30} />
    <Composition id="CrazyBuzzer-CI-Reel-9x16" component={CrazyReelCI} durationInFrames={600} width={1080} height={1920} fps={30} />
    <Composition id="CrazyBuzzer-Halloween-9x16" component={CrazyHalloween} durationInFrames={450} width={1080} height={1920} fps={30} />
    <Composition id="CrazyBuzzer-Daily-9x16" component={CrazyDaily} defaultProps={DAILY_DEFAULT} durationInFrames={450} width={1080} height={1920} fps={30} />
  </>
);
