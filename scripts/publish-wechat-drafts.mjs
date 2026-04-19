import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getLocalizedPost, parsePostFile, renderMarkdown } from "../src/lib/post-format.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const contentDir = path.join(repoRoot, "content", "posts");
const summaryPath = process.env.GITHUB_STEP_SUMMARY;
const websiteOrigin = (process.env.WEBSITE_ORIGIN || "https://bsd-lab.org").replace(/\/+$/, "");

function appendSummary(lines) {
  if (!summaryPath) return Promise.resolve();
  return fs.appendFile(summaryPath, `${lines.join("\n")}\n`);
}

function getGitRefChangedFiles() {
  const before = process.env.GITHUB_EVENT_BEFORE;
  const sha = process.env.GITHUB_SHA;
  if (!before || !sha || /^0+$/.test(before)) {
    return null;
  }

  try {
    const stdout = execFileSync(
      "git",
      ["diff", "--name-only", before, sha, "--", "content/posts"],
      { cwd: repoRoot, encoding: "utf8" },
    );
    return stdout
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter((item) => item.endsWith(".md"));
  } catch {
    return null;
  }
}

async function listPostFiles() {
  const explicit = process.env.WECHAT_POST_FILES
    ?.split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (explicit?.length) {
    return explicit.map((item) => path.resolve(repoRoot, item));
  }

  const changed = process.env.GITHUB_EVENT_NAME === "push" ? getGitRefChangedFiles() : null;
  if (changed) {
    return changed.map((item) => path.resolve(repoRoot, item));
  }

  const entries = await fs.readdir(contentDir);
  return entries
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => path.join(contentDir, entry));
}

async function resolveAssetFile(assetPath, sourcePath) {
  if (!assetPath) return null;

  if (/^https?:\/\//i.test(assetPath)) {
    const response = await fetch(assetPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch remote asset: ${assetPath}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const url = new URL(assetPath);
    return {
      buffer,
      filename: path.basename(url.pathname) || "asset",
      contentType: response.headers.get("content-type") || "application/octet-stream",
    };
  }

  const normalized = assetPath.replace(/^\.\//, "");
  const candidates = [
    path.resolve(path.dirname(sourcePath), normalized),
    path.resolve(repoRoot, normalized.replace(/^\/+/, "")),
    path.resolve(repoRoot, "public", normalized.replace(/^\/+/, "")),
  ];

  for (const candidate of candidates) {
    try {
      const buffer = await fs.readFile(candidate);
      return {
        buffer,
        filename: path.basename(candidate),
        contentType: guessContentType(candidate),
      };
    } catch {
      // Try next.
    }
  }

  throw new Error(`Unable to resolve asset: ${assetPath}`);
}

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function fetchAccessToken(appId, appSecret) {
  const url = new URL("https://api.weixin.qq.com/cgi-bin/token");
  url.searchParams.set("grant_type", "client_credential");
  url.searchParams.set("appid", appId);
  url.searchParams.set("secret", appSecret);

  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.errcode) {
    throw new Error(`Failed to get access token: ${data.errmsg || response.statusText}`);
  }
  return data.access_token;
}

async function uploadWechatImage(accessToken, assetPath, sourcePath) {
  const asset = await resolveAssetFile(assetPath, sourcePath);
  const formData = new FormData();
  formData.append(
    "media",
    new Blob([asset.buffer], { type: asset.contentType }),
    asset.filename,
  );

  const response = await fetch(`https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${accessToken}`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || data.errcode || !data.url) {
    throw new Error(`Failed to upload article image: ${data.errmsg || response.statusText}`);
  }
  return data.url;
}

async function uploadWechatThumb(accessToken, assetPath, sourcePath) {
  const asset = await resolveAssetFile(assetPath, sourcePath);
  const formData = new FormData();
  formData.append(
    "media",
    new Blob([asset.buffer], { type: asset.contentType }),
    asset.filename,
  );

  const response = await fetch(
    `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=thumb`,
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await response.json();
  if (!response.ok || data.errcode || !data.media_id) {
    throw new Error(`Failed to upload thumb media: ${data.errmsg || response.statusText}`);
  }
  return data.media_id;
}

async function replaceInlineImages(accessToken, post, html) {
  const matches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)];
  if (!matches.length) return html;

  let output = html;
  for (const match of matches) {
    const originalSrc = match[1];
    const uploadedUrl = await uploadWechatImage(accessToken, originalSrc, post.sourcePath);
    output = output.split(originalSrc).join(uploadedUrl);
  }
  return output;
}

