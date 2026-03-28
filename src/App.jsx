import { useEffect, useMemo, useRef, useState } from "react";
import { BrainWaveLogo, BackgroundWave } from "./components/BrainWaveLogo";
import bibUrl from "../exported-references.bib?url";
import annotationUrl from "../publications_annotation_template.csv?url";
import publicationDoiOverrides from "./publication_doi_overrides.json";
import groupPhoto from "../group_photo.jpg";
import scnuLogo from "../SouthChinaNormalUniv_Logo.svg.png";
import hanBiaoPhoto from "./assets/faculty/han-biao.jpg";
import shenLuPhotoCrop from "./assets/faculty/shen-lu-crop.jpg";

const MODE_CONTROL_KEY = "bsd-mode-control";
const MANUAL_MODE_KEY = "bsd-manual-mode";
const LAST_COORDS_KEY = "bsd-last-coords";
const LANG_KEY = "bsd-site-lang";
const updatesByLang = {
  en: [
    {
      date: "2026-03",
      title: "BSD Lab Website Launch",
      content:
        "We launched the first public version of BSD Lab website and opened initial research opportunities for students interested in neural dynamics and BCI.",
    },
    {
      date: "2026-02",
      title: "BCI Direction Framing",
      content:
        "The lab defined a new closed-loop brain-computer interface line focusing on state tracking, adaptive stimulation, and behavior-linked decoding.",
    },
    {
      date: "2026-01",
      title: "Cross-Modal Dynamics Program",
      content:
        "A new internal program started to connect oscillatory dynamics, perception, and multisensory integration across EEG and intracranial pipelines.",
    },
    {
      date: "2025-12",
      title: "Open Collaboration Call",
      content:
        "We invite graduate students and collaborators with interests in computational neuroscience, signal analysis, and cognitive state modeling.",
    },
  ],
  zh: [], /*
    {
      date: "2026-03",
      title: "BSD Lab 网站上线",
      content:
        "我们发布了 BSD Lab 首个公开版本网站，并开放了面向神经动力学与脑机接口方向学生的初步研究机会。",
    },
    {
      date: "2026-02",
      title: "脑机接口方向确立",
      content:
        "实验室明确了新的闭环脑机接口研究主线，重点关注状态追踪、自适应刺激与行为关联解码。",
    },
    {
      date: "2026-01",
      title: "跨模态动力学项目启动",
      content:
        "我们启动了新的内部项目，连接振荡动力学、知觉与多感官整合，并打通 EEG 与颅内数据流程。",
    },
    {
      date: "2025-12",
      title: "开放合作招募",
      content:
        "欢迎对计算神经科学、信号分析与认知状态建模感兴趣的研究生与合作者加入我们。",
    },
  */
};

updatesByLang.zh = [
  {
    date: "2026-03",
    title: "BSD Lab 网站上线",
    content:
      "我们发布了 BSD Lab 首个公开版本网站，并开放了面向神经动力学与脑机接口方向学生的初步研究机会。",
  },
  {
    date: "2026-02",
    title: "脑机接口方向确立",
    content:
      "实验室明确了新的闭环脑机接口研究主线，重点关注状态追踪、自适应刺激与行为关联解码。",
  },
  {
    date: "2026-01",
    title: "跨模态动力学项目启动",
    content:
      "我们启动了新的内部项目，连接振荡动力学、知觉与多感官整合，并打通 EEG 与颅内数据流程。",
  },
  {
    date: "2025-12",
    title: "开放合作招募",
    content:
      "欢迎对计算神经科学、信号分析与认知状态建模感兴趣的研究生与合作方加入我们。",
  },
];

const hanProfile = {
  name: "Biao Han",
  nameCn: "\u97e9\u5f6a",
  role: "Principal Investigator",
  keywords: ["Neural Oscillations", "Conscious Perception", "Internal Timing", "Traveling Waves"],
  bioShort:
    "I study how intrinsic neural oscillations shape conscious perception and internally generated timing across cortical networks.",
  bioLong:
    "I study how intrinsic neural oscillations control conscious perception and internally generated timing. Combining psychophysics, human intracranial recordings, electrophysiology, neuroimaging, computational modeling, and closed-loop stimulation, I investigate how oscillatory phase, frequency, and traveling-wave dynamics gate information flow across cortical networks to determine perceptual outcomes.",
  focus: [
    "Oscillatory control of perception and timing",
    "Phase/frequency/traveling-wave gating across cortical networks",
    "Causal tests with real-time closed-loop stimulation",
  ],
  website: "https://biaohan.org/",
};

const shenProfile = {
  name: "Lu Shen",
  nameCn: "\u6c88\u8def",
  role: "Principal Investigator",
  keywords: ["Cognitive Neuroscience", "Perceptual Inference", "Multisensory Integration", "Brain-State Modulation"],
  bioShort:
    "I study how brain states shape perceptual experience and cognitive processing through fMRI, EEG, iEEG, and brain-state-dependent closed-loop approaches.",
  bioLong:
    "I study how brain states shape perceptual experience and cognitive processing. Combining cognitive neuroscience with fMRI, EEG, and intracranial recordings (iEEG), I investigate how perceptual inference and multisensory integration emerge from dynamic interactions across large-scale brain networks, and how these processes can be modulated through brain-state-dependent and closed-loop approaches.",
  focus: [
    "Pre-stimulus brain-state effects on perceptual decisions",
    "Multisensory integration with EEG/fMRI/intracranial datasets",
    "Real-time decoding and adaptive closed-loop paradigms",
  ],
};

