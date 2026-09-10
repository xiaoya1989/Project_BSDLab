# 内容目录

网站新闻保存在 `posts/` 中，每篇新闻对应一个 Markdown 文件。

- 新建新闻时复制 `templates/post-template.md`，不要直接修改模板。
- 文件名与 `slug` 必须一致，例如 `lab-retreat-2026.md`。
- 新闻配图放在 `public/posts/<slug>/`。
- 中文正文写在 `<!-- zh -->` 后，英文正文写在 `<!-- en -->` 后。
- `publish_to_wechat: true` 会在部署时尝试创建微信公众号草稿，请在提交前确认。

详细说明见项目根目录下的 `docs/content-maintenance.md`。