function resolveWebsiteUrl(post) {
  return `${websiteOrigin}/?lang=zh#${post.route}`;
}

async function createDraft(accessToken, payload) {
  const response = await fetch(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || data.errcode) {
    throw new Error(`Failed to create draft: ${data.errmsg || response.statusText}`);
  }
  return data.media_id;
}

function buildWechatHtml(post) {
  const localized = getLocalizedPost(post, "zh");
  const bodyHtml = renderMarkdown(localized.bodyZh);
  return `
    <section style="color:#2b2b2b;font-size:16px;line-height:1.8;">
      <p style="color:#8b7f67;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 18px;">BSD Lab</p>
      ${bodyHtml}
      <p style="margin-top:28px;color:#8b7f67;font-size:13px;">Website: <a href="${resolveWebsiteUrl(post)}">${resolveWebsiteUrl(post)}</a></p>
    </section>
  `.trim();
}

async function main() {
  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;
  const author = process.env.WECHAT_AUTHOR_NAME || "BSD Lab";

  const files = await listPostFiles();
  if (!files.length) {
    await appendSummary(["## WeChat Sync", "", "- No post files detected in this run."]);
    return;
  }

  const parsedPosts = [];
  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    parsedPosts.push(parsePostFile(raw, filePath));
  }

  const targets = parsedPosts.filter((post) => post.publishToWechat);

  if (!targets.length) {
    await appendSummary(["## WeChat Sync", "", "- No posts with `publish_to_wechat: true` in this run."]);
    return;
  }

  if (!appId || !appSecret) {
    await appendSummary([
      "## WeChat Sync",
      "",
      "- Skipped draft creation because `WECHAT_APP_ID` or `WECHAT_APP_SECRET` is missing.",
      "",
      "| Post | Website URL |",
      "| --- | --- |",
      ...targets.map((post) => `| ${post.titleZh} | ${resolveWebsiteUrl(post)} |`),
    ]);
    return;
  }

  const accessToken = await fetchAccessToken(appId, appSecret);
  const results = [];

  for (const post of targets) {
    try {
      const html = await replaceInlineImages(accessToken, post, buildWechatHtml(post));
      const thumbMediaId = await uploadWechatThumb(
        accessToken,
        post.wechatCoverImage || post.coverImage,
        post.sourcePath,
      );

      const mediaId = await createDraft(accessToken, {
        articles: [
          {
            title: post.titleZh,
            author,
            digest: post.summaryZh,
            content: html,
            content_source_url: resolveWebsiteUrl(post),
            thumb_media_id: thumbMediaId,
            show_cover_pic: 1,
            need_open_comment: 0,
            only_fans_can_comment: 0,
          },
        ],
      });

      results.push({
        post,
        ok: true,
        mediaId,
      });
    } catch (error) {
      results.push({
        post,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const lines = [
    "## WeChat Sync",
    "",
    "| Post | Website URL | Draft Result |",
    "| --- | --- | --- |",
    ...results.map((result) =>
      result.ok
        ? `| ${result.post.titleZh} | ${resolveWebsiteUrl(result.post)} | Draft created: \`${result.mediaId}\` |`
        : `| ${result.post.titleZh} | ${resolveWebsiteUrl(result.post)} | Failed: ${result.error} |`,
    ),
  ];

  await appendSummary(lines);
}

main().catch(async (error) => {
  await appendSummary([
    "## WeChat Sync",
    "",
    `- Workflow failed before draft creation completed: ${error instanceof Error ? error.message : String(error)}`,
  ]);
  process.exitCode = 1;
});
