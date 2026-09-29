(function exposeBsdPostImageComponent(root) {
  "use strict";

  const IMAGE_PATTERN = /^!\[((?:\\.|[^\]])*)\]\(([^\s)]+)\)$/m;

  function fromBlock(match) {
    return {
      alt: String(match[1] || "").replace(/\\([\\\]])/g, "$1"),
      src: match[2] || "",
    };
  }

  function toBlock(value) {
    const image = value || {};
    const alt = String(image.alt || "")
      .replace(/\\/g, "\\\\")
      .replace(/\]/g, "\\]")
      .trim();
    const src = String(image.src || "").trim();

    return `![${alt}](${src})`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function toPreview(value, getAsset) {
    const image = value || {};
    const asset =
      image.src && typeof getAsset === "function"
        ? getAsset(image.src)
        : image.src;
    const src = asset?.toString ? asset.toString() : asset;

    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(image.alt)}">`;
  }

  const definition = {
    id: "bsd-upload-image",
    label: "拖拽上传图片",
    fields: [
      {
        name: "src",
        label: "图片文件",
        widget: "image",
        choose_url: false,
        allow_multiple: false,
        hint: "把图片拖到上传区，或点击选择本地文件；无需填写 URL。",
        media_library: {
          config: {
            max_file_size: 1572864,
          },
        },
      },
      {
        name: "alt",
        label: "图片说明（替代文字）",
        widget: "string",
        hint: "简要说明图片中的人物、场景或 PPT 内容，便于无障碍阅读和负责人审核。",
      },
    ],
    pattern: IMAGE_PATTERN,
    fromBlock,
    toBlock,
    toPreview,
  };

  root.BsdPostImageComponent = {
    definition,
    fromBlock,
    toBlock,
    toPreview,
  };
})(window);