const copyByLang = {
  en: {
    nav: { home: "Home", publications: "Publications", team: "Team", contact: "Contact" },
    hero: {
      kicker: "Brain State Dynamics Lab",
      title1: "Understanding and controlling brain states",
      title2: "to shape perception and behavior",
      body:
        "The brain is not static. It constantly fluctuates between dynamic states that shape how we perceive, think, and act. At BSD Lab, we investigate how intrinsic brain states, especially neural oscillations, govern information processing across cortical networks and enable real-time, closed-loop interaction with the brain.",
      ctaPrimary: "Join Us",
      ctaSecondary: "Publications",
    },
    what: {
      title: "What We Do",
      desc:
        "We integrate cognitive neuroscience with cutting-edge neurotechnology to move from observing brain states to interacting with them in real time.",
      methodTitle: "Methods We Combine",
      questionTitle: "Key Questions",
      methods: [
        "Cognitive psychology and psychophysics",
        "EEG, fMRI, and human intracranial recordings (sEEG/ECoG)",
        "Computational modeling of brain dynamics",
        "Real-time decoding and closed-loop stimulation",
      ],
      questions: [
        "How do brain states gate conscious perception?",
        "How does information flow across distributed brain networks?",
        "Can we predict perception from ongoing neural activity?",
        "Can we control brain states in real time?",
      ],
    },
    join: {
      title: "Join Us",
      desc:
        "We are building an interdisciplinary lab bridging neuroscience, cognition, engineering, and computation.",
      fieldTitle: "Interdisciplinary Interface",
      interestTitle: "Who We Are Looking For",
      fields: ["Neuroscience", "Psychology", "Engineering", "Computer Science"],
      interests: [
        "Brain dynamics and neural oscillations",
        "Consciousness and perception",
        "Intracranial data and advanced neurotechnology",
        "Closed-loop systems and brain-computer interfaces",
      ],
      note:
        "You do not need experience in all areas. Curiosity and the willingness to cross disciplines matter most.",
    },
    updates: {
      title: "Updates",
      desc:
        "Lab announcements, project milestones, and opportunities for new students and collaborators.",
    },
    publications: {
      archives: "The Archives",
      title: "Publications",
      subtitle:
        "Scholarly contributions to neuroscience, from theoretical frameworks to empirical computational and translational models.",
      all: "All Works",
      journals: "Journal Articles",
      preprints: "Preprints",
      sortBy: "Sort By",
      newest: "Newest First",
      oldest: "Oldest First",
      empty: "No publications found for this filter.",
      cta: "Interested in collaborating or accessing our datasets?",
      ctaButton: "Contact BSD Lab",
    },
    team: {
      kicker: "The People",
      title: "Research Team",
      subtitle:
        "A collaborative group of neuroscientists, engineers, and mathematicians dedicated to decoding the brain's dynamic states.",
      members: "Lab Members",
    },
    footer: {
      publications: "Publications",
      team: "Team",
      contact: "Contact",
      subtitle: "School of Psychology\nSouth China Normal University",
      copyright: "(c) 2026 Brain State Dynamics Lab. All rights reserved.",
    },
  },
  zh: {}, /*
    nav: { home: "首页", publications: "论文", team: "成员", contact: "联系" },
    hero: {
      kicker: "脑状态动力学实验室",
      title1: "理解并调控脑状态",
      title2: "以塑造知觉与行为",
      body:
        "大脑并非静态系统，而是在不同动态状态间持续波动，并影响我们的知觉、思维与行为。BSD Lab 聚焦内在脑状态，尤其是神经振荡，研究其如何调控皮层网络中的信息处理，并推动实时闭环的人脑交互范式。",
      ctaPrimary: "加入我们",
      ctaSecondary: "查看论文",
    },
    what: {
      title: "我们在做什么",
      desc:
        "我们融合认知神经科学与前沿神经技术，推动研究从“观察脑状态”走向“实时交互与调控脑状态”。",
      methodTitle: "核心方法",
      questionTitle: "关键科学问题",
      methods: [
        "认知心理学与心理物理学",
        "EEG、fMRI 与人类颅内记录（sEEG/ECoG）",
        "脑动力学计算建模",
        "实时解码与闭环刺激",
      ],
      questions: [
        "脑状态如何门控意识知觉？",
        "信息如何在分布式脑网络中流动？",
        "能否基于持续神经活动预测知觉结果？",
        "能否在实时中调控脑状态？",
      ],
    },
    join: {
      title: "加入我们",
      desc: "我们正在建设一个跨学科实验室，连接神经科学、心理学、工程与计算。",
      fieldTitle: "跨学科交叉",
      interestTitle: "招募方向",
      fields: ["神经科学", "心理学", "工程", "计算机科学"],
      interests: ["脑动力学与神经振荡", "意识与知觉", "颅内数据与神经技术", "闭环系统与脑机接口"],
      note: "不需要覆盖所有方向。我们最看重的是好奇心与跨学科合作意愿。",
    },
    updates: { title: "实验室动态", desc: "发布实验室进展、项目里程碑与招募信息。" },
    publications: {
      archives: "论文档案",
      title: "论文发表",
      subtitle: "汇总实验室在神经科学领域的代表性成果，包括理论研究与实证工作。",
      all: "全部",
      journals: "期刊论文",
      preprints: "预印本",
      sortBy: "排序方式",
      newest: "最新优先",
      oldest: "最早优先",
      empty: "当前筛选条件下暂无论文。",
      cta: "欢迎交流合作或数据申请。",
      ctaButton: "联系 BSD Lab",
    },
    team: {
      kicker: "团队成员",
      title: "研究团队",
      subtitle: "我们由神经科学、工程与计算背景成员组成，协同探索脑状态动力学机制。",
      members: "实验室成员",
    },
    footer: { publications: "论文", team: "成员", contact: "联系" },
  */
};

copyByLang.zh = {
  nav: { home: "首页", publications: "论文发表", team: "团队成员", contact: "联系我们" },
  hero: {
    kicker: "Brain State Dynamics Lab",
    title1: "BSD Lab",
    title2: "脑状态动力学",
    body:
      "探索意识与感知的神经机制，推动下一代脑机接口技术发展。",
    ctaPrimary: "探索研究",
    ctaSecondary: "最新论文",
  },
  what: {
    title: "我们在做什么",
    desc:
      "我们融合认知神经科学与前沿神经技术，推动研究从“观察脑状态”走向“实时交互与调控脑状态”。",
    methodTitle: "核心方法",
    questionTitle: "关键科学问题",
    methods: [
      "认知心理学与心理物理学",
      "EEG、fMRI 与人类颅内记录（sEEG/ECoG）",
      "脑动力学计算建模",
      "实时解码与闭环刺激",
    ],
    questions: [
      "脑状态如何门控意识知觉？",
      "信息如何在分布式脑网络中流动？",
      "能否基于持续神经活动预测知觉结果？",
      "能否在实时中调控脑状态？",
    ],
  },
  join: {
    title: "加入我们",
    desc: "我们正在建设一个跨学科实验室，连接神经科学、心理学、工程与计算。",
    fieldTitle: "跨学科交叉",
    interestTitle: "招募方向",
    fields: ["神经科学", "心理学", "工程", "计算机科学"],
    interests: ["脑动力学与神经振荡", "意识与知觉", "颅内数据与神经技术", "闭环系统与脑机接口"],
    note: "不需要覆盖所有方向。我们最看重的是好奇心与跨学科协作意愿。",
  },
  updates: {
    title: "实验室动态",
    desc: "发布实验室进展、项目里程碑与招募信息。",
  },
  publications: {
    archives: "论文档案",
    title: "论文发表",
    subtitle: "汇总实验室在神经科学领域的代表性成果，包括理论研究与实证工作。",
    all: "全部",
    journals: "期刊论文",
    preprints: "预印本",
    sortBy: "排序方式",
    newest: "最新优先",
    oldest: "最早优先",
    empty: "当前筛选条件下暂无论文。",
    cta: "欢迎交流合作或数据申请。",
    ctaButton: "联系 BSD Lab",
  },
  team: {
    kicker: "团队成员",
    title: "研究团队",
    subtitle: "我们由神经科学、工程与计算背景成员组成，协同探索脑状态动力学机制。",
    members: "实验室成员",
  },
  footer: {
    publications: "论文发表",
    team: "团队成员",
    contact: "联系我们",
    subtitle: "脑状态动力学实验室",
    copyright: "© 2026 脑状态动力学实验室 版权所有。",
  },
};

const manualPublications = [
  {
    id: "manual-biorxiv-2026-710730",
    title: "Instantaneous Beta Frequency Regulates Self-Generated Timing in Humans",
    authors: "Yitong Zeng, Xiangshu Hu, Zhenyi Hu, Jia Li, Qianyi Wu, Lu Shen, Biao Han",
    venue: "bioRxiv",
    year: 2026,
    month: 3,
    day: 10,
    doi: "10.64898/2026.03.10.710730",
    url: "https://www.biorxiv.org/content/10.64898/2026.03.10.710730v1.full",
    source: "manual",
    forcedInclude: true,
    dedupeKey: "doi:10.64898/2026.03.10.710730",
    authorMarks: createEmptyMarks(),
  },
];

const memberProfileFiles = import.meta.glob("../team_members/*/profile.json", {
  eager: true,
  as: "raw",
});

const memberPhotoFiles = import.meta.glob("../team_members/*/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
  eager: true,
  import: "default",
});

