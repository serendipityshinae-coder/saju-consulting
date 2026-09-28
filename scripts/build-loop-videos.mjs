import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import ffmpegStatic from "ffmpeg-static";

/** `main_bg.mp4` → `main_bg_loop.mp4` */
export function loopVideoFileName(file) {
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);
  if (base.endsWith("_loop")) return file;
  return `${base}_loop${ext}`;
}

export function isLoopDerivative(file) {
  const base = path.basename(file, path.extname(file));
  return base.endsWith("_loop");
}

function resolveFfmpegPath() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }
  if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
    return ffmpegStatic;
  }
  const r = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (r.status === 0) return "ffmpeg";
  return null;
}

export function ffmpegAvailable() {
  return resolveFfmpegPath() !== null;
}

/**
 * 원본 + 역재생 구간을 이어 붙인 mp4 (끝↔처음 ping-pong이 loop 한 번으로 매끄럽게 이어짐)
 */
export function buildPingPongVideo(inputPath, outputPath, { force = false } = {}) {
  if (!fs.existsSync(inputPath)) {
    return { ok: false, reason: "missing-input" };
  }

  if (!ffmpegAvailable()) {
    return { ok: false, reason: "no-ffmpeg" };
  }

  const inStat = fs.statSync(inputPath);
  if (
    !force &&
    fs.existsSync(outputPath) &&
    fs.statSync(outputPath).mtimeMs >= inStat.mtimeMs
  ) {
    return { ok: true, skipped: true };
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const args = [
    "-y",
    "-i",
    inputPath,
    "-filter_complex",
    "[0:v]split[fw][rv];[rv]reverse[rev];[fw][rev]concat=n=2:v=1:a=0[v]",
    "-map",
    "[v]",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outputPath,
  ];

  const ffmpeg = resolveFfmpegPath();
  if (!ffmpeg) {
    return { ok: false, reason: "no-ffmpeg" };
  }

  const result = spawnSync(ffmpeg, args, {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    return { ok: false, reason: "ffmpeg-failed" };
  }

  return { ok: true, skipped: false };
}

/** 배경용 원본 mp4 → public/source/*_loop.mp4 생성 */
export function ensureLoopVideoInDir(dir, originalFileName) {
  if (!originalFileName || isLoopDerivative(originalFileName)) {
    return { playbackFile: originalFileName, built: null };
  }

  const inputPath = path.join(dir, originalFileName);
  const loopName = loopVideoFileName(originalFileName);
  const outputPath = path.join(dir, loopName);

  const built = buildPingPongVideo(inputPath, outputPath);
  if (built.ok) {
    return { playbackFile: loopName, built };
  }

  console.warn(
    `[build-loop-videos] ${originalFileName}: loop 파일 생성 실패 (${built.reason}) — 원본 사용`,
  );
  return { playbackFile: originalFileName, built };
}
