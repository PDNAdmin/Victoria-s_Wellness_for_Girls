// Outreach highlights: title card, five outreach photos revealed by the brand's bloom shape,
// each with an on-screen caption (so the film needs no separate caption track), and a closing card.
// Colours and curves come from the design system tokens. Photos never move; only the reveal does.
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadAtkinson } from "@remotion/google-fonts/AtkinsonHyperlegible";

const { fontFamily: DISPLAY } = loadJakarta("normal", { weights: ["600", "700"], subsets: ["latin"] });
const { fontFamily: BODY } = loadAtkinson("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const FPS = 30;
export const DURATION = 20 * FPS; // 600 frames

// Tokens (docs/Victoria's Wellness Design System.html)
const C = {
  cream100: "#FAF6EE", cream50: "#FFFDF8", sage100: "#E3ECE2", rose200: "#F0CFD6", rose400: "#D98C9F",
  ink900: "#1B2B24", ink700: "#43524B", green900: "#10302A", green700: "#1F5A45", green600: "#2B7A5C",
  onGreen: "#FAF6EE", onGreenMuted: "#CFE0D6", gold400: "#D9A93F",
};
const bloomEase = Easing.bezier(0.19, 1, 0.22, 1);
const gentle = Easing.bezier(0.25, 0.8, 0.25, 1);

// The organic bloom shape used on the website's hero photo
const BLOOM = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><path d='M100 12c30 0 62 14 76 44s8 70-14 96-58 38-90 30S18 150 14 114 22 44 46 26 70 12 100 12z'/></svg>")}")`;

const Bloom = ({ start = 0, duration = 42, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: bloomEase });
  const size = `${(p * 340).toFixed(2)}%`;
  const done = p >= 0.999;
  return (
    <AbsoluteFill style={{
      ...style,
      WebkitMaskImage: done ? "none" : BLOOM, maskImage: done ? "none" : BLOOM,
      WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
      WebkitMaskPosition: "center", maskPosition: "center",
      WebkitMaskSize: size, maskSize: size,
    }}>{children}</AbsoluteFill>
  );
};

// Words rise into place, one after another
const Rise = ({ text, delay = 0, stagger = 4, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.26em", ...style }}>
      {text.split(" ").map((w, i) => {
        const t = interpolate(frame, [delay + i * stagger, delay + i * stagger + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: gentle });
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.1em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - t) * 110}%)` }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

