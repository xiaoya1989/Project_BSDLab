# BSD Lab Website

Brain State Dynamics Lab（BSD Lab）官方网站源码。网站使用 React + Vite 构建，内容合并到 `main` 分支后由 GitHub Actions 自动发布到 GitHub Pages。

## 学生维护入口

学生日常只需要维护以下内容：

- `content/posts/`：实验室动态、活动、招生与项目新闻
- `content/site-content.json`：首页固定文案、研究方向和教师介绍
- `public/posts/`：新闻配图
- `team_members/`：成员简介与头像
- `exported-references.bib`：从文献管理软件导出的论文记录
- `publications_annotation_template.csv`：论文筛选及作者标记
- `src/publication_doi_overrides.json`：论文 DOI、作者、期刊或链接修正

维护资料：

- [`docs/student-codex-quickstart.md`](docs/student-codex-quickstart.md)：学生使用 Codex 的账号准备、提示词与提交流程。
- [`docs/content-maintenance.md`](docs/content-maintenance.md)：各类网站内容的格式和维护规则。
- [`AGENTS.md`](AGENTS.md)：Codex 自动读取的项目权限、隐私和检查要求。

## 推荐协作流程

1. 从最新 `main` 创建 `content/...` 分支。
2. 只修改本次任务涉及的内容和图片。
3. 提交 Pull Request，不直接提交到 `main`。
4. 等待 `Validate and build` 自动检查通过。
5. 由网站负责人审核并合并。
6. 合并后 GitHub Pages 自动发布；启用微信密钥时，符合条件的新闻会进入微信公众号草稿箱。

## 本地检查

需要 Node.js 20 或更高版本。

```bash
npm ci
npm run validate:content
npm run dev
```

提交前建议运行完整检查：

```bash
npm run check
```

## 权限边界

- 学生：新闻、首页固定文案、成员、论文资料和对应图片。
- 网站负责人：`src/`、`.github/`、依赖、域名、部署和微信公众号密钥。
- 任何包含个人联系方式、未公开成果或患者/被试信息的内容，发布前必须由负责人确认。