function normalizeUnicodeText(text = "") {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function extractStringField(raw, key) {
  const match = raw.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`));
  return match ? normalizeUnicodeText(match[1]) : "";
}

function extractKeywordList(raw) {
  const block = raw.match(/"keywords"\s*:\s*\[([\s\S]*?)\]/);
  if (!block) return [];
  const matches = block[1].match(/"([^"]+)"/g) || [];
  return matches
    .map((item) => normalizeUnicodeText(item.replace(/^"|"$/g, "")))
    .filter(Boolean);
}

function extractNumberField(raw, key) {
  const match = raw.match(new RegExp(`"${key}"\\s*:\\s*(\\d{4})`));
  return match ? Number.parseInt(match[1], 10) : Number.NaN;
}

const teamMemberNameCnFallback = {}; /*
  "dingxian-huang": "黄定贤",
  "dongdong-chen": "陈冬冬",
  "eve-zeng": "曾奕彤",
  "shengpei-zhao": "赵晟培",
  "wei-song": "宋伟",
  "yihua-chen": "陈依华",
  "jianan-zhu": "朱嘉楠",
  "tingyu-zhou": "周庭宇",
  "xiaoyu-deng": "邓晓宇",
  "xuantao-zhang": "张轩涛",
  "yuxiang-ma": "马宇翔",
*/

Object.assign(teamMemberNameCnFallback, {
  "dingxian-huang": "黄定贤",
  "dongdong-chen": "陈冬冬",
  "eve-zeng": "曾奕彤",
  "shengpei-zhao": "赵晟培",
  "wei-song": "宋伟",
  "yihua-chen": "陈依华",
  "jianan-zhu": "朱佳楠",
  "tingyu-zhou": "周庭宇",
  "xiaoyu-deng": "邓晓宇",
  "xuantao-zhang": "张璇涛",
  "yuxiang-ma": "马宇翔",
  "mingxia-yang": "杨明霞",
});

function hasReadableChinese(value = "") {
  return /[\u3400-\u9fff]/.test(value);
}

function parseTeamMemberRaw(raw, slug) {
  const rawText = typeof raw === "string" ? raw : JSON.stringify(raw || {});
  const name = extractStringField(rawText, "name") || slug;
  const normalizedNameOverrides = {
    "yuxiang-ma": "Yuxiang Ma",
  };
  const nameCnRaw = extractStringField(rawText, "name_cn");
  const slugKey = slug.toLowerCase();
  const nameCn = hasReadableChinese(nameCnRaw)
    ? nameCnRaw
    : teamMemberNameCnFallback[slugKey] || "";
  const currentYear = new Date().getFullYear();
  const slugKeyLower = slug.toLowerCase();
  const roleOverrides = {
    "dingxian-huang": currentYear >= 2026 ? "PhD Student" : "Prospective PhD Student",
  };
  const displayRole = roleOverrides[slugKeyLower] || "Master Student";
  const program = extractStringField(rawText, "program");
  const email = extractStringField(rawText, "email");
  const bioShort = extractStringField(rawText, "bio_short");
  const bioLong = extractStringField(rawText, "bio_long");
  const keywords = extractKeywordList(rawText);
  const enrollmentYear = extractNumberField(rawText, "enrollment_year");
  const graduationYear = extractNumberField(rawText, "graduation_year");

  return {
    id: slug,
    name: normalizedNameOverrides[slugKey] || name,
    nameCn,
    role: displayRole,
    interest: displayRole,
    email,
    bio: bioShort || "Profile details will be updated soon.",
    bioLong: bioLong || bioShort || "Profile details will be updated soon.",
    keywords,
    enrollmentYear,
    graduationYear,
  };
}

function inferCohortYear(member) {
  const fromEmail = (member.email || "").match(/\b(20\d{2})\d{4,}\b/);
  if (fromEmail) return Number.parseInt(fromEmail[1], 10);

  const fromText = `${member.bio || ""} ${member.bioLong || ""}`.match(/\b(20\d{2})\b/);
  if (fromText) return Number.parseInt(fromText[1], 10);

  return Number.POSITIVE_INFINITY;
}

function roleSortRank(role = "") {
  const normalized = role.toLowerCase();
  if (/master|postgraduate/.test(normalized)) return 0;
  if (/phd|doctoral/.test(normalized)) return 1;
  return 2;
}

function buildTeamMembers() {
  const photoVersionOverrides = {
    "yuxiang-ma": "20260327-1",
  };

  const photosBySlug = Object.entries(memberPhotoFiles).reduce((acc, [path, url]) => {
    const slugMatch = path.match(/team_members\/([^/]+)\//);
    if (!slugMatch) return acc;
    acc[slugMatch[1]] = url;
    return acc;
  }, {});

  const members = Object.entries(memberProfileFiles).map(([path, raw]) => {
    const slugMatch = path.match(/team_members\/([^/]+)\//);
    const slug = slugMatch ? slugMatch[1] : "member";
    const parsed = parseTeamMemberRaw(raw, slug);
    const imageUrl = photosBySlug[slug];
    const photoVersion = photoVersionOverrides[slug];
    return {
      ...parsed,
      image: imageUrl
        ? `${imageUrl}${photoVersion ? `?v=${photoVersion}` : ""}`
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300",
    };
  });

  const withMeta = members.map((member) => ({
    ...member,
    pinTopRank: member.id === "dingxian-huang" ? 0 : 1,
    cohortYear: Number.isFinite(member.enrollmentYear)
      ? member.enrollmentYear
      : inferCohortYear(member),
    finishYear: Number.isFinite(member.graduationYear)
      ? member.graduationYear
      : Number.POSITIVE_INFINITY,
    roleRank: roleSortRank(member.role),
  }));

  return withMeta.sort((a, b) => {
    if (a.pinTopRank !== b.pinTopRank) return a.pinTopRank - b.pinTopRank;
    if (a.roleRank !== b.roleRank) return a.roleRank - b.roleRank;
    if (a.cohortYear !== b.cohortYear) return a.cohortYear - b.cohortYear;
    if (a.finishYear !== b.finishYear) return a.finishYear - b.finishYear;
    return a.name.localeCompare(b.name);
  });
}

const teamMembers = buildTeamMembers();
const studentPlaceholders = teamMembers;

function isKnownMode(value) {
  return value === "classic" || value === "variant-1";
}

function getFallbackAutoMode(now) {
  const hour = now.getHours();
  return hour >= 7 && hour < 19 ? "classic" : "variant-1";
}

function getDateToken(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function fetchSunWindow(coords, dateToken) {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lng: String(coords.lng),
    date: dateToken,
    formatted: "0",
  });
  const response = await fetch(`https://api.sunrise-sunset.org/json?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sun data.");
  }

  const payload = await response.json();
  if (payload.status !== "OK") {
    throw new Error("Sun data is unavailable.");
  }

  const sunrise = new Date(payload.results.sunrise);
  const sunset = new Date(payload.results.sunset);
  if (Number.isNaN(sunrise.getTime()) || Number.isNaN(sunset.getTime())) {
    throw new Error("Sun data is invalid.");
  }
  return { sunrise, sunset };
}

function computeModeFromSun(now, sunWindow) {
  return now >= sunWindow.sunrise && now < sunWindow.sunset ? "classic" : "variant-1";
}

function getNextRefreshDelay(now, sunWindow) {
  let nextEvent;
  if (now < sunWindow.sunrise) {
    nextEvent = sunWindow.sunrise;
  } else if (now < sunWindow.sunset) {
    nextEvent = sunWindow.sunset;
  } else {
    nextEvent = new Date(now);
    nextEvent.setDate(nextEvent.getDate() + 1);
    nextEvent.setHours(0, 5, 0, 0);
  }
  return Math.max(nextEvent.getTime() - now.getTime() + 1000, 60_000);
}

function getLangFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("lang");
  return value === "zh" || value === "en" ? value : null;
}

function normalizeRoutePath(value) {
  if (!value || value === "#") return "/";
  const route = value.startsWith("/") ? value : `/${value}`;
  if (route === "/publications" || route === "/team" || route === "/") return route;
  return "/";
}

