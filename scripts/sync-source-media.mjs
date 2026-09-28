import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ensureLoopVideoInDir } from "./build-loop-videos.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "source");
const destDir = path.join(root, "public", "source");

const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const VIDEO_EXT = [".mp4", ".webm", ".mov"];

function extOf(name) {
  return path.extname(name).toLowerCase();
}

function isImage(name) {
  return IMAGE_EXT.includes(extOf(name));
}

function isVideo(name) {
  return VIDEO_EXT.includes(extOf(name));
}

function toUrl(file) {
  return file ? `/source/${encodeURI(file)}` : null;
}

function pickMain(files) {
  return files.find((f) => /main[_-]?bg/i.test(f)) ?? null;
}

function pickTopics(files) {
  return (
    files.find((f) => /하단/i.test(f)) ??
    files.find((f) => /bottom/i.test(f) && /bg/i.test(f)) ??
    null
  );
}

function pickHeroImage(files) {
  return files.find((f) => isImage(f) && /hero/i.test(f)) ?? null;
}

if (!fs.existsSync(srcDir)) {
  console.log("[sync-source-media] source/ 폴더 없음 — public/source 유지");
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
const files = fs.readdirSync(srcDir).filter((f) => !f.startsWith(".") && f !== "README.md");

for (const file of files) {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
}

const mainFile = pickMain(files);
const topicsFile = pickTopics(files);
const heroFile = pickHeroImage(files);

let mainVideoFile = mainFile && isVideo(mainFile) ? mainFile : null;
let topicsVideoFile = topicsFile && isVideo(topicsFile) ? topicsFile : null;

if (mainVideoFile) {
  const { playbackFile, built } = ensureLoopVideoInDir(destDir, mainVideoFile);
  mainVideoFile = playbackFile;
  if (built?.ok && !built.skipped) {
    console.log("[sync-source-media] ping-pong loop:", playbackFile);
  }
}

if (topicsVideoFile) {
  const { playbackFile, built } = ensureLoopVideoInDir(destDir, topicsVideoFile);
  topicsVideoFile = playbackFile;
  if (built?.ok && !built.skipped) {
    console.log("[sync-source-media] ping-pong loop:", playbackFile);
  }
}

const manifest = {
  mainBg: mainFile && isImage(mainFile) ? toUrl(mainFile) : null,
  mainVideo: mainVideoFile ? toUrl(mainVideoFile) : null,
  topicsBg: topicsFile && isImage(topicsFile) ? toUrl(topicsFile) : null,
  topicsVideo: topicsVideoFile ? toUrl(topicsVideoFile) : null,
  heroBg: toUrl(heroFile),
};

fs.writeFileSync(path.join(destDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("[sync-source-media]", manifest);
