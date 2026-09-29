(function exposeBsdMemberFormat(root) {
  "use strict";

  function fromFile(text) {
    const normalized = String(text || "").replace(/^\uFEFF/, "");
    const profile = JSON.parse(normalized);

    if (!profile || Array.isArray(profile) || typeof profile !== "object") {
      throw new Error("成员资料必须是一个 JSON 对象。");
    }

    return profile;
  }

  function toFile(value) {
    const profile = Object.assign({}, value || {});
    return `${JSON.stringify(profile, null, 2)}\n`;
  }

  root.BsdMemberFormat = { fromFile, toFile };
})(window);