function getRouteFromHash() {
  const raw = window.location.hash.replace(/^#/, "");
  return normalizeRoutePath(raw);
}

function buildInternalHref(path, lang) {
  const normalizedPath = normalizeRoutePath(path);
  const params = new URLSearchParams(window.location.search);
  const basePath = window.location.pathname || "/";

  if (lang === "zh") {
    params.set("lang", "zh");
  } else {
    params.delete("lang");
  }

  const query = params.toString();
  const routeHash = normalizedPath === "/" ? "#/" : `#${normalizedPath}`;
  return `${basePath}${query ? `?${query}` : ""}${routeHash}`;
}

function normalizeTitle(text) {
  return text
    .toLowerCase()
    .replace(/[{}]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/gi, "-")
    .replace(/&mdash;/gi, "-")
    .replace(/&uuml;/gi, "u")
    .replace(/&eacute;/gi, "e")
    .replace(/&ouml;/gi, "o")
    .replace(/&auml;/gi, "a");
}

function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl.replace(/^\.\//, ""), "https://biaohan.org/").toString();
}

function extractYear(text) {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

function cleanDoi(doi) {
  return doi.replace(/[{}]/g, "").replace(/\s+/g, "").trim();
}

function normalizeAuthorsText(authors = "") {
  const normalizeAuthorWordCase = (text) =>
    text.replace(/\b[A-Z]{2,}\b/g, (word) => `${word[0]}${word.slice(1).toLowerCase()}`);

  return authors
    .replace(/\bco[-\s]?first\s+author\b/gi, "")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ", ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.;:])/g, "$1")
    .trim()
    .split(",")
    .map((name) => normalizeAuthorWordCase(name.trim()))
    .filter(Boolean)
    .join(", ");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          value += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        value += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(value);
      value = "";
    } else if (ch === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (ch !== "\r") {
      value += ch;
    }
  }
  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

function parseAnnotationCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return {
      annotations: new Map(),
      allowedKeys: new Set(),
    };
  }
  const header = rows[0];
  const idx = Object.fromEntries(header.map((name, i) => [name.trim(), i]));
  const asBoolOverride = (v) => {
    const val = (v || "").trim().toUpperCase();
    if (val === "Y") return true;
    if (val === "N") return false;
    return null;
  };
  const annotations = new Map();
  const allowedKeys = new Set();
  for (let r = 1; r < rows.length; r += 1) {
    const row = rows[r];
    const title = (row[idx.title] || "").trim();
    if (!title) continue;
    const doi = cleanDoi(row[idx.doi] || "");
    const doiKey = doi ? `doi:${doi.toLowerCase()}` : "";
    const titleKey = `title:${normalizeTitle(title)}`;
    const markPayload = {
      "Han Biao": {
        bold: asBoolOverride(row[idx.han_bold]),
        equalFirst: asBoolOverride(row[idx["han_equal_first_*"]]),
        corresponding: asBoolOverride(row[idx["han_corresponding_#"]]),
      },
      "Shen Lu": {
        bold: asBoolOverride(row[idx.shen_bold]),
        equalFirst: asBoolOverride(row[idx["shen_equal_first_*"]]),
        corresponding: asBoolOverride(row[idx["shen_corresponding_#"]]),
      },
    };

    // Keep both keys so manual annotations can still hit when merged data prefers DOI key.
    if (doiKey) {
      allowedKeys.add(doiKey);
      annotations.set(doiKey, markPayload);
    }
    allowedKeys.add(titleKey);
    annotations.set(titleKey, markPayload);
  }
  return {
    annotations,
    allowedKeys,
  };
}

function createEmptyMarks() {
  return {
    "Han Biao": { bold: false, equalFirst: false, corresponding: false },
    "Shen Lu": { bold: false, equalFirst: false, corresponding: false },
  };
}

function mergeAuthorMarks(primary, secondary) {
  const a = primary || createEmptyMarks();
  const b = secondary || createEmptyMarks();
  return {
    "Han Biao": {
      bold: Boolean(a["Han Biao"]?.bold || b["Han Biao"]?.bold),
      equalFirst: Boolean(a["Han Biao"]?.equalFirst || b["Han Biao"]?.equalFirst),
      corresponding: Boolean(a["Han Biao"]?.corresponding || b["Han Biao"]?.corresponding),
    },
    "Shen Lu": {
      bold: Boolean(a["Shen Lu"]?.bold || b["Shen Lu"]?.bold),
      equalFirst: Boolean(a["Shen Lu"]?.equalFirst || b["Shen Lu"]?.equalFirst),
      corresponding: Boolean(a["Shen Lu"]?.corresponding || b["Shen Lu"]?.corresponding),
    },
  };
}

function hasNearbyCue(source, namePattern, cuePattern) {
  if (!source) return false;
  const pattern = new RegExp(
    `(?:${namePattern})[\\s\\S]{0,120}(?:${cuePattern})|(?:${cuePattern})[\\s\\S]{0,120}(?:${namePattern})`,
    "i",
  );
  return pattern.test(source);
}

function inferAuthorMarks(authorsText = "", authorsHtml = "") {
  const marks = createEmptyMarks();
  const combined = `${authorsText} ${authorsHtml}`;
  const hanName = "(Biao\\s+Han|Han\\s+Biao|Han,\\s*Biao)";
  const shenName = "(Shen,\\s*Lu|Lu\\s+Shen|Shen\\s+Lu)";
  const equalCue = "(co[-\\s]?first|equal\\s+contribution|equal\\s+first|first\\s+author)";
  const corrCue = "(icon_mail|corresponding|correspondence)";

  if (new RegExp(hanName, "i").test(combined)) {
    marks["Han Biao"].bold = true;
  }
  if (new RegExp(shenName, "i").test(combined)) {
    marks["Shen Lu"].bold = true;
  }

  if (hasNearbyCue(combined, hanName, equalCue)) {
    marks["Han Biao"].equalFirst = true;
  }
  if (hasNearbyCue(combined, shenName, equalCue)) {
    marks["Shen Lu"].equalFirst = true;
  }
  if (hasNearbyCue(combined, hanName, corrCue)) {
    marks["Han Biao"].corresponding = true;
  }
  if (hasNearbyCue(combined, shenName, corrCue)) {
    marks["Shen Lu"].corresponding = true;
  }

  return marks;
}

function parseBibPublications(text) {
  const entries = text
    .split(/^@/m)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => `@${chunk}`);

  const parseField = (entryText, fieldName) => {
    const pattern = new RegExp(`${fieldName}\\s*=\\s*(\\{[^\\n]*\\}|\"[^\\n]*\")`, "i");
    const match = entryText.match(pattern);
    if (!match) return "";
    return match[1]
      .replace(/^[{"]|[}"]$/g, "")
      .replace(/[{}]/g, "")
      .replace(/\\_/g, "_")
      .replace(/\s+/g, " ")
      .trim();
  };

  const monthMap = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };

  const items = entries
    .map((entryText, index) => {
      const idMatch = entryText.match(/^@\w+\{([^,]+)/);
      const authors = parseField(entryText, "author");
      const title = parseField(entryText, "title");
      const monthRaw = parseField(entryText, "month").toLowerCase().slice(0, 3);
      const day = Number.parseInt(parseField(entryText, "day"), 10) || 0;
      const year = Number.parseInt(parseField(entryText, "year"), 10) || 0;
      const month = monthMap[monthRaw] || 0;
      const doi = parseField(entryText, "doi");
      const url = parseField(entryText, "url");

      return {
        id: idMatch ? idMatch[1].trim() : `entry-${index}`,
        title,
        authors: normalizeAuthorsText(authors),
        venue: parseField(entryText, "journal"),
        year,
        month,
        day,
        doi: cleanDoi(doi),
        url,
        source: "bib",
        authorMarks: inferAuthorMarks(authors),
        dedupeKey: doi ? `doi:${cleanDoi(doi).toLowerCase()}` : `title:${normalizeTitle(title)}`,
      };
    })
    .filter((item) => item.title && /(Han,\s*Biao|Biao\s+Han|Shen,\s*Lu|Lu\s+Shen)/i.test(item.authors));

  return items;
}

function parseHanPublicationsFromSite(html) {
  const publicationSection = html.includes('id="publication"')
    ? html.split('id="publication"')[1]
    : html;
  const sourceSlice = publicationSection.split('id="brain"')[0];
  const pattern =
    /<a[^>]+href="([^"]+)"[^>]*>\s*<h3>([\s\S]*?)<\/h3>\s*<h3>([\s\S]*?)<\/h3>\s*(?:<h6>([\s\S]*?)<\/h6>)?/gi;
  const results = [];
  let match;

  while ((match = pattern.exec(sourceSlice)) !== null) {
    const title = decodeEntities(stripTags(match[2]));
    const venueLine = decodeEntities(stripTags(match[3]));
    if (!title || title.length < 8) continue;
    const year = extractYear(venueLine);
    const authorsHtml = match[4] || "";
    const authors = normalizeAuthorsText(decodeEntities(stripTags(authorsHtml)));
    const url = toAbsoluteUrl(match[1]);
    const doiMatch = (url || "").match(/10\.\d{4,9}\/[^\s]+/i);
    const doi = doiMatch ? cleanDoi(doiMatch[0]) : "";
    const venue = venueLine.replace(/\b(19|20)\d{2}\b.*/g, "").trim() || venueLine;

    results.push({
      id: `han-site-${results.length + 1}`,
      title,
      authors,
      venue,
      year,
      month: 0,
      day: 0,
      doi,
      url,
      source: "han-site",
      authorMarks: inferAuthorMarks(authors, authorsHtml),
      dedupeKey: doi ? `doi:${doi.toLowerCase()}` : `title:${normalizeTitle(title)}`,
    });
  }

  return results;
}

