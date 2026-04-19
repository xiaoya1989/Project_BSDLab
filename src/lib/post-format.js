import { marked } from "marked";
import { parse as parseYaml } from "yaml";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const ZH_MARKER_RE = /<!--\s*zh\s*-->/i;
const EN_MARKER_RE = /<!--\s*en\s*-->/i;

function normalizeString(value, fallback = "") {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    return String(value);
  }
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return fallback;
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeString(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    return { data: {}, body: raw.trim() };
  }

  const data = parseYaml(match[1]) || {};
  const body = raw.slice(match[0].length).trim();
  return { data, body };
}

function splitLocalizedBody(body) {
  const zhMatch = body.match(ZH_MARKER_RE);
  const enMatch = body.match(EN_MARKER_RE);

  if (!zhMatch && !enMatch) {
    return {
      zh: body.trim(),
      en: body.trim(),
    };
  }

  if (!zhMatch && enMatch) {
    const enStart = enMatch.index + enMatch[0].length;
    return {
      zh: body.slice(0, enMatch.index).trim(),
      en: body.slice(enStart).trim(),
    };
  }

  if (zhMatch && !enMatch) {
    const zhStart = zhMatch.index + zhMatch[0].length;
    return {
      zh: body.slice(zhStart).trim(),
      en: body.slice(zhStart).trim(),
    };
  }

  const zhStart = zhMatch.index + zhMatch[0].length;
  const enStart = enMatch.index + enMatch[0].length;

  if (zhMatch.index < enMatch.index) {
    return {
      zh: body.slice(zhStart, enMatch.index).trim(),
      en: body.slice(enStart).trim(),
    };
  }

  return {
    zh: body.slice(zhStart).trim(),
    en: body.slice(enStart, zhMatch.index).trim(),
  };
}

function parseDateParts(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) {
    return { year: 0, month: 0, day: 0, timestamp: 0 };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return {
    year,
    month,
    day,
    timestamp: Date.UTC(year, month - 1, day),
  };
}

export function renderMarkdown(markdown = "") {
  return marked.parse(markdown.trim());
}

export function stripMarkdown(markdown = "") {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>~-]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildPostRoute(slug) {
  return `/news/${slug}`;
}

export function parsePostFile(raw, sourcePath = "") {
  const { data, body } = extractFrontmatter(raw);
  const localizedBody = splitLocalizedBody(body);
  const fallbackTitle = normalizeString(data.title_en || data.title_zh || "Untitled Post");
  const slug = normalizeString(data.slug) || slugify(fallbackTitle) || "post";
  const date = normalizeString(data.date);
  const dateParts = parseDateParts(date);
  const summaryZh = normalizeString(data.summary_zh);
  const summaryEn = normalizeString(data.summary_en) || summaryZh;
  const bodyZh = normalizeString(localizedBody.zh);
  const bodyEn = normalizeString(localizedBody.en) || bodyZh;

  return {
    id: slug,
    slug,
    sourcePath,
    route: buildPostRoute(slug),
    date,
    ...dateParts,
    titleZh: normalizeString(data.title_zh) || fallbackTitle,
    titleEn: normalizeString(data.title_en) || normalizeString(data.title_zh) || fallbackTitle,
    summaryZh: summaryZh || stripMarkdown(bodyZh).slice(0, 180),
    summaryEn: summaryEn || stripMarkdown(bodyEn).slice(0, 180),
    bodyZh,
    bodyEn,
    coverImage: normalizeString(data.cover_image),
    wechatCoverImage: normalizeString(data.wechat_cover_image) || normalizeString(data.cover_image),
    tags: normalizeArray(data.tags),
    publishToWechat: normalizeBoolean(data.publish_to_wechat, false),
  };
}

export function sortPosts(posts) {
  return [...posts].sort((a, b) => b.timestamp - a.timestamp || a.slug.localeCompare(b.slug));
}

export function getLocalizedPost(post, lang = "en") {
  const isZh = lang === "zh";
  const title = isZh ? post.titleZh : post.titleEn;
  const summary = isZh ? post.summaryZh : post.summaryEn;
  const body = isZh ? post.bodyZh : post.bodyEn;

  return {
    ...post,
    title,
    summary,
    body,
    html: renderMarkdown(body),
  };
}
