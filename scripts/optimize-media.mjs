// Turns the large original photos in /assets into web-sized files in /media.
// Run with: npm run media            (everything)
//           npm run media -- about   (one photo job by name)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "media"; // next to index.html so the page works however it is opened
await mkdir(OUT, { recursive: true });
const only = process.argv[2];

// Each job: one source photo, one or more art-directed crops, each at several widths.
// Output: media/<name>-<crop>-<width>.{avif,webp,jpg} plus media/<name>-lqip.jpg
const JOBS = [
  {
    // Volunteer holding a mic out to schoolgirls (outreach in Epe)
    name: "hero",
    src: "assets/videos/1000964966.jpg", // 3600 x 2400
    crops: {
      portrait: { left: 520, top: 0, width: 1920, height: 2400, widths: [640, 960, 1280] }, // 4:5, desktop
      wide: { left: 300, top: 120, width: 2700, height: 2160, widths: [480, 800, 1200] }, // 5:4, phones
    },
  },
  {
    // Women at a community health education session run by our volunteers
    name: "about",
    src: "assets/videos/1000139391.jpg", // 5568 x 3712
    crops: {
      // 5:4, keeps the volunteers at the front of the room and the women listening
      main: { left: 760, top: 0, width: 4640, height: 3712, widths: [560, 880, 1280] },
    },
  },
  {
    // Schoolgirls holding menstrual health kits, volunteers behind them
    name: "programmes",
    src: "assets/videos/1000082858.jpg", // 5568 x 3712
    crops: {
      // 4:3; starts right of the woman on the far left, whose T-shirt shows a misspelled word
      main: { left: 1020, top: 300, width: 4548, height: 3411, widths: [560, 880, 1280] },
    },
  },
  {
    // Volunteers, officials and partners with donated sanitary products (Get Involved)
    name: "involved",
    src: "assets/videos/1000964975.jpg", // 3600 x 2400
    crops: { main: { full: true, widths: [560, 880, 1280] } },
  },
  // Gallery: whole frames, 3:2. 1600 wide for the full-screen viewer.
  // Left out: 1000082868 and 1000082898 (T-shirts read "PERIOD POVERY").
  { name: "gallery-epe-school", src: "assets/videos/1000965051.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-epe-pads", src: "assets/videos/1000964994.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-epe-handout", src: "assets/videos/1000964989.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-bp-check", src: "assets/videos/1000139352.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-women-group", src: "assets/videos/1000139376.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-certificates", src: "assets/videos/1000037842.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-line", src: "assets/videos/1000964992.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-queue", src: "assets/videos/1000964987.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-mic", src: "assets/videos/1000964964.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-ceremony", src: "assets/videos/1000037882.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
  { name: "gallery-session", src: "assets/videos/1000139391.jpg", crops: { main: { full: true, widths: [480, 960, 1600] } } },
];

for (const job of JOBS) {
  // a name ending in * matches a prefix, e.g. "gallery*"
  const match = (o) => (o.endsWith("*") ? job.name.startsWith(o.slice(0, -1)) : job.name === o);
  if (only && !match(only) && only !== "logo") continue;
  if (only === "logo") break;
  for (const [crop, c] of Object.entries(job.crops)) {
    if (c.full) {
      const m = await sharp(job.src).metadata();
      Object.assign(c, { left: 0, top: 0, width: m.width, height: m.height });
    }
    for (const w of c.widths) {
      const base = sharp(job.src).rotate().extract({ left: c.left, top: c.top, width: c.width, height: c.height }).resize({ width: w });
      const file = `${OUT}/${job.name}-${crop}-${w}`;
      await base.clone().avif({ quality: 52, effort: 6 }).toFile(`${file}.avif`);
      await base.clone().webp({ quality: 74 }).toFile(`${file}.webp`);
      await base.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(`${file}.jpg`);
    }
  }
  // Tiny blurred placeholder so a frame is never an empty hole while loading
  const first = Object.values(job.crops)[0];
  await sharp(job.src).rotate().extract({ left: first.left, top: first.top, width: first.width, height: first.height })
    .resize({ width: 24 }).blur(1.2).jpeg({ quality: 50 }).toFile(`${OUT}/${job.name}-lqip.jpg`);
  console.log("done:", job.name);
}
if (only && only !== "logo") process.exit(0);

// Logo: keep the full lockup, plus the emblem alone for the header.
// The original has a white background, so near-white pixels become transparent.
async function whiteToAlpha(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    // fully clear above 245, soft ramp from 215 to 245 to keep anti-aliased edges clean
    const a = min >= 245 ? 0 : min <= 215 ? 255 : Math.round(((245 - min) / 30) * 255);
    data[i + 3] = Math.min(data[i + 3], a);
  }
  return sharp(data, { raw: info });
}

const LOGO = "assets/images/logo.png"; // 1254 x 1254
const emblemTop = await sharp(LOGO).extract({ left: 0, top: 0, width: 1254, height: 640 }).toBuffer();
const emblemRaw = await sharp(emblemTop).trim({ threshold: 12 }).toBuffer();
const emblem = await whiteToAlpha(emblemRaw);
await emblem.clone().resize({ height: 192 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-emblem.png`);
const emblemMeta = await sharp(`${OUT}/logo-emblem.png`).metadata();
console.log("emblem", emblemMeta.width, "x", emblemMeta.height);

const lockupRaw = await sharp(LOGO).trim({ threshold: 12 }).toBuffer();
const lockup = await whiteToAlpha(lockupRaw);
await lockup.clone().resize({ width: 640 }).png({ compressionLevel: 9 }).toFile("public/brand/logo-full.png");

// Favicon / touch icon from the emblem
await (await whiteToAlpha(emblemRaw)).resize({ width: 180, height: 180, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/icon-180.png`);
await (await whiteToAlpha(emblemRaw)).resize({ width: 48, height: 48, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/icon-48.png`);

console.log("done");