async function fetchHanPublicationsFromSite() {
  const urls = [
    "https://biaohan.org",
    "https://r.jina.ai/http://biaohan.org/index.html",
    "https://r.jina.ai/http://www.biaohan.org/index.html",
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const html = await response.text();
      const parsed = parseHanPublicationsFromSite(html);
      if (parsed.length > 0) return parsed;
    } catch {
      // try next source
    }
  }
  return [];
}

function scorePublication(item) {
  return (
    (item.doi ? 1000 : 0) +
    (item.source === "han-site" ? 150 : 0) +
    (item.url ? 60 : 0) +
    (item.venue ? 40 : 0) +
    (item.authors ? 20 : 0) +
    (item.year || 0)
  );
}

function pickPreferredUrl(...urls) {
  const cleaned = urls.filter(Boolean);
  if (cleaned.length === 0) return "";
  const pdfUrl = cleaned.find((url) => /\.pdf(\?|$)/i.test(url));
  return pdfUrl || cleaned[0];
}

function pickMoreCompletePublication(a, b) {
  if (scorePublication(a) > scorePublication(b)) return a;
  if (scorePublication(a) < scorePublication(b)) return b;

  const aDate = (a.year || 0) * 10000 + (a.month || 0) * 100 + (a.day || 0);
  const bDate = (b.year || 0) * 10000 + (b.month || 0) * 100 + (b.day || 0);
  return bDate > aDate ? b : a;
}

function mergeAndDeduplicatePublications(items) {
  const records = new Map();
  const keyToId = new Map();
  let idSeed = 0;

  const resolveRecordId = (doiKey, titleKey) => keyToId.get(doiKey) || keyToId.get(titleKey) || "";

  const bindKeys = (id, doiKey, titleKey) => {
    if (doiKey) keyToId.set(doiKey, id);
    if (titleKey) keyToId.set(titleKey, id);
  };

  for (const item of items) {
    const doiKey = item.doi ? `doi:${cleanDoi(item.doi).toLowerCase()}` : "";
    const titleKey = `title:${normalizeTitle(item.title || "")}`;
    if (!titleKey) continue;

    const existingId = resolveRecordId(doiKey, titleKey);
    if (!existingId) {
      const id = `pub-${++idSeed}`;
      const seedItem = {
        ...item,
        doi: cleanDoi(item.doi || ""),
        dedupeKey: doiKey || titleKey,
      };
      records.set(id, seedItem);
      bindKeys(id, doiKey, titleKey);
      continue;
    }

    const existing = records.get(existingId);
    const winner = pickMoreCompletePublication(existing, item);
    const loser = winner === existing ? item : existing;
    const merged = {
      ...winner,
      doi: cleanDoi(winner.doi || loser.doi || ""),
      url: pickPreferredUrl(winner.url, loser.url),
      dedupeKey: cleanDoi(winner.doi || loser.doi)
        ? `doi:${cleanDoi(winner.doi || loser.doi).toLowerCase()}`
        : titleKey,
      authorMarks: mergeAuthorMarks(existing.authorMarks, item.authorMarks),
    };
    records.set(existingId, merged);
    bindKeys(existingId, merged.dedupeKey.startsWith("doi:") ? merged.dedupeKey : doiKey, titleKey);
  }

  return Array.from(records.values()).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (b.month !== a.month) return b.month - a.month;
    if (b.day !== a.day) return b.day - a.day;
    return a.title.localeCompare(b.title);
  });
}

function applyManualAnnotations(items, annotationMap) {
  const sanitizeMark = (mark) => {
    if (mark.equalFirst && mark.corresponding) {
      return { ...mark, corresponding: false };
    }
    return mark;
  };

  const applyOne = (current, override) => {
    const next = {
      bold: override.bold ?? current.bold,
      equalFirst: override.equalFirst ?? current.equalFirst,
      corresponding: override.corresponding ?? current.corresponding,
    };

    // If manual annotation explicitly chooses one symbol and leaves the other blank,
    // force a single-symbol output.
    if (override.equalFirst === true && override.corresponding === null) {
      next.corresponding = false;
    }
    if (override.corresponding === true && override.equalFirst === null) {
      next.equalFirst = false;
    }

    return sanitizeMark(next);
  };

  return items.map((item) => {
    const titleKey = `title:${normalizeTitle(item.title || "")}`;
    const override = annotationMap.get(item.dedupeKey) || annotationMap.get(titleKey);
    if (!override) return item;
    return {
      ...item,
      authorMarks: {
        "Han Biao": applyOne(item.authorMarks?.["Han Biao"] || createEmptyMarks()["Han Biao"], override["Han Biao"]),
        "Shen Lu": applyOne(item.authorMarks?.["Shen Lu"] || createEmptyMarks()["Shen Lu"], override["Shen Lu"]),
      },
    };
  });
}

function filterByAllowedKeys(items, allowedKeys) {
  if (!allowedKeys || allowedKeys.size === 0) return items;
  return items.filter((item) => {
    if (item.forcedInclude) return true;
    const titleKey = `title:${normalizeTitle(item.title || "")}`;
    return (item.dedupeKey && allowedKeys.has(item.dedupeKey)) || allowedKeys.has(titleKey);
  });
}

function filterByMinYear(items, minYear = 2019) {
  return items.filter((item) => (item.year || 0) >= minYear);
}

function sortPublicationsNewest(items) {
  return [...items].sort((a, b) => {
    if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
    if ((b.month || 0) !== (a.month || 0)) return (b.month || 0) - (a.month || 0);
    if ((b.day || 0) !== (a.day || 0)) return (b.day || 0) - (a.day || 0);
    return (a.title || "").localeCompare(b.title || "");
  });
}

function applyPublicationCorrections(items) {
  const targetTitleKey = `title:${normalizeTitle(
    "Auditory stimuli extend the temporal window of visual integration by modulating alpha-band oscillations",
  )}`;

  return items.map((item) => {
    const itemTitleKey = `title:${normalizeTitle(item.title || "")}`;
    if (itemTitleKey !== targetTitleKey) return item;

    return {
      ...item,
      venue: "eLife",
      year: 2025,
      month: 12,
      day: 31,
      doi: "10.7554/eLife.105531.1",
      url: "https://elifesciences.org/reviewed-preprints/105531",
      dedupeKey: "doi:10.7554/elife.105531.1",
    };
  });
}

function applyPublicationDoiOverrides(items) {
  const overrideByTitle = new Map(
    (publicationDoiOverrides || []).map((item) => [item.titleKey || normalizeTitle(item.title || ""), item]),
  );

  return items.map((item) => {
    const key = normalizeTitle(item.title || "");
    const override = overrideByTitle.get(key);
    if (!override) return item;
    const next = { ...item };
    if (override.doi) {
      next.doi = cleanDoi(override.doi);
      next.dedupeKey = `doi:${cleanDoi(override.doi).toLowerCase()}`;
    }
    if (override.authors) next.authors = normalizeAuthorsText(override.authors);
    if (override.venue) next.venue = override.venue;
    if (override.year) next.year = override.year;
    if (override.url) next.url = override.url;
    return next;
  });
}

