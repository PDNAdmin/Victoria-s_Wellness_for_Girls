import { Composition } from "remotion";
import { Highlights, FPS, DURATION } from "./Highlights.jsx";

// Design system video plan: "Outreach highlights", 20 s, 1920 x 1080, 30 fps.
export const Root = () => (
  <Composition
    id="OutreachHighlights"
    component={Highlights}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