// A botanical sprig that draws itself (brand symbol: growth)
const Sprig = ({ delay = 0, color = C.green600, leafFill = C.cream50, style }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [delay, delay + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: gentle });
  const leaf = (i) => interpolate(frame, [delay + 18 + i * 6, delay + 40 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  const leaves = [
    "M106 252C70 248 44 222 38 186c36 2 62 26 68 66z",
    "M115 204c35-8 61-38 65-76-34 6-60 34-65 76z",
    "M112 152c-30-6-48-32-50-60 30 6 48 28 50 60z",
    "M121 98c25-10 39-34 39-58-24 8-38 30-39 58z",
  ];
  return (
    <svg viewBox="0 0 220 320" style={style}>
      <path d="M104 318C98 250 126 200 112 140S118 60 132 22" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
      {leaves.map((d, i) => (
        <path key={i} d={d} fill={leafFill} stroke={color} strokeWidth={2.6} strokeLinejoin="round"
          style={{ transformBox: "fill-box", transformOrigin: i % 2 ? "0% 100%" : "100% 100%", transform: `scale(${leaf(i)})`, opacity: leaf(i) > 0.01 ? 1 : 0 }} />
      ))}
    </svg>
  );
};

/* ---------- Scenes ---------- */
const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 90, damping: 14 } });
  const sub = interpolate(frame, [26, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: gentle });
  return (
    <AbsoluteFill style={{ background: C.cream100, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: C.sage100, right: -260, bottom: -320, opacity: 0.9 }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: C.rose200, left: 140, top: 110, opacity: 0.75 }} />
      <Sprig delay={6} style={{ position: "absolute", left: 210, bottom: 40, width: 260 }} />
      <Sprig delay={14} style={{ position: "absolute", right: 260, top: 70, width: 170, transform: "rotate(160deg)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36, position: "relative" }}>
        <div style={{ width: 170, height: 170, borderRadius: "50%", background: C.cream50, display: "grid", placeItems: "center", boxShadow: "0 18px 40px rgba(27,43,36,.12)", transform: `scale(${pop})` }}>
          <Img src={staticFile("logo-emblem.png")} style={{ width: 118 }} />
        </div>
        <Rise text="Out in the community" delay={10} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 116, letterSpacing: "-0.035em", color: C.ink900, justifyContent: "center" }} />
        <div style={{ fontFamily: BODY, fontSize: 42, color: C.ink700, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)` }}>
          Highlights from Victoria's Wellness outreaches
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Caption = ({ text, place }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [30, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: gentle });
  return (
    <div style={{
      position: "absolute", left: 72, bottom: 72, maxWidth: 1100,
      display: "flex", flexDirection: "column", gap: 6,
      padding: "26px 40px 28px", borderRadius: 32, background: C.cream50,
      boxShadow: "0 18px 40px rgba(27,43,36,.22)",
      opacity: t, transform: `translateY(${(1 - t) * 28}px)`,
    }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 50, letterSpacing: "-0.025em", color: C.ink900, lineHeight: 1.15 }}>{text}</div>
      {place && <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.green700, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: C.rose400 }} />{place}
      </div>}
    </div>
  );
};

const PhotoScene = ({ src, text, place }) => (
  <Bloom start={0} duration={44}>
    <AbsoluteFill style={{ background: C.green900 }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {/* A soft band at the bottom so the caption card always reads */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(16,48,42,.45), rgba(16,48,42,0) 40%)" }} />
    </AbsoluteFill>
    <Caption text={text} place={place} />
  </Bloom>
);

const Outro = () => {
  const frame = useCurrentFrame();
  const t = (d) => interpolate(frame, [d, d + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: gentle });
  return (
    <Bloom start={0} duration={40}>
      <AbsoluteFill style={{ background: C.green900, alignItems: "center", justifyContent: "center" }}>
        <Sprig delay={10} color={C.onGreenMuted} leafFill={C.green900} style={{ position: "absolute", left: 160, bottom: 40, width: 240, opacity: 0.6 }} />
        <Sprig delay={16} color={C.onGreenMuted} leafFill={C.green900} style={{ position: "absolute", right: 200, top: 60, width: 160, opacity: 0.6, transform: "rotate(160deg)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
          <div style={{ width: 150, height: 150, borderRadius: "50%", background: C.cream50, display: "grid", placeItems: "center", opacity: t(8) }}>
            <Img src={staticFile("logo-emblem.png")} style={{ width: 104 }} />
          </div>
          <Rise text="Healthier women. Brighter futures." delay={14} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 92, letterSpacing: "-0.03em", color: C.onGreen, justifyContent: "center" }} />
          <div style={{ fontFamily: BODY, fontSize: 40, color: C.onGreenMuted, opacity: t(34) }}>
            Victoria's Wellness Initiative for Women and Girls
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.gold400, opacity: t(42) }}>@vwigcare</div>
        </div>
      </AbsoluteFill>
    </Bloom>
  );
};

// Timeline: intro 3 s, five photos of 2.8 s each (each blooms in over the last), closing 3 s.
const STEP = 84;
const OUTRO_AT = 90 + 5 * STEP; // frame 510
const PHOTOS = [
  ["hero-wide-1200.jpg", "Listening first", "Girls' health outreach, Epe"],
  ["gallery-epe-pads-main-1600.jpg", "Menstrual health support for girls", "Epe Girls' Senior High School"],
  ["gallery-bp-check-main-1600.jpg", "Free health checks for women", "Women's health outreach"],
  ["gallery-session-main-1600.jpg", "Health education, led by our volunteers", "Community health session"],
  ["gallery-women-group-main-1600.jpg", "Communities we serve", "Lagos, Ogun and Osun states"],
];

export const Highlights = () => (
  <AbsoluteFill style={{ background: C.cream100 }}>
    <Sequence durationInFrames={90 + 44}><Intro /></Sequence>
    {PHOTOS.map(([src, text, place], i) => (
      <Sequence key={src} from={90 + i * STEP} durationInFrames={i === PHOTOS.length - 1 ? STEP + 40 : STEP + 44}>
        <PhotoScene src={src} text={text} place={place} />
      </Sequence>
    ))}
    <Sequence from={OUTRO_AT}><Outro /></Sequence>
  </AbsoluteFill>
);