function getDisplayAuthorInfo(authorText, authorMarks) {
  if (!authorText) return [{ type: "text", value: "Authors unavailable" }];
  const parts = [];
  const regex = /(Han,\s*Biao|Biao\s+Han|Shen,\s*Lu|Lu\s+Shen)/gi;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(authorText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: authorText.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    const isHan = /(Han,\s*Biao|Biao\s+Han)/i.test(raw);
    const key = isHan ? "Han Biao" : "Shen Lu";
    const mark = authorMarks?.[key] || { bold: true, equalFirst: false, corresponding: false };
    parts.push({
      type: "author",
      value: raw,
      bold: mark.bold !== false,
      equalFirst: Boolean(mark.equalFirst),
      corresponding: Boolean(mark.corresponding),
    });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < authorText.length) {
    parts.push({ type: "text", value: authorText.slice(lastIndex) });
  }
  return parts;
}

function Header({ pathname, lang, onToggleLang, onNavigate, ui, links }) {
  const navClass = (path) =>
    `nav-link ${pathname === path ? "nav-link--active" : ""}`;

  return (
    <nav className="top-nav">
      <div className="top-nav__brand">
        <BrainWaveLogo className="top-nav__logo" maskId="nav-brain-mask" />
        <a
          href={links.home}
          className="top-nav__brand-name"
          onClick={(event) => onNavigate(event, links.home)}
        >
          BSD Lab
        </a>
      </div>

      <div className="top-nav__right">
        <div className="top-nav__links" aria-label="Primary">
          <a
            href={links.home}
            className={navClass("/")}
            onClick={(event) => onNavigate(event, links.home)}
          >
            {ui.nav.home}
          </a>
          <a
            href={links.publications}
            className={navClass("/publications")}
            onClick={(event) => onNavigate(event, links.publications)}
          >
            {ui.nav.publications}
          </a>
          <a
            href={links.team}
            className={navClass("/team")}
            onClick={(event) => onNavigate(event, links.team)}
          >
            {ui.nav.team}
          </a>
          <a
            href={links.contact}
            className="nav-link"
            onClick={(event) => onNavigate(event, links.contact)}
          >
            {ui.nav.contact}
          </a>
        </div>
        <button className="lang-toggle" type="button" onClick={onToggleLang}>
          {lang === "en" ? "中文" : "EN"}
        </button>

        <button className="top-nav__menu" aria-label="Open navigation menu" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>
    </nav>
  );
}

function Hero({ mode, ui, links }) {
  const isClassic = mode === "classic";

  return (
    <main className="hero">
      <section className="hero__copy">
        <div className="hero__kicker">
          <div className="hero__line" />
          <span>{ui.hero.kicker}</span>
        </div>

        <h1>{ui.hero.title1}</h1>
        <h2>{ui.hero.title2}</h2>

        <p>{ui.hero.body}</p>

        <div className="hero__actions">
          <a href="#join" className="button button--primary">
            {ui.hero.ctaPrimary}
          </a>
          <a href={links.publications} className="button button--ghost">
            {ui.hero.ctaSecondary}
          </a>
        </div>
      </section>

      <section className="hero__visual" aria-label="BSD Lab hero graphic">
        {isClassic ? <div className="hero__glow" /> : null}
        <BrainWaveLogo
          className="hero__logo"
          maskId="hero-brain-mask"
          showGlow={isClassic}
          variant="hero"
        />
      </section>
    </main>
  );
}

