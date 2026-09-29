(function initializeBsdLabCms() {
  "use strict";

  const CMS = window.CMS;
  const postFormat = window.BsdPostFormat;

  if (!CMS || !postFormat) {
    document.body.innerHTML =
      '<main class="cms-loading"><div><strong>编辑器加载失败</strong>请刷新页面，或联系网站负责人。</div></main>';
    return;
  }

  document.querySelector(".cms-loading")?.remove();

  CMS.registerCustomFormat("bsd-post", "md", postFormat);

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

  CMS.registerPreviewStyle("/admin/preview.css");
  CMS.registerPreviewTemplate("posts", PostPreview);
  CMS.init();
})();
