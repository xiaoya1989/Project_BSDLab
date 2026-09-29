(function exposeBsdPostFormat(root) {
  "use strict";

  const yaml = root.jsyaml;
  const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
  const ZH_MARKER = /<!--\s*zh\s*-->/i;
  const EN_MARKER = /<!--\s*en\s*-->/i;

  function splitBilingualBody(body) {
    const zhMatch = ZH_MARKER.exec(body);
    const enMatch = EN_MARKER.exec(body);

    if (!zhMatch || !enMatch || zhMatch.index > enMatch.index) {
      return {
        body_zh: body.trim(),
        body_en: "",
      };
    }

    return {
      body_zh: body
        .slice(zhMatch.index + zhMatch[0].length, enMatch.index)
        .trim(),
      body_en: body.slice(enMatch.index + enMatch[0].length).trim(),
    };
  }

  function fromFile(text) {
    const normalized = String(text || "").replace(/^\uFEFF/, "");
    const frontmatterMatch = FRONTMATTER_PATTERN.exec(normalized);

    if (!frontmatterMatch) {
      throw new Error("文章缺少有效的 YAML frontmatter。");
    }

    const frontmatter =
      yaml.load(frontmatterMatch[1], { schema: yaml.JSON_SCHEMA }) || {};
    const bilingualBody = splitBilingualBody(
      normalized.slice(frontmatterMatch[0].length),
    );

    return Object.assign({}, frontmatter, bilingualBody);
  }

  function toFile(value) {
    const data = Object.assign({}, value || {});
    const bodyZh = String(data.body_zh || "").trim();
    const bodyEn = String(data.body_en || "").trim();

    delete data.body;
    delete data.body_zh;
    delete data.body_en;

    if (typeof data.date === "string") {
      data.date = data.date.slice(0, 10);
    }

    const frontmatter = yaml.dump(data, {
      schema: yaml.JSON_SCHEMA,
      noRefs: true,
      lineWidth: -1,
      sortKeys: false,
    });

    return [
      "---",
      frontmatter.trimEnd(),
      "---",
      "<!-- zh -->",
      bodyZh,
      "",
      "<!-- en -->",
      bodyEn,
      "",
    ].join("\n");
  }

  root.BsdPostFormat = { fromFile, toFile };
})(window);