function WhatWeDoSection({ ui }) {
  return (
    <section className="what-we-do-section" id="what-we-do">
      <div className="section-heading section-heading--center">
        <h3>{ui.what.title}</h3>
        <p>{ui.what.desc}</p>
      </div>

      <div className="what-we-do-grid">
        <article className="what-we-do-card">
          <h4>{ui.what.methodTitle}</h4>
          <ul>
            {ui.what.methods.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="what-we-do-card">
          <h4>{ui.what.questionTitle}</h4>
          <ul>
            {ui.what.questions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function JoinUsSection({ ui }) {
  return (
    <section className="join-section" id="join">
      <div className="section-heading section-heading--center">
        <h3>{ui.join.title}</h3>
        <p>{ui.join.desc}</p>
      </div>

      <div className="join-grid">
        <article className="join-card">
          <h4>{ui.join.fieldTitle}</h4>
          <ul>
            {ui.join.fields.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="join-card">
          <h4>{ui.join.interestTitle}</h4>
          <ul>
            {ui.join.interests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <p className="join-note">{ui.join.note}</p>
      <p className="join-contact">
        Contact:{" "}
        <a href="mailto:biao.han@m.scnu.edu.cn">biao.han@m.scnu.edu.cn</a>
        {" "}or{" "}
        <a href="mailto:lu.shen2013@gmail.com">lu.shen2013@gmail.com</a>
      </p>
    </section>
  );
}

function UpdatesSection({ ui, lang }) {
  const updates = updatesByLang[lang] || updatesByLang.en;
  return (
    <section className="updates-section" id="updates">
      <div className="section-heading section-heading--center">
        <h3>{ui.updates.title}</h3>
        <p>{ui.updates.desc}</p>
      </div>
      <div className="updates-list">
        {updates.map((item) => (
          <article key={`${item.date}-${item.title}`} className="update-item">
            <p className="update-item__date">{item.date}</p>
            <h4>{item.title}</h4>
            <p>{item.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FacultyCard({ profile, ctaLabel, ctaHref, external = true }) {
  return (
    <article className="faculty-card">
      <div className="person-photo-placeholder person-photo-placeholder--faculty" aria-label={`${profile.name} photo placeholder`}>
        <span>Photo Placeholder</span>
      </div>
      <p className="faculty-card__role">{profile.role}</p>
      <h4>
        {profile.name} <span>{profile.nameCn}</span>
      </h4>
      <p className="faculty-card__bio">{profile.bioShort || profile.bio}</p>
      <div className="faculty-card__tags">
        {profile.keywords.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="faculty-card__actions">
        <a
          href={ctaHref}
          className="faculty-card__cta"
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

function StudentPlaceholderCard({ student }) {
  return (
    <article className="student-card">
      <div className="person-photo-placeholder person-photo-placeholder--student" aria-label="Student photo placeholder">
        <span>Photo Placeholder</span>
      </div>
      <p className="student-card__role">Student</p>
      <h4>
        {student.name}
        {student.nameCn ? <span>{student.nameCn}</span> : null}
      </h4>
      <p className="student-card__interest">{student.interest}</p>
      <p className="student-card__bio">{student.bio}</p>
      <button className="student-card__cta" type="button" disabled>
        Profile coming soon
      </button>
    </article>
  );
}

function PeopleSection() {
  return (
    <section className="people-section" id="team">
      <div className="section-heading section-heading--center">
        <h3>People</h3>
        <p>Our team combines theory, neuroscience, and engineering to study brain state dynamics.</p>
      </div>

      <figure className="team-photo">
        <img src={groupPhoto} alt="BSD Lab group photo" className="team-photo__img--full" />
      </figure>

      <div className="people-subsection">
        <h4>Faculty</h4>
      </div>
      <div className="people-grid">
        <FacultyCard profile={hanProfile} ctaLabel="Visit Website" ctaHref={hanProfile.website} />
        <FacultyCard profile={shenProfile} ctaLabel="View Publications" ctaHref="/publications" external={false} />
      </div>

      <div className="people-subsection people-subsection--students">
        <h4>Students</h4>
        <p>Student profiles will be updated soon. We welcome applicants interested in neural dynamics and BCI.</p>
      </div>
      <div className="students-grid">
        {studentPlaceholders.map((student) => (
          <StudentPlaceholderCard key={student.id} student={student} />
        ))}
      </div>
    </section>
  );
}

function classifyPublicationType(item) {
  const venue = (item.venue || "").toLowerCase();
  const url = (item.url || "").toLowerCase();
  const doi = (item.doi || "").toLowerCase();

  if (
    venue === "elife" &&
    (/reviewed-preprint/.test(url) || /elife\.\d+\.\d+$/.test(doi) || /elife\.\d+\.\d+/.test(doi))
  ) {
    return "preprint";
  }

  if (/arxiv|biorxiv|preprint|reviewed preprint/.test(venue)) return "preprint";
  if (
    /neurips|nips|icml|iclr|aaai|ijcai|conference|proceedings|symposium|workshop|icpr|ijcnn|acm|ieee/.test(
      venue,
    )
  ) {
    return "conference";
  }
  return "journal";
}

function groupPublicationsByType(items) {
  return {
    journal: items.filter((item) => classifyPublicationType(item) === "journal"),
    conference: items.filter((item) => classifyPublicationType(item) === "conference"),
    preprint: items.filter((item) => classifyPublicationType(item) === "preprint"),
  };
}

function PublicationsPage({ items, ui, links }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      const aDate = (a.year || 0) * 10000 + (a.month || 0) * 100 + (a.day || 0);
      const bDate = (b.year || 0) * 10000 + (b.month || 0) * 100 + (b.day || 0);
      if (sortOrder === "oldest") return aDate - bDate;
      return bDate - aDate;
    });
    return sorted;
  }, [items, sortOrder]);

  const noConferenceItems = sortedItems.filter(
    (item) => classifyPublicationType(item) !== "conference",
  );

  const visibleItems =
    activeFilter === "all"
      ? noConferenceItems
      : noConferenceItems.filter((item) => classifyPublicationType(item) === activeFilter);

  const grouped = groupPublicationsByType(visibleItems);

  const sections = [
    { key: "preprint", label: ui.publications.preprints, entries: grouped.preprint },
    { key: "journal", label: ui.publications.journals, entries: grouped.journal },
  ];

  const renderPublication = (item) => (
    <article className="publication-archive-item" key={`${item.id}-${item.title}`}>
      <div className="publication-archive-item__head">
        <span className="publication-archive-item__year">{item.year || "n.d."}</span>
        <h3>{item.title}</h3>
      </div>
      <p className="publication-archive-item__authors">{item.authors || "Authors unavailable"}</p>
      <div className="publication-archive-item__meta">
        <span>{item.venue || "Venue unavailable"}</span>
        <span className="publication-archive-item__dot" />
        {item.url ? (
          <a href={item.url} target="_blank" rel="noreferrer noopener">
            {/\.pdf(\?|$)/i.test(item.url) ? "PDF" : "Link"}
          </a>
        ) : null}
        {item.doi ? (
          <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noreferrer noopener">
            DOI: {item.doi}
          </a>
        ) : null}
      </div>
    </article>
  );

  return (
    <main className="publications-page publications-page--editorial">
      <section className="publications-archive-hero">
        <div className="hero__kicker publications-archive-hero__kicker">
          <div className="hero__line" />
          <span>{ui.publications.archives}</span>
        </div>
        <h1>{ui.publications.title}</h1>
        <p>{ui.publications.subtitle}</p>
      </section>

      <section className="publications-archive-toolbar">
        <div className="publications-archive-toolbar__filters">
          <button
            type="button"
            className={`pub-filter-btn ${activeFilter === "all" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            {ui.publications.all}
          </button>
          <button
            type="button"
            className={`pub-filter-btn ${activeFilter === "journal" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("journal")}
          >
            {ui.publications.journals}
          </button>
          <button
            type="button"
            className={`pub-filter-btn ${activeFilter === "preprint" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("preprint")}
          >
            {ui.publications.preprints}
          </button>
        </div>
        <div className="publications-archive-toolbar__sort">
          <span>{ui.publications.sortBy}</span>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="newest">{ui.publications.newest}</option>
            <option value="oldest">{ui.publications.oldest}</option>
          </select>
        </div>
      </section>

      <section className="publications-archive-groups" id="publications">
        {sections.map((section) =>
          section.entries.length ? (
            <section className="publication-archive-section" key={section.key}>
              <h2>
                {section.label}
                <div className="publication-archive-section__line" />
              </h2>
              <div>{section.entries.map((item) => renderPublication(item))}</div>
            </section>
          ) : null,
        )}
        {!visibleItems.length ? (
          <p className="publication-archive-empty">
            {ui.publications.empty}
          </p>
        ) : null}
      </section>

      <section className="publications-archive-cta">
        <p>{ui.publications.cta}</p>
        <a href={links.contact} className="publications-archive-cta__button">
          {ui.publications.ctaButton}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </section>
    </main>
  );
}

function TeamPage({ ui, links }) {
  const faculty = [
    {
      profile: hanProfile,
      title: "Principal Investigator",
      image: hanBiaoPhoto,
      imageWrapClass: "team-faculty-card__image-wrap--han",
      imageClass: "team-faculty-card__image--han-zoom",
      imagePosition: "center 34%",
      emails: ["biao.han@m.scnu.edu.cn"],
      links: [
        { label: "Google Scholar", href: "https://scholar.google.com/scholar?q=Biao+Han" },
        { label: "Website", href: hanProfile.website },
      ],
    },
    {
      profile: shenProfile,
      title: "Principal Investigator",
      image: shenLuPhotoCrop,
      imageWrapClass: "team-faculty-card__image-wrap--han",
      imageClass: "team-faculty-card__image--shen-zoom",
      imagePosition: "50% 36%",
      emails: ["lu.shen2013@gmail.com", "lushen@m.scnu.edu.cn"],
      links: [
        { label: "Google Scholar", href: "https://scholar.google.com/scholar?q=Lu+Shen" },
        { label: ui.nav.publications, href: links.publications },
      ],
    },
  ];

  return (
    <main className="team-page team-page--editorial">
      <section className="team-hero">
        <div className="hero__kicker team-hero__kicker">
          <div className="hero__line" />
          <span>{ui.team.kicker}</span>
        </div>
        <h1>{ui.team.title}</h1>
        <p>{ui.team.subtitle}</p>
      </section>

      <figure className="team-photo team-photo--editorial">
        <img src={groupPhoto} alt="BSD Lab group photo" className="team-photo__img--full" />
      </figure>

      <section className="team-faculty">
        {faculty.map((item) => (
          <article className="team-faculty-card" key={item.profile.name}>
            <div className={`team-faculty-card__image-wrap ${item.imageWrapClass || ""}`}>
              <img
                src={item.image}
                alt={item.profile.name}
                className={`team-faculty-card__image ${item.imageClass || ""}`}
                style={{ objectPosition: item.imagePosition || "center" }}
              />
            </div>
            <div className="team-faculty-card__content">
              <h3>{item.profile.name}</h3>
              <p className="team-faculty-card__role">{item.title}</p>
              <div className="team-faculty-card__keywords">
                {item.profile.keywords.map((tag) => (
                  <span key={`${item.profile.name}-${tag}`}>{tag}</span>
                ))}
              </div>
              <div className="team-faculty-card__contacts">
                {item.emails?.map((email) => (
                  <p key={`${item.profile.name}-${email}`} className="team-faculty-card__contact-row">
                    <span>Email:</span>{" "}
                    <a href={`mailto:${email}`} className="team-faculty-card__contact-link">
                      {email}
                    </a>
                  </p>
                ))}
              </div>
              {item.links?.length ? (
                <div className="team-faculty-card__links">
                  {item.links.map((link) => (
                    <a
                      key={`${item.profile.name}-${link.label}`}
                      href={link.href}
                      target={/^https?:\/\//.test(link.href) ? "_blank" : undefined}
                      rel={/^https?:\/\//.test(link.href) ? "noreferrer noopener" : undefined}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="team-fellows">
        <div className="team-fellows__heading">
          <h4>{ui.team.members}</h4>
          <div className="team-fellows__line" />
        </div>
        <div className="team-fellows__grid">
          {teamMembers.map((member) => (
            <article className="team-fellow-card" key={member.id}>
              <div className="team-fellow-card__image-wrap">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-fellow-card__image"
                  style={
                    member.id === "dingxian-huang"
                      ? { objectPosition: "50% 42%" }
                      : undefined
                  }
                />
              </div>
              <h5>{member.name}</h5>
              {member.nameCn ? <p className="team-fellow-card__name-cn">{member.nameCn}</p> : null}
              <p className="team-fellow-card__role">{member.interest}</p>
              <div className="team-fellow-card__bio-wrap" data-bio={member.bioLong} aria-label="Bio preview area" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Footer({ ui, links }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__brand">
        <BrainWaveLogo className="site-footer__logo" maskId="footer-brain-mask" />
        <div>
          <p className="site-footer__title">BSD Lab</p>
          <p className="site-footer__subtitle">{ui.footer.subtitle || "University Research Center"}</p>
        </div>
      </div>

      <div className="site-footer__links">
        <a href={links.publications}>{ui.footer.publications}</a>
        <a href={links.team}>{ui.footer.team}</a>
        <a href={links.contact}>{ui.footer.contact}</a>
      </div>

      <div className="site-footer__copyright">{ui.footer.copyright || "(c) 2026 Brain State Dynamics Lab. All rights reserved."}</div>
      <div className="site-footer__affiliation" aria-label="South China Normal University">
        <img src={scnuLogo} alt="South China Normal University logo" />
      </div>
    </footer>
  );
}

export default function App() {
  const refreshTimerRef = useRef(null);
  const [modeControl, setModeControl] = useState("auto");
  const [manualMode, setManualMode] = useState("classic");
  const [autoMode, setAutoMode] = useState(() => getFallbackAutoMode(new Date()));
  const [lang, setLang] = useState("en");
  const [coords, setCoords] = useState(null);
  const [publications, setPublications] = useState([]);
  const [pathname, setPathname] = useState(() => getRouteFromHash());

  const mode = useMemo(
    () => (modeControl === "auto" ? autoMode : manualMode),
    [autoMode, manualMode, modeControl],
  );

  useEffect(() => {
    const urlLang = getLangFromUrl();
    if (urlLang) {
      setLang(urlLang);
    }

    const savedControl = window.localStorage.getItem(MODE_CONTROL_KEY);
    if (savedControl === "auto" || savedControl === "manual") {
      setModeControl(savedControl);
    }

    const savedManual = window.localStorage.getItem(MANUAL_MODE_KEY);
    if (isKnownMode(savedManual)) {
      setManualMode(savedManual);
    }

    const savedCoordsRaw = window.localStorage.getItem(LAST_COORDS_KEY);
    if (savedCoordsRaw) {
      try {
        const savedCoords = JSON.parse(savedCoordsRaw);
        if (typeof savedCoords?.lat === "number" && typeof savedCoords?.lng === "number") {
          setCoords(savedCoords);
        }
      } catch {
        // Ignore invalid cache and continue.
      }
    }

    const savedLang = window.localStorage.getItem(LANG_KEY);
    if (!urlLang && (savedLang === "en" || savedLang === "zh")) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(getRouteFromHash());
      const urlLang = getLangFromUrl();
      if (urlLang) setLang(urlLang);
    };
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MODE_CONTROL_KEY, modeControl);
  }, [modeControl]);

  useEffect(() => {
    window.localStorage.setItem(MANUAL_MODE_KEY, manualMode);
  }, [manualMode]);

  useEffect(() => {
    window.localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    const target = buildInternalHref(pathname, lang);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current !== target) {
      window.history.replaceState({}, "", target);
    }
  }, [lang, pathname]);

  useEffect(() => {
    document.title =
      lang === "zh"
        ? "BSD Lab - 脑状态动力学实验室"
        : "BSD Lab - Brain State Dynamics Lab";
  }, [lang]);

  useEffect(() => {
    if (!coords) return;
    window.localStorage.setItem(LAST_COORDS_KEY, JSON.stringify(coords));
  }, [coords]);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // Permission denied or unavailable. Cached coords/fallback will be used.
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 15 * 60 * 1000 },
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    const clearTimer = () => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };

    const schedule = (delayMs) => {
      clearTimer();
      refreshTimerRef.current = window.setTimeout(() => {
        void updateAutoMode();
      }, delayMs);
    };

    const updateAutoMode = async () => {
      const now = new Date();

      if (!coords) {
        setAutoMode(getFallbackAutoMode(now));
        schedule(30 * 60 * 1000);
        return;
      }

      try {
        const sunWindow = await fetchSunWindow(coords, getDateToken(now));
        if (cancelled) return;
        setAutoMode(computeModeFromSun(now, sunWindow));
        schedule(getNextRefreshDelay(now, sunWindow));
      } catch {
        if (cancelled) return;
        setAutoMode(getFallbackAutoMode(now));
        schedule(30 * 60 * 1000);
      }
    };

    void updateAutoMode();

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [coords]);

  useEffect(() => {
    let active = true;
    const loadPublications = async () => {
      try {
        const [bibResponse, annotationResponse, hanSiteItems] = await Promise.all([
          fetch(bibUrl),
          fetch(annotationUrl),
          fetchHanPublicationsFromSite(),
        ]);
        const text = await bibResponse.text();
        const annotationText = await annotationResponse.text();
        const { annotations, allowedKeys } = parseAnnotationCsv(annotationText);
        const bibItems = parseBibPublications(text);
        const merged = mergeAndDeduplicatePublications([
          ...bibItems,
          ...hanSiteItems,
          ...manualPublications,
        ]);
        const corrected = applyPublicationCorrections(merged);
        const filteredByYear = filterByMinYear(corrected, 2019);
        const filtered = filterByAllowedKeys(filteredByYear, allowedKeys);
        const doiPatched = applyPublicationDoiOverrides(filtered);
        const withManualMarks = applyManualAnnotations(doiPatched, annotations);
        const sortedFinal = sortPublicationsNewest(withManualMarks);
        if (!active) return;
        setPublications(sortedFinal);
      } catch {
        if (!active) return;
        try {
          const [bibResponse, annotationResponse] = await Promise.all([
            fetch(bibUrl),
            fetch(annotationUrl),
          ]);
          const text = await bibResponse.text();
          const annotationText = await annotationResponse.text();
          const { annotations, allowedKeys } = parseAnnotationCsv(annotationText);
          const merged = mergeAndDeduplicatePublications([
            ...parseBibPublications(text),
            ...manualPublications,
          ]);
          const corrected = applyPublicationCorrections(merged);
          const filteredByYear = filterByMinYear(corrected, 2019);
          const filtered = filterByAllowedKeys(filteredByYear, allowedKeys);
          const doiPatched = applyPublicationDoiOverrides(filtered);
          const withManualMarks = applyManualAnnotations(doiPatched, annotations);
          const sortedFinal = sortPublicationsNewest(withManualMarks);
          setPublications(sortedFinal);
        } catch {
          setPublications([]);
        }
      }
    };
    void loadPublications();
    return () => {
      active = false;
    };
  }, []);

  const isPublicationsPage = pathname === "/publications";
  const isTeamPage = pathname === "/team";
  const ui = copyByLang[lang] || copyByLang.en;
  const links = useMemo(
    () => ({
      home: buildInternalHref("/", lang),
      publications: buildInternalHref("/publications", lang),
      team: buildInternalHref("/team", lang),
      contact: buildInternalHref("/", lang),
    }),
    [lang],
  );

  const handleToggleLang = () => {
    setLang((prev) => {
      const next = prev === "en" ? "zh" : "en";
      const nextHref = buildInternalHref(getRouteFromHash(), next);
      window.history.replaceState({}, "", nextHref);
      window.localStorage.setItem(LANG_KEY, next);
      return next;
    });
  };

  const handleNavigate = (event, href) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current === href) return;
    window.history.pushState({}, "", href);
    setPathname(getRouteFromHash());
  };

  return (
    <div className="site-shell" data-mode={mode} data-lang={lang}>
      <BackgroundWave className="background-wave background-wave--top" variant="fill" />
      <BackgroundWave className="background-wave background-wave--bottom" variant="stroke" />
      <Header
        pathname={pathname}
        lang={lang}
        onToggleLang={handleToggleLang}
        onNavigate={handleNavigate}
        ui={ui}
        links={links}
      />
      {isPublicationsPage ? (
        <PublicationsPage items={publications} ui={ui} links={links} />
      ) : isTeamPage ? (
        <TeamPage ui={ui} links={links} />
      ) : (
        <>
          <Hero mode={mode} ui={ui} links={links} />
          <WhatWeDoSection ui={ui} />
          <JoinUsSection ui={ui} />
          <UpdatesSection ui={ui} lang={lang} />
        </>
      )}
      <Footer ui={ui} links={links} />
    </div>
  );
}
