import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const targets = [
  "group_photo.jpg",
  "team_members",
  "src/assets/faculty",
];

const imageExt = new Set([".jpg", ".jpeg", ".png"]);

function isImage(filePath) {
  return imageExt.has(path.extname(filePath).toLowerCase());
}

async function walk(entryPath, files) {
  const stat = await fs.stat(entryPath);
  if (stat.isFile()) {
    if (isImage(entryPath)) files.push(entryPath);
    return;
  }
  const entries = await fs.readdir(entryPath, { withFileTypes: true });
  for (const entry of entries) {
    await walk(path.join(entryPath, entry.name), files);
  }
}

function planFor(filePath) {
  const base = path.basename(filePath).toLowerCase();
  const ext = path.extname(filePath).toLowerCase();
  const isGroup = base === "group_photo.jpg";

  const maxWidth = isGroup ? 2200 : 1200;

  if (ext === ".png") {
    return {
      maxWidth,
      output: (img) => img.png({ compressionLevel: 9, adaptiveFiltering: true }),
    };
  }

  return {
    maxWidth,
    output: (img) => img.jpeg({ quality: isGroup ? 78 : 80, mozjpeg: true, progressive: true }),
  };
}

async function optimize(filePath) {
  const input = await fs.readFile(filePath);
  const meta = await sharp(input).metadata();
  const plan = planFor(filePath);

  const pipeline = sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: plan.maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    });

  const outputBuffer = await plan.output(pipeline).toBuffer();

  if (outputBuffer.length >= input.length) {
    return { filePath, before: input.length, after: input.length, changed: false };
  }

  await fs.writeFile(filePath, outputBuffer);
  return {
    filePath,
    before: input.length,
    after: outputBuffer.length,
    width: meta.width,
    height: meta.height,
    changed: true,
  };
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)}${units[unit]}`;
}

async function main() {
  const files = [];
  for (const target of targets) {
    const full = path.join(root, target);
    try {
      await walk(full, files);
    } catch {
      // skip missing paths
    }
  }

  const uniqueFiles = [...new Set(files)];
  let beforeTotal = 0;
  let afterTotal = 0;
  let changed = 0;

  for (const filePath of uniqueFiles) {
    const result = await optimize(filePath);
    beforeTotal += result.before;
    afterTotal += result.after;
    if (result.changed) changed += 1;
    const rel = path.relative(root, filePath);
    if (result.changed) {
      console.log(`optimized ${rel}: ${formatBytes(result.before)} -> ${formatBytes(result.after)}`);
    }
  }

  const saved = beforeTotal - afterTotal;
  const ratio = beforeTotal > 0 ? ((saved / beforeTotal) * 100).toFixed(1) : "0.0";
  console.log(`\nProcessed: ${uniqueFiles.length} files, optimized: ${changed}`);
  console.log(`Total: ${formatBytes(beforeTotal)} -> ${formatBytes(afterTotal)} (saved ${formatBytes(saved)}, ${ratio}%)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
