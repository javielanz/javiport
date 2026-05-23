#!/usr/bin/env node
import { readdir, stat, mkdir, rm, writeFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { parseArgs } from 'node:util';
import sharp from 'sharp';

const ROOT          = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const RAW_DIR       = path.join(ROOT, 'media', 'raw');
const WEB_DIR       = path.join(ROOT, 'media', 'web');
const IMAGE_WIDTHS  = [480, 960, 1440, 2880];
const VIDEO_HEIGHTS = [1080, 720];
const IMAGE_EXT     = new Set(['.jpg', '.jpeg', '.png', '.heic']);
const VIDEO_EXT     = new Set(['.mp4', '.mov', '.m4v']);
const HOLDBACK_VIDEOS = new Set(['documentary-master']);

const VIDEO_BITRATES = { 1080: 4500, 720: 2200 };

// Documented error text — reserved for future --require-ffmpeg mode.
// Kept as a constant so it stays current; not thrown in M5.
// eslint-disable-next-line no-unused-vars
const FFMPEG_MISSING_MESSAGE = `ffmpeg not found on PATH. Install ffmpeg and ensure both \`ffmpeg\` and \`ffprobe\` are on PATH.
  macOS:    brew install ffmpeg
  Windows:  winget install Gyan.FFmpeg   (then restart shell)
  Linux:    apt install ffmpeg
Re-run \`npm run media:build\` after install.`;

let args;
try {
  ({ values: args } = parseArgs({
    options: {
      clean: { type: 'boolean', default: false },
      av1:   { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
      only:  { type: 'string' },
    },
    strict: true,
  }));
} catch (e) {
  process.stderr.write(`media-build: ${e.message}\nUsage: node scripts/media-build.mjs [--clean] [--av1] [--force] [--only <basename>]\n`);
  process.exit(2);
}

function stripExtension(name) {
  return name.replace(/\.[^.]+$/, '');
}

function formatBytes(n) {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${(n / 1024 / 1024).toFixed(2)}MB`;
}

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function isStale(srcPath, outPath, force) {
  if (force) return true;
  if (!existsSync(outPath)) return true;
  const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(outPath)]);
  return outStat.mtimeMs < srcStat.mtimeMs;
}

function relWeb(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

async function assertFfmpeg() {
  return new Promise((resolve) => {
    const proc = spawn('ffmpeg', ['-version'], { stdio: 'ignore' });
    proc.on('error', () => resolve(false));
    proc.on('exit', (code) => resolve(code === 0));
  });
}

function runFfmpeg(ffmpegArgs) {
  return new Promise((resolve, reject) => {
    const stderrChunks = [];
    const proc = spawn('ffmpeg', ffmpegArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
    proc.stderr.on('data', (c) => stderrChunks.push(c));
    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else {
        const tail = Buffer.concat(stderrChunks).toString('utf8').trim().split('\n').slice(-8).join('\n');
        reject(new Error(`ffmpeg exit ${code}\n${tail}`));
      }
    });
  });
}

async function walkRaw(only) {
  const images = [];
  const videos = [];
  if (!existsSync(RAW_DIR)) return { images, videos };
  const entries = await readdir(RAW_DIR);
  for (const name of entries) {
    if (name.startsWith('.')) continue;
    if (name.endsWith('.TODO.md')) continue;
    const ext = path.extname(name).toLowerCase();
    const base = stripExtension(name);
    if (only && base !== only) continue;
    const full = path.join(RAW_DIR, name);
    if (IMAGE_EXT.has(ext)) images.push(full);
    else if (VIDEO_EXT.has(ext)) videos.push(full);
  }
  images.sort();
  videos.sort();
  return { images, videos };
}

async function processImage(srcPath, { force }) {
  const base = stripExtension(path.basename(srcPath));
  const meta = await sharp(srcPath, { failOn: 'error' }).metadata();
  const intrinsicW = meta.width;
  const intrinsicH = meta.height;
  let targets = IMAGE_WIDTHS.filter((w) => w <= intrinsicW);
  if (targets.length === 0) targets = [intrinsicW];

  const failures = [];
  for (const w of targets) {
    for (const fmt of ['avif', 'webp', 'jpg']) {
      const outPath = path.join(WEB_DIR, `${base}-${w}w.${fmt}`);
      if (!(await isStale(srcPath, outPath, force))) {
        process.stdout.write(`[skip]  ${relWeb(outPath)}\n`);
        continue;
      }
      try {
        let pipeline = sharp(srcPath, { failOn: 'error' })
          .rotate()
          .withMetadata({ orientation: undefined })
          .resize({ width: w, withoutEnlargement: true });
        if (fmt === 'avif') pipeline = pipeline.avif({ quality: 60, effort: 4 });
        else if (fmt === 'webp') pipeline = pipeline.webp({ quality: 80, effort: 4 });
        else pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true });
        const info = await pipeline.toFile(outPath);
        process.stdout.write(`[image] ${base} ${w}w ${fmt} ${formatBytes(info.size)}\n`);
      } catch (e) {
        process.stderr.write(`[error] ${base} ${w}w ${fmt}: ${e.message}\n`);
        failures.push({ base, w, fmt });
      }
    }
  }

  const metaPath = path.join(WEB_DIR, `${base}.meta.json`);
  await writeFile(
    metaPath,
    JSON.stringify(
      { width: intrinsicW, height: intrinsicH, aspectRatio: intrinsicW / intrinsicH },
      null,
      2
    ) + '\n'
  );
  return failures;
}

async function processVideo(srcPath, { av1, force }) {
  const base = stripExtension(path.basename(srcPath));
  if (HOLDBACK_VIDEOS.has(base)) {
    process.stdout.write(`[skip:holdback] ${base} — upload to Vimeo manually (see PLAN §8)\n`);
    return [];
  }
  const nullSink = process.platform === 'win32' ? 'NUL' : '/dev/null';
  const failures = [];

  for (const h of VIDEO_HEIGHTS) {
    const mp4Out = path.join(WEB_DIR, `${base}-${h}p.mp4`);
    if (!(await isStale(srcPath, mp4Out, force))) {
      process.stdout.write(`[skip]  ${relWeb(mp4Out)}\n`);
    } else {
      try {
        const br = VIDEO_BITRATES[h];
        const common = [
          '-y', '-i', srcPath,
          '-c:v', 'libx264', '-preset', 'slow', '-tune', 'film',
          '-profile:v', 'high', '-pix_fmt', 'yuv420p',
          '-vf', `scale=-2:${h}`, '-b:v', `${br}k`,
        ];
        await runFfmpeg([...common, '-pass', '1', '-an', '-f', 'mp4', nullSink]);
        await runFfmpeg([...common, '-pass', '2', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', mp4Out]);
        const sz = (await stat(mp4Out)).size;
        process.stdout.write(`[video] ${base} ${h}p mp4 ${formatBytes(sz)}\n`);
        if (sz > 8 * 1024 * 1024) {
          process.stdout.write(`[warn]  ${base}-${h}p.mp4 ${formatBytes(sz)} (>8MB target)\n`);
        }
      } catch (e) {
        process.stderr.write(`[error] ${base} ${h}p mp4: ${e.message}\n`);
        failures.push({ base, h, fmt: 'mp4' });
      }
    }

    if (av1) {
      const webmOut = path.join(WEB_DIR, `${base}-${h}p.webm`);
      if (!(await isStale(srcPath, webmOut, force))) {
        process.stdout.write(`[skip]  ${relWeb(webmOut)}\n`);
      } else {
        try {
          await runFfmpeg([
            '-y', '-i', srcPath,
            '-c:v', 'libsvtav1', '-crf', '32', '-preset', '6',
            '-pix_fmt', 'yuv420p', '-vf', `scale=-2:${h}`,
            '-c:a', 'libopus', '-b:a', '96k',
            webmOut,
          ]);
          const sz = (await stat(webmOut)).size;
          process.stdout.write(`[video] ${base} ${h}p webm ${formatBytes(sz)}\n`);
        } catch (e) {
          process.stderr.write(`[error] ${base} ${h}p webm: ${e.message}\n`);
          failures.push({ base, h, fmt: 'webm' });
        }
      }
    }
  }

  const poster1080 = path.join(WEB_DIR, `${base}-1080p.mp4`);
  const posterOut = path.join(WEB_DIR, `${base}-poster.jpg`);
  if (existsSync(poster1080) && (await isStale(poster1080, posterOut, force))) {
    try {
      await runFfmpeg(['-y', '-ss', '0.5', '-i', poster1080, '-frames:v', '1', '-q:v', '3', posterOut]);
      process.stdout.write(`[poster] ${base}-poster.jpg\n`);
    } catch (e) {
      process.stderr.write(`[error] ${base} poster: ${e.message}\n`);
      failures.push({ base, fmt: 'poster' });
    }
  }

  await cleanupPassLogs();
  return failures;
}

async function cleanupPassLogs() {
  const entries = await readdir(ROOT).catch(() => []);
  for (const name of entries) {
    if (/^ffmpeg2pass-.*\.log/.test(name)) {
      await unlink(path.join(ROOT, name)).catch(() => {});
    }
  }
}

async function main() {
  if (process.env.CI === 'true') {
    process.stdout.write('media:build is local-only; refusing to run in CI.\n');
    process.exit(0);
  }

  if (args.clean) {
    await rm(WEB_DIR, { recursive: true, force: true });
    process.stdout.write(`[clean] removed ${relWeb(WEB_DIR)}\n`);
    return;
  }

  await ensureDir(WEB_DIR);
  const { images, videos } = await walkRaw(args.only);

  if (images.length === 0 && videos.length === 0) {
    process.stdout.write('media-build: no sources found in media/raw/\n');
    return;
  }

  const failures = [];

  for (const src of images) {
    const f = await processImage(src, { force: args.force });
    failures.push(...f);
  }

  if (videos.length > 0) {
    const hasFfmpeg = await assertFfmpeg();
    if (!hasFfmpeg) {
      process.stdout.write('[warn]  ffmpeg unavailable — skipping videos (see PLAN.md §8)\n');
    } else {
      for (const src of videos) {
        const f = await processVideo(src, { av1: args.av1, force: args.force });
        failures.push(...f);
      }
    }
  }

  if (failures.length > 0) {
    process.stderr.write(`media-build: ${failures.length} failure(s)\n`);
    process.exit(1);
  }
}

main().catch((e) => {
  process.stderr.write(`media-build: ${e.message}\n`);
  process.exit(1);
});
