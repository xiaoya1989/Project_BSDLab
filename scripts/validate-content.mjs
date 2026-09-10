import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const errors = [];
const warnings = [];
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

function relative(filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

function addError(filePath, message) {
  errors.push(`${relative(filePath)}: ${message}`);
}

function addWarning(filePath, message) {
  warnings.push(`${relative(filePath)}: ${message}`);
}

function stripBom(value) {
  return value.replace(/^\uFEFF/, "");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  try {
    return JSON.parse(stripBom(await readFile(filePath, "utf8")));
  } catch (error) {
    addError(filePath, `JSON 格式错误：${error.message}`);
    return null;
  }
}

async function validatePublicAsset(sourceFile, assetPath, label) {
  if (!isNonEmptyString(assetPath)) {
    addError(sourceFile, `${label} 不能为空`);
    return;
  }

  if (/^https?:\/\//i.test(assetPath)) return;
  if (!assetPath.startsWith("/")) {
    addError(sourceFile, `${label} 必须以 / 开头或使用完整 https:// 地址`);
    return;
  }

  const cleanPath = assetPath.split(/[?#]/, 1)[0].replace(/^\/+/, "");
  const diskPath = path.join(rootDir, "public", cleanPath);
  if (!(await exists(diskPath))) {
    addError(sourceFile, `${label} 指向的文件不存在：public/${cleanPath}`);
  }
}

function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  return typeof value === "string" ? value.trim() : "";
}

async function validatePosts() {
  const postsDir = path.join(rootDir, "content", "posts");
  const entries = (await readdir(postsDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .sort((a, b) => a.name.localeCompare(b.name));
  const slugs = new Map();

  if (entries.length === 0) {
    addError(postsDir, "至少需要一篇新闻");
    return;
  }

  for (const entry of entries) {
    const filePath = path.join(postsDir, entry.name);
    const raw = stripBom(await readFile(filePath, "utf8"));
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!match) {
      addError(filePath, "缺少有效的 YAML frontmatter（文件开头的 --- 区域）");
      continue;
    }

    let data;
    try {
      data = parseYaml(match[1]) || {};
    } catch (error) {
      addError(filePath, `YAML 格式错误：${error.message}`);
      continue;
    }

    const requiredStrings = [
      "slug",
      "title_zh",
      "title_en",
      "summary_zh",
      "summary_en",
      "cover_image",
    ];
    for (const field of requiredStrings) {
      if (!isNonEmptyString(data[field])) addError(filePath, `缺少字段 ${field}`);
    }

    const slug = isNonEmptyString(data.slug) ? data.slug.trim() : "";
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      addError(filePath, "slug 只能包含英文小写字母、数字和单个连字符");
    }
    if (slug && path.basename(entry.name, ".md") !== slug) {
      addError(filePath, `文件名必须与 slug 一致，应为 ${slug}.md`);
    }
    if (slug && slugs.has(slug)) {
      addError(filePath, `slug 与 ${relative(slugs.get(slug))} 重复`);
    } else if (slug) {
      slugs.set(slug, filePath);
    }

    const date = normalizeDate(data.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      addError(filePath, "date 必须是有效的 YYYY-MM-DD 日期");
    }

    if (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag) => !isNonEmptyString(tag))) {
      addError(filePath, "tags 必须是至少包含一个文字标签的数组");
    }
    if (typeof data.publish_to_wechat !== "boolean") {
      addError(filePath, "publish_to_wechat 必须是 true 或 false，不能加引号");
    }

    await validatePublicAsset(filePath, data.cover_image, "cover_image");
    if (isNonEmptyString(data.wechat_cover_image)) {
      await validatePublicAsset(filePath, data.wechat_cover_image, "wechat_cover_image");
    } else if (data.publish_to_wechat === true) {
      addError(filePath, "准备生成微信草稿时必须填写 wechat_cover_image");
    }

    const body = raw.slice(match[0].length);
    const zhMarker = body.search(/<!--\s*zh\s*-->/i);
    const enMarker = body.search(/<!--\s*en\s*-->/i);
    if (zhMarker < 0 || enMarker < 0) {
      addError(filePath, "正文必须同时包含 <!-- zh --> 和 <!-- en --> 标记");
    } else if (zhMarker > enMarker) {
      addError(filePath, "<!-- zh --> 应位于 <!-- en --> 之前");
    } else {
      const zhBody = body.slice(zhMarker, enMarker).replace(/<!--\s*zh\s*-->/i, "").trim();
      const enBody = body.slice(enMarker).replace(/<!--\s*en\s*-->/i, "").trim();
      if (!zhBody) addError(filePath, "中文正文为空");
      if (!enBody) addError(filePath, "英文正文为空");
    }

    const imagePattern = /!\[[^\]]*\]\((\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
    for (const imageMatch of body.matchAll(imagePattern)) {
      await validatePublicAsset(filePath, imageMatch[1], "正文图片");
    }
  }
}

async function validateTeamMembers() {
  const teamDir = path.join(rootDir, "team_members");
  const entries = (await readdir(teamDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const memberDir = path.join(teamDir, entry.name);
    const profilePath = path.join(memberDir, "profile.json");
    if (!(await exists(profilePath))) {
      addError(memberDir, "缺少 profile.json");
      continue;
    }

    const profile = await readJson(profilePath);
    if (!profile) continue;

    const requiredStrings = ["name", "name_cn", "role", "program", "email", "bio_short", "bio_long"];
    for (const field of requiredStrings) {
      if (!isNonEmptyString(profile[field])) addError(profilePath, `缺少字段 ${field}`);
    }

    if (isNonEmptyString(profile.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      addError(profilePath, "email 格式不正确");
    }
    if (!Array.isArray(profile.keywords) || profile.keywords.length === 0) {
      addError(profilePath, "keywords 必须至少包含一个研究关键词");
    } else if (profile.keywords.some((keyword) => !isNonEmptyString(keyword))) {
      addError(profilePath, "keywords 中不能包含空值");
    }

    for (const field of ["enrollment_year", "graduation_year"]) {
      if (profile[field] !== undefined && (!Number.isInteger(profile[field]) || profile[field] < 1900 || profile[field] > 2200)) {
        addError(profilePath, `${field} 必须是四位整数年份`);
      }
    }
    if (
      Number.isInteger(profile.enrollment_year) &&
      Number.isInteger(profile.graduation_year) &&
      profile.graduation_year < profile.enrollment_year
    ) {
      addError(profilePath, "graduation_year 不能早于 enrollment_year");
    }
    if (profile.enrollment_year === undefined || profile.graduation_year === undefined) {
      addWarning(profilePath, "建议补充 enrollment_year 和 graduation_year，以保证成员排序稳定");
    }

    if (!isObject(profile.links)) {
      addError(profilePath, "links 必须是对象，并包含 google_scholar、personal_website 和 github");
    } else {
      for (const field of ["google_scholar", "personal_website", "github"]) {
        if (typeof profile.links[field] !== "string") addError(profilePath, `links.${field} 必须是字符串`);
      }
    }

    const files = await readdir(memberDir, { withFileTypes: true });
    const photos = files.filter(
      (file) => file.isFile() && imageExtensions.has(path.extname(file.name).toLowerCase()),
    );
    if (photos.length === 0) {
      addError(memberDir, "缺少成员头像（jpg、jpeg 或 png）");
    } else if (photos.length > 1) {
      addError(memberDir, `只能保留一张网站头像，目前发现 ${photos.length} 张`);
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
      addWarning(memberDir, "建议将成员目录改为英文小写 slug，例如 given-family；现有目录仍可继续使用");
    }
  }
}

async function validatePublicationOverrides() {
  const filePath = path.join(rootDir, "src", "publication_doi_overrides.json");
  const items = await readJson(filePath);
  if (!items) return;
  if (!Array.isArray(items)) {
    addError(filePath, "顶层必须是数组");
    return;
  }

  const titleKeys = new Set();
  for (const [index, item] of items.entries()) {
    if (!isObject(item)) {
      addError(filePath, `第 ${index + 1} 项必须是对象`);
      continue;
    }
    for (const field of ["title", "titleKey", "authors", "venue", "url"]) {
      if (!isNonEmptyString(item[field])) addError(filePath, `第 ${index + 1} 项缺少字段 ${field}`);
    }
    if (!Number.isInteger(item.year)) addError(filePath, `第 ${index + 1} 项的 year 必须是整数`);
    if (item.doi !== undefined && !isNonEmptyString(item.doi)) {
      addError(filePath, `第 ${index + 1} 项的 doi 不能是空值；没有 DOI 时请删除该字段`);
    }
    if (isNonEmptyString(item.url) && !/^https?:\/\//i.test(item.url) && !item.url.startsWith("/")) {
      addError(filePath, `第 ${index + 1} 项的 url 必须是完整网址或以 / 开头的站内路径`);
    }
    if (titleKeys.has(item.titleKey)) {
      addError(filePath, `第 ${index + 1} 项的 titleKey 重复：${item.titleKey}`);
    } else if (isNonEmptyString(item.titleKey)) {
      titleKeys.add(item.titleKey);
    }
  }
}

function valueAt(object, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => value?.[key], object);
}

async function validateSiteContent() {
  const filePath = path.join(rootDir, "content", "site-content.json");
  const content = await readJson(filePath);
  if (!content) return;

  const facultyStringFields = ["name", "nameCn", "role", "bioShort", "bioLong"];
  for (const personKey of ["han", "shen"]) {
    const person = content.faculty?.[personKey];
    if (!isObject(person)) {
      addError(filePath, `faculty.${personKey} 必须是对象`);
      continue;
    }
    for (const field of facultyStringFields) {
      if (!isNonEmptyString(person[field])) addError(filePath, `faculty.${personKey}.${field} 不能为空`);
    }
    for (const field of ["keywords", "focus"]) {
      if (!Array.isArray(person[field]) || person[field].length === 0 || person[field].some((item) => !isNonEmptyString(item))) {
        addError(filePath, `faculty.${personKey}.${field} 必须是非空文字数组`);
      }
    }
  }

  const requiredCopyStrings = [
    "nav.home",
    "nav.publications",
    "nav.team",
    "nav.contact",
    "hero.kicker",
    "hero.title1",
    "hero.title2",
    "hero.body",
    "hero.ctaPrimary",
    "hero.ctaSecondary",
    "what.title",
    "what.desc",
    "what.methodTitle",
    "what.questionTitle",
    "join.title",
    "join.desc",
    "join.fieldTitle",
    "join.interestTitle",
    "join.note",
    "updates.title",
    "updates.desc",
    "publications.archives",
    "publications.title",
    "publications.subtitle",
    "publications.all",
    "publications.journals",
    "publications.preprints",
    "publications.sortBy",
    "publications.newest",
    "publications.oldest",
    "publications.empty",
    "publications.cta",
    "publications.ctaButton",
    "team.kicker",
    "team.title",
    "team.subtitle",
    "team.members",
    "footer.publications",
    "footer.team",
    "footer.contact",
    "footer.subtitle",
    "footer.copyright",
  ];
  const requiredCopyArrays = ["what.methods", "what.questions", "join.fields", "join.interests"];

  for (const lang of ["en", "zh"]) {
    const copy = content.copy?.[lang];
    if (!isObject(copy)) {
      addError(filePath, `copy.${lang} 必须是对象`);
      continue;
    }
    for (const field of requiredCopyStrings) {
      if (!isNonEmptyString(valueAt(copy, field))) addError(filePath, `copy.${lang}.${field} 不能为空`);
    }
    for (const field of requiredCopyArrays) {
      const items = valueAt(copy, field);
      if (!Array.isArray(items) || items.length === 0 || items.some((item) => !isNonEmptyString(item))) {
        addError(filePath, `copy.${lang}.${field} 必须是非空文字数组`);
      }
    }
  }
}

await validatePosts();
await validateTeamMembers();
await validatePublicationOverrides();
await validateSiteContent();

for (const warning of warnings) console.warn(`WARNING ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR ${error}`);
  console.error(`\n内容检查失败：${errors.length} 个错误，${warnings.length} 个提醒。`);
  process.exitCode = 1;
} else {
  console.log(`内容检查通过：${warnings.length} 个提醒。`);
}
