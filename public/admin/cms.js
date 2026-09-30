(function initializeBsdLabCms() {
  "use strict";

  const CMS = window.CMS;
  const postFormat = window.BsdPostFormat;
  const memberFormat = window.BsdMemberFormat;
  const postImageComponent = window.BsdPostImageComponent;

  if (!CMS || !postFormat || !memberFormat || !postImageComponent) {
    document.body.innerHTML =
      '<main class="cms-loading"><div><strong>编辑器加载失败</strong>请刷新页面，或联系网站负责人。</div></main>';
    return;
  }

  document.querySelector(".cms-loading")?.remove();

  CMS.registerCustomFormat("bsd-post", "md", postFormat);
  CMS.registerCustomFormat("bsd-member-json", "json", memberFormat);
  CMS.registerEditorComponent(postImageComponent.definition);

  const h = window.h;

  function value(entry, field) {
    return entry.getIn(["data", field]) || "";
  }

  function PostPreview({ entry, getAsset, widgetFor }) {
    const coverPath = value(entry, "cover_image");
    const cover = coverPath ? getAsset(coverPath) : null;

    return h(
      "article",
      { className: "bsd-preview" },
      h(
        "header",
        { className: "bsd-preview__header" },
        h("span", { className: "bsd-preview__date" }, value(entry, "date")),
        h("h1", null, value(entry, "title_zh")),
        h("p", { className: "bsd-preview__summary" }, value(entry, "summary_zh")),
      ),
      cover
        ? h("img", {
            className: "bsd-preview__cover",
            src: cover.toString(),
            alt: value(entry, "title_zh"),
          })
        : null,
      h("section", { className: "bsd-preview__body" }, widgetFor("body_zh")),
      h("hr", null),
      h(
        "header",
        { className: "bsd-preview__header bsd-preview__header--en" },
        h("h1", null, value(entry, "title_en")),
        h("p", { className: "bsd-preview__summary" }, value(entry, "summary_en")),
      ),
      h("section", { className: "bsd-preview__body" }, widgetFor("body_en")),
    );
  }

  function MemberPreview({ entry }) {
    const keywords = entry.getIn(["data", "keywords"]);
    const keywordItems = keywords?.toArray ? keywords.toArray() : [];
    const enrollmentYear = value(entry, "enrollment_year");
    const graduationYear = value(entry, "graduation_year");
    const mastersEnrollmentYear = value(entry, "masters_enrollment_year");
    const mastersGraduationYear = value(entry, "masters_graduation_year");
    const destination = value(entry, "next_destination");
    const metaItems = [];
    if (mastersEnrollmentYear) {
      metaItems.push(`MSc ${mastersEnrollmentYear}–${mastersGraduationYear || ""}`);
    }
    if (enrollmentYear) {
      const prefix = mastersEnrollmentYear && value(entry, "role") === "PHD STUDENT" ? "PhD " : "";
      metaItems.push(`${prefix}${enrollmentYear}–${graduationYear || ""}`);
    }
    if (destination) metaItems.push(`→ ${destination}`);
    const links = [
      ["Google Scholar", entry.getIn(["data", "links", "google_scholar"])],
      ["个人网站", entry.getIn(["data", "links", "personal_website"])],
      ["GitHub", entry.getIn(["data", "links", "github"])],
    ].filter(([, url]) => url);

    return h(
      "article",
      { className: "member-preview" },
      h(
        "header",
        { className: "member-preview__header" },
        h("p", { className: "member-preview__eyebrow" }, value(entry, "role")),
        h("h1", null, value(entry, "name_cn")),
        h("p", { className: "member-preview__name-en" }, value(entry, "name")),
        h("p", { className: "member-preview__program" }, value(entry, "program")),
        metaItems.length
          ? h(
              "ul",
              { className: "member-preview__keywords" },
              ...metaItems.map((item) => h("li", { key: item }, item)),
            )
          : null,
      ),
      h("p", { className: "member-preview__short" }, value(entry, "bio_short")),
      h("p", { className: "member-preview__long" }, value(entry, "bio_long")),
      keywordItems.length
        ? h(
            "ul",
            { className: "member-preview__keywords" },
            ...keywordItems.map((keyword) => h("li", { key: keyword }, keyword)),
          )
        : null,
      h(
        "footer",
        { className: "member-preview__footer" },
        h("span", null, value(entry, "email")),
        ...links.map(([label, url]) =>
          h("a", { href: url, key: label, rel: "noreferrer" }, label),
        ),
      ),
    );
  }

  const memberProfileEntries = [
    "jianan-zhu",
    "mingxia-yang",
    "tingyu-zhou",
    "dingxian-huang",
    "dongdong-chen",
    "eve-zeng",
    "shengpei-zhao",
    "wei-song",
    "xiaoyu-deng",
    "xuantao-zhang",
    "yihua-chen",
    "yue-pan",
    "yuxiang-ma",
  ];

  CMS.registerPreviewStyle("/admin/preview.css");
  CMS.registerPreviewTemplate("posts", PostPreview);
  memberProfileEntries.forEach((entryName) => {
    CMS.registerPreviewTemplate(entryName, MemberPreview);
  });
  CMS.init();
})();
