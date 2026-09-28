import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildPingPongVideo, isLoopDerivative, loopVideoFileName } from "./build-loop-videos.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const destDir = path.join(root, "public", "source");
const force = process.argv.includes("--force");

if (!fs.existsSync(destDir)) {
  console.error("[build:loop-videos] public/source 없음 — 먼저 npm run sync:media");
  process.exit(1);
}

const videos = fs
  .readdirSync(destDir)
  .filter((f) => /\.(mp4|webm|mov)$/i.test(f) && !isLoopDerivative(f));

if (videos.length === 0) {
  console.log("[build:loop-videos] 처리할 원본 영상 없음");
  process.exit(0);
}

let failed = 0;
for (const file of videos) {
  const out = loopVideoFileName(file);
  const r = buildPingPongVideo(path.join(destDir, file), path.join(destDir, out), { force });
  if (!r.ok) {
    failed += 1;
    console.error(`[build:loop-videos] ${file}: ${r.reason}`);
  } else if (r.skipped) {
    console.log(`[build:loop-videos] skip (최신): ${out}`);
  } else {
    console.log(`[build:loop-videos] created: ${out}`);
  }
}

process.exit(failed > 0 ? 1 : 0);
